import json
from datetime import datetime, timezone

import structlog
from redis.asyncio import from_url

from core.config import settings

logger = structlog.get_logger()


async def publicar_evento(nombre_evento: str, payload: dict) -> None:
    try:
        redis = from_url(settings.redis_url, decode_responses=True)
        await redis.publish(nombre_evento, json.dumps(payload, default=str))
        await redis.close()
        logger.info("evento_publicado", evento=nombre_evento, payload=payload)
    except Exception as exc:
        logger.error("error_publicando_evento", evento=nombre_evento, error=str(exc))


async def publicar_alerta_creada(alerta_id: int, severidad: str, tipo: str, timestamp: str | None = None) -> None:
    payload = {
        "event": "alerta.creada",
        "alerta_id": alerta_id,
        "severidad": severidad,
        "tipo": tipo,
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
    }
    await publicar_evento("alerta.creada", payload)
