from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from core.db import Base


class Camara(Base):
    __tablename__ = "camaras"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    ubicacion = Column(String(180), nullable=False)
    rtsp_url = Column(Text, nullable=False)
    fps_captura = Column(Integer, nullable=False, default=1)
    resolucion = Column(String(30), nullable=True, default="1280x720")
    activa = Column(Boolean, nullable=False, default=True)
    last_frame_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    frames = relationship("FrameCamara", back_populates="camara")


class FrameCamara(Base):
    __tablename__ = "frames_camaras"

    id = Column(Integer, primary_key=True, index=True)
    camara_id = Column(Integer, ForeignKey("camaras.id"), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    snapshot_path = Column(Text, nullable=False)
    snapshot_url = Column(Text, nullable=False)
    estado = Column(String(30), nullable=False, default="capturado")

    camara = relationship("Camara", back_populates="frames")
