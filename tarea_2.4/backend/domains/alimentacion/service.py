from datetime import date, datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from domains.alimentacion.models import DeteccionIaAlimentacion, EventoAlimentacion
from domains.alimentacion.schemas import (
    AnomaliasMarcadasRead,
    AnomaliaConsumoRead,
    IaDeteccionCreate,
    PromedioDiarioLoteRead,
    RfidEventoCreate,
)
from domains.ganado.models import Animal


ESTADO_CERRADO = "cerrado"
ESTADO_ANOMALIA = "anomalia"
ESTADOS_CONSUMO_FINALIZADO = (ESTADO_CERRADO, ESTADO_ANOMALIA)


def normalizar_datetime(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def parse_fecha(value) -> date:
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return date.fromisoformat(str(value))


async def obtener_animal(db: AsyncSession, animal_id: int) -> Animal | None:
    result = await db.execute(select(Animal).where(Animal.id == animal_id))
    return result.scalar_one_or_none()


async def crear_evento_rfid(db: AsyncSession, data: RfidEventoCreate) -> dict[str, int | str]:
    animal = await obtener_animal(db, data.animal_id)
    if animal is None:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    if animal.rfid != data.rfid:
        raise HTTPException(status_code=422, detail="RFID recibido no coincide con el RFID registrado para el animal")

    evento = EventoRfid(**data.model_dump())
    evento.timestamp = normalizar_datetime(data.timestamp)
    db.add(evento)
    await db.commit()
    await db.refresh(evento)
    return {"mensaje": "Evento RFID registrado", "id": evento.id}


async def crear_deteccion_ia(db: AsyncSession, data: IaDeteccionCreate) -> dict[str, int | str]:
    if data.animal_id is not None:
        animal = await obtener_animal(db, data.animal_id)
        if animal is None:
            raise HTTPException(status_code=404, detail="Animal no encontrado")

    deteccion = DeteccionIaAlimentacion(**data.model_dump())
    deteccion.timestamp = normalizar_datetime(data.timestamp)
    db.add(deteccion)
    await db.commit()
    await db.refresh(deteccion)
    return {"mensaje": "Detección IA registrada", "id": deteccion.id}


async def listar_eventos_animal(
    db: AsyncSession,
    animal_id: int,
    desde: datetime | None = None,
    hasta: datetime | None = None,
) -> list[EventoAlimentacion]:
    stmt = select(EventoAlimentacion).where(EventoAlimentacion.animal_id == animal_id)
    if desde is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in >= normalizar_datetime(desde))
    if hasta is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in <= normalizar_datetime(hasta))
    result = await db.execute(stmt.order_by(EventoAlimentacion.rfid_in))
    return list(result.scalars().all())


async def obtener_promedios_diarios_lote(
    db: AsyncSession,
    desde: datetime | None = None,
    hasta: datetime | None = None,
) -> list[PromedioDiarioLoteRead]:
    fecha_expr = func.date(EventoAlimentacion.rfid_in).label("fecha")
    stmt = (
        select(
            EventoAlimentacion.lote_id.label("lote_id"),
            fecha_expr,
            func.count(EventoAlimentacion.id).label("cantidad_eventos"),
            func.avg(EventoAlimentacion.duracion_segundos).label("promedio_segundos"),
            func.sum(EventoAlimentacion.duracion_segundos).label("total_segundos"),
        )
        .where(
            EventoAlimentacion.estado.in_(ESTADOS_CONSUMO_FINALIZADO),
            EventoAlimentacion.duracion_segundos.is_not(None),
        )
        .group_by(EventoAlimentacion.lote_id, fecha_expr)
        .order_by(EventoAlimentacion.lote_id, fecha_expr)
    )
    if desde is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in >= normalizar_datetime(desde))
    if hasta is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in <= normalizar_datetime(hasta))

    result = await db.execute(stmt)
    return [
        PromedioDiarioLoteRead(
            lote_id=row.lote_id,
            fecha=parse_fecha(row.fecha),
            cantidad_eventos=int(row.cantidad_eventos or 0),
            promedio_segundos=float(row.promedio_segundos or 0),
            total_segundos=int(row.total_segundos or 0),
        )
        for row in result.all()
    ]


