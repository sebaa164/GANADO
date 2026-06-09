from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query

from domains.camaras.frame_ingestor import capturar_frame_rtsp, generar_frame_simulado
from domains.camaras.schemas import FrameCaptured

router = APIRouter(prefix="/api/v1/camaras", tags=["Cámaras"])


@router.post("/{camara_id}/capture", response_model=FrameCaptured)
def capturar_frame(camara_id: int, rtsp_url: str = Query(..., description="URL RTSP o ruta local de video")):
    try:
        return capturar_frame_rtsp(rtsp_url=rtsp_url, camara_id=camara_id)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@router.post("/{camara_id}/capture/simulado", response_model=FrameCaptured)
def capturar_frame_simulado(camara_id: int):
    return generar_frame_simulado(camara_id=camara_id)


@router.get("/health")
def health_camaras():
    return {
        "servicio": "ingesta_frames_rtsp",
        "estado": "ok",
        "timestamp": datetime.now(timezone.utc),
    }
