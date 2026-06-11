from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CamaraCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=120)
    ubicacion: str = Field(..., min_length=2, max_length=180)
    rtsp_url: str = Field(..., min_length=5)
    fps_captura: int = Field(default=1, ge=1, le=30)
    resolucion: Optional[str] = Field(default="1280x720")
    activa: bool = True


class CamaraRead(BaseModel):
    id: int
    nombre: str
    ubicacion: str
    rtsp_url: str
    fps_captura: int
    resolucion: Optional[str]
    activa: bool
    last_frame_at: Optional[datetime] = None


class FrameCaptured(BaseModel):
    camara_id: int
    timestamp: datetime
    snapshot_url: str
    frame_path: str
    estado: str
