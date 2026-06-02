Entregable BE-1.2 — Servicio de ingesta de frames desde cámaras IP (RTSP)

Copiar el contenido de la carpeta backend/ encima del backend FastAPI de Fase 0.

Archivos incluidos:
- backend/domains/camaras/router.py
- backend/domains/camaras/frame_ingestor.py
- backend/domains/camaras/models.py
- backend/domains/camaras/schemas.py
- backend/alembic_revision_be_1_2_camaras_frames.py
- backend/docs/fase_1/BE-1.2_ingesta_frames_rtsp.md
- backend/storage/snapshots/.gitkeep

Luego integrar el router en api_gateway/main.py:
from domains.camaras.router import router as camaras_router
app.include_router(camaras_router)

Y montar snapshots:
from fastapi.staticfiles import StaticFiles
app.mount('/static/snapshots', StaticFiles(directory='storage/snapshots'), name='snapshots')

Dependencias:
opencv-python-headless
numpy

Prueba rápida:
POST http://localhost:8000/api/v1/camaras/1/capture/simulado
