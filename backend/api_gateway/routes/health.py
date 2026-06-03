from fastapi import APIRouter
from sqlalchemy import text
from core.db import engine
from core.redis_client import redis_client

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {"status": "ok", "service": "ganadovision-api"}


@router.get("/ready")
async def ready():
    db_ok = False
    redis_ok = False

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            db_ok = True
    except Exception:
        db_ok = False

    try:
        redis_ok = bool(await redis_client.ping())
    except Exception:
        redis_ok = False

    status = "ready" if db_ok and redis_ok else "not_ready"
    return {"status": status, "postgres": db_ok, "redis": redis_ok}
