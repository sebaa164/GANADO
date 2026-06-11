from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
import uuid

import cv2

SNAPSHOT_DIR = Path("storage/snapshots")
SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)


def capturar_frame_rtsp(rtsp_url: str, camara_id: int) -> dict:
    """
    Captura un frame desde una cámara IP usando RTSP.
    También permite usar una ruta local de video para pruebas.
    """
    cap = cv2.VideoCapture(rtsp_url)

    if not cap.isOpened():
        raise RuntimeError("No se pudo conectar al stream RTSP o fuente de video")

    ok, frame = cap.read()
    cap.release()

    if not ok or frame is None:
        raise RuntimeError("No se pudo leer un frame válido desde la cámara")

    timestamp = datetime.now(timezone.utc)
    filename = f"camara_{camara_id}_{timestamp.strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.jpg"
    output_path = SNAPSHOT_DIR / filename

    cv2.imwrite(str(output_path), frame)

    return {
        "camara_id": camara_id,
        "timestamp": timestamp,
        "frame_path": str(output_path),
        "snapshot_url": f"/static/snapshots/{filename}",
        "estado": "capturado",
    }


def generar_frame_simulado(camara_id: int, texto: Optional[str] = None) -> dict:
    """
    Genera una imagen simulada para desarrollo cuando no hay cámara real.
    Sirve para probar la tarea BE-1.2 sin hardware físico.
    """
    import numpy as np

    timestamp = datetime.now(timezone.utc)
    filename = f"simulada_{camara_id}_{timestamp.strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.jpg"
    output_path = SNAPSHOT_DIR / filename

    img = np.zeros((720, 1280, 3), dtype=np.uint8)
    mensaje = texto or f"Frame simulado camara {camara_id}"
    cv2.putText(img, mensaje, (80, 350), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 4)
    cv2.putText(img, timestamp.isoformat(), (80, 430), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.imwrite(str(output_path), img)

    return {
        "camara_id": camara_id,
        "timestamp": timestamp,
        "frame_path": str(output_path),
        "snapshot_url": f"/static/snapshots/{filename}",
        "estado": "simulado",
    }
