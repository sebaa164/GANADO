from uuid import uuid4
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import structlog
from structlog.contextvars import bind_contextvars, clear_contextvars

from core.config import settings
from core.logging import configure_logging
from api_gateway.routes.health import router as health_router
from domains.sanitario.router import router as sanitario_router

configure_logging(settings.log_level)
logger = structlog.get_logger()

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    clear_contextvars()
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid4()))
    bind_contextvars(correlation_id=correlation_id)
    response = await call_next(request)
    response.headers["X-Correlation-ID"] = correlation_id
    logger.info("request_processed", method=request.method, path=request.url.path, status=response.status_code)
    return response


app.include_router(health_router)
app.include_router(sanitario_router)
