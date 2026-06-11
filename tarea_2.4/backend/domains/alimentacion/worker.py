from datetime import datetime, timedelta, timezone

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from domains.alimentacion.models import DeteccionIaAlimentacion, EventoAlimentacion, EventoRfid
from domains.alimentacion.service import normalizar_datetime, obtener_animal


VENTANA_CORRELACION = timedelta(minutes=10)


async def _existe_evento_para_entrada(db: AsyncSession, entrada: EventoRfid) -> bool:
    result = await db.execute(
        select(EventoAlimentacion.id)
        .where(
            EventoAlimentacion.animal_id == entrada.animal_id,
            EventoAlimentacion.ubicacion == entrada.ubicacion,
            EventoAlimentacion.rfid_in == normalizar_datetime(entrada.timestamp),
        )
        .limit(1)
    )
    return result.scalar_one_or_none() is not None


async def _existe_evento_abierto(db: AsyncSession, animal_id: int) -> bool:
    result = await db.execute(
        select(EventoAlimentacion.id)
        .where(EventoAlimentacion.animal_id == animal_id, EventoAlimentacion.estado == "abierto")
        .limit(1)
    )
    return result.scalar_one_or_none() is not None


async def _buscar_deteccion_comiendo(db: AsyncSession, entrada: EventoRfid) -> DeteccionIaAlimentacion | None:
    rfid_in = normalizar_datetime(entrada.timestamp)
    result = await db.execute(
        select(DeteccionIaAlimentacion).where(
            DeteccionIaAlimentacion.comiendo.is_(True),
            DeteccionIaAlimentacion.ubicacion == entrada.ubicacion,
            DeteccionIaAlimentacion.timestamp >= rfid_in - VENTANA_CORRELACION,
            DeteccionIaAlimentacion.timestamp <= rfid_in + VENTANA_CORRELACION,
            or_(DeteccionIaAlimentacion.animal_id == entrada.animal_id, DeteccionIaAlimentacion.animal_id.is_(None)),
        )
    )
    detecciones = result.scalars().all()
    if not detecciones:
        return None

    return max(
        detecciones,
        key=lambda item: (
            float(item.confidence or 0),
            -abs((normalizar_datetime(item.timestamp) - rfid_in).total_seconds()),
        ),
    )


async def _abrir_eventos(db: AsyncSession) -> int:
    eventos_abiertos = 0
    entradas_result = await db.execute(
        select(EventoRfid).where(EventoRfid.tipo_evento == "entrada").order_by(EventoRfid.timestamp)
    )

    for entrada in entradas_result.scalars().all():
        if await _existe_evento_para_entrada(db, entrada):
            continue
        if await _existe_evento_abierto(db, entrada.animal_id):
            continue

        deteccion = await _buscar_deteccion_comiendo(db, entrada)
        if deteccion is None:
            continue

        animal = await obtener_animal(db, entrada.animal_id)
        if animal is None:
            continue

        db.add(
            EventoAlimentacion(
                animal_id=entrada.animal_id,
                lote_id=animal.lote_id,
                rfid_in=normalizar_datetime(entrada.timestamp),
                ubicacion=entrada.ubicacion,
                confidence=deteccion.confidence,
                estado="abierto",
            )
        )
        eventos_abiertos += 1

    return eventos_abiertos


async def _cerrar_eventos(db: AsyncSession) -> int:
    eventos_cerrados = 0
    abiertos_result = await db.execute(
        select(EventoAlimentacion).where(EventoAlimentacion.estado == "abierto").order_by(EventoAlimentacion.rfid_in)
    )

    for evento in abiertos_result.scalars().all():
        salida_result = await db.execute(
            select(EventoRfid)
            .where(
                EventoRfid.tipo_evento == "salida",
                EventoRfid.animal_id == evento.animal_id,
                EventoRfid.ubicacion == evento.ubicacion,
                EventoRfid.timestamp > evento.rfid_in,
            )
            .order_by(EventoRfid.timestamp)
            .limit(1)
        )
        salida = salida_result.scalar_one_or_none()
        if salida is None:
            continue

        rfid_in = normalizar_datetime(evento.rfid_in)
        rfid_out = normalizar_datetime(salida.timestamp)
        evento.rfid_out = rfid_out
        evento.duracion_segundos = max(int((rfid_out - rfid_in).total_seconds()), 0)
        evento.estado = "cerrado"
        evento.updated_at = datetime.now(timezone.utc)
        eventos_cerrados += 1

    return eventos_cerrados


async def correlacionar_eventos_alimentacion(db: AsyncSession) -> dict[str, int | str]:
    eventos_abiertos = await _abrir_eventos(db)
    await db.flush()
    eventos_cerrados = await _cerrar_eventos(db)

    if eventos_abiertos or eventos_cerrados:
        await db.commit()
    else:
        return {
            "mensaje": "No se encontraron datos suficientes para abrir o cerrar eventos de alimentación",
            "eventos_abiertos": 0,
            "eventos_cerrados": 0,
        }

    return {
        "mensaje": f"Worker ejecutado: {eventos_abiertos} abiertos, {eventos_cerrados} cerrados",
        "eventos_abiertos": eventos_abiertos,
        "eventos_cerrados": eventos_cerrados,
    }
