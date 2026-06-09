import asyncio
import json

import structlog
from redis.asyncio import from_url

from core.config import settings
from core.db import AsyncSessionLocal
from domains.alertas.service import evaluar_evento_y_generar_alertas

logger = structlog.get_logger()

EVENTOS_SOPORTADOS = [
    "peso.actualizado",
    "consumo.actualizado",
    "comportamiento.detectado",
    "ambiente.actualizado",
]


async def consumir_eventos_alertas():
    """
    Worker Redis Pub/Sub para BE-2.2.
    Consume eventos del bus, evalúa reglas activas y genera alertas automáticas.
    """
    redis = from_url(settings.redis_url, decode_responses=True)
    pubsub = redis.pubsub()
    await pubsub.subscribe(*EVENTOS_SOPORTADOS)

    logger.info("worker_alertas_iniciado", canales=EVENTOS_SOPORTADOS)

    async for message in pubsub.listen():
        if message["type"] != "message":
            continue

        canal = message["channel"]
        try:
            payload = json.loads(message["data"])
        except Exception as exc:
            logger.error("evento_alertas_invalido", canal=canal, error=str(exc), data=message["data"])
            continue

        async with AsyncSessionLocal() as db:
            try:
                reglas_evaluadas, alertas_creadas = await evaluar_evento_y_generar_alertas(canal, payload, db)
                logger.info(
                    "evento_alertas_procesado",
                    canal=canal,
                    reglas_evaluadas=reglas_evaluadas,
                    alertas_creadas=len(alertas_creadas),
                )
            except Exception as exc:
                logger.error("error_procesando_evento_alertas", canal=canal, error=str(exc))


if __name__ == "__main__":
    asyncio.run(consumir_eventos_alertas())