async def calcular_promedio_historico_animal(db: AsyncSession, animal_id: int) -> float | None:
    promedio_result = await db.execute(
        select(func.avg(EventoAlimentacion.duracion_segundos)).where(
            EventoAlimentacion.animal_id == animal_id,
            EventoAlimentacion.estado == ESTADO_CERRADO,
            EventoAlimentacion.duracion_segundos.is_not(None),
        )
    )
    promedio = promedio_result.scalar_one_or_none()
    return float(promedio) if promedio is not None else None


def construir_anomalia_read(evento: EventoAlimentacion, promedio_historico: float) -> AnomaliaConsumoRead:
    return AnomaliaConsumoRead(
        id=evento.id,
        animal_id=evento.animal_id,
        lote_id=evento.lote_id,
        rfid_in=evento.rfid_in,
        rfid_out=evento.rfid_out,
        duracion_segundos=evento.duracion_segundos,
        ubicacion=evento.ubicacion,
        estado=evento.estado,
        confidence=float(evento.confidence) if evento.confidence is not None else None,
        promedio_historico=promedio_historico,
    )


async def listar_anomalias_animal(
    db: AsyncSession,
    animal_id: int,
    desde: datetime | None = None,
    hasta: datetime | None = None,
) -> list[AnomaliaConsumoRead]:
    promedio_historico = await calcular_promedio_historico_animal(db, animal_id)
    if promedio_historico is None:
        return []

    umbral = promedio_historico * 0.70
    stmt = select(EventoAlimentacion).where(
        EventoAlimentacion.animal_id == animal_id,
        EventoAlimentacion.estado.in_(ESTADOS_CONSUMO_FINALIZADO),
        EventoAlimentacion.duracion_segundos.is_not(None),
        EventoAlimentacion.duracion_segundos < umbral,
    )
    if desde is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in >= normalizar_datetime(desde))
    if hasta is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in <= normalizar_datetime(hasta))

    result = await db.execute(stmt.order_by(EventoAlimentacion.rfid_in))
    eventos = list(result.scalars().all())
    return [construir_anomalia_read(evento, promedio_historico) for evento in eventos]


async def marcar_anomalias_animal(
    db: AsyncSession,
    animal_id: int,
    desde: datetime | None = None,
    hasta: datetime | None = None,
) -> AnomaliasMarcadasRead:
    promedio_historico = await calcular_promedio_historico_animal(db, animal_id)
    if promedio_historico is None:
        return AnomaliasMarcadasRead(
            mensaje="No hay eventos cerrados suficientes para detectar anomalías",
            animal_id=animal_id,
            anomalias_detectadas=0,
            anomalias_marcadas=0,
            promedio_historico=None,
        )

    umbral = promedio_historico * 0.70
    stmt = select(EventoAlimentacion).where(
        EventoAlimentacion.animal_id == animal_id,
        EventoAlimentacion.estado == ESTADO_CERRADO,
        EventoAlimentacion.duracion_segundos.is_not(None),
        EventoAlimentacion.duracion_segundos < umbral,
    )
    if desde is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in >= normalizar_datetime(desde))
    if hasta is not None:
        stmt = stmt.where(EventoAlimentacion.rfid_in <= normalizar_datetime(hasta))

    result = await db.execute(stmt.order_by(EventoAlimentacion.rfid_in))
    eventos = list(result.scalars().all())
    for evento in eventos:
        evento.estado = ESTADO_ANOMALIA
        evento.updated_at = datetime.now(timezone.utc)
    if eventos:
        await db.commit()

    cantidad = len(eventos)
    return AnomaliasMarcadasRead(
        mensaje=f"Detección de anomalías ejecutada: {cantidad} eventos marcados",
        animal_id=animal_id,
        anomalias_detectadas=cantidad,
        anomalias_marcadas=cantidad,
        promedio_historico=promedio_historico,
    )
