from datetime import datetime, timezone

import structlog
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from domains.alertas.event_bus import publicar_alerta_creada
from domains.alertas.models import ReglaAlerta
from domains.alertas.rule_engine import CondicionInvalidaError, construir_mensaje, evaluar_condicion
from domains.ganado.models import Alerta

logger = structlog.get_logger()


async def evaluar_evento_y_generar_alertas(tipo_evento: str, payload: dict, db: AsyncSession) -> tuple[int, list[Alerta]]:
    stmt = select(ReglaAlerta).where(
        ReglaAlerta.activa == True,
        or_(ReglaAlerta.tipo_evento == tipo_evento, ReglaAlerta.tipo_evento.is_(None)),
    )
    result = await db.execute(stmt)
    reglas = result.scalars().all()
    alertas_creadas: list[Alerta] = []

    for regla in reglas:
        try:
            coincide = evaluar_condicion(regla.condicion, payload)
        except CondicionInvalidaError as exc:
            logger.warning("regla_alerta_invalida", regla_id=regla.id, error=str(exc))
            coincide = False

        if not coincide:
            continue

        animal_id = payload.get("animal_id")
        corral_id = payload.get("corral_id")
        descripcion = construir_mensaje(regla.nombre, regla.mensaje, payload)

        existe_stmt = select(Alerta).where(
            and_(
                Alerta.estado == "abierta",
                Alerta.tipo == regla.nombre,
                Alerta.animal_id == animal_id,
                Alerta.corral_id == corral_id,
            )
        )
        existe = (await db.execute(existe_stmt)).scalars().first()
        if existe:
            continue

        alerta = Alerta(
            animal_id=animal_id,
            corral_id=corral_id,
            tipo=regla.nombre,
            severidad=regla.severidad,
            estado="abierta",
            descripcion=descripcion,
        )
        db.add(alerta)
        await db.flush()
        alertas_creadas.append(alerta)

    await db.commit()

    for alerta in alertas_creadas:
        await db.refresh(alerta)
        await publicar_alerta_creada(
            alerta_id=alerta.id,
            severidad=alerta.severidad,
            tipo=alerta.tipo,
            timestamp=alerta.created_at.isoformat() if alerta.created_at else datetime.now(timezone.utc).isoformat(),
        )

    return len(reglas), alertas_creadas
