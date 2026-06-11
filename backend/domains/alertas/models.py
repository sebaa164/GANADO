from sqlalchemy import Boolean, Column, DateTime, Integer, JSON, String, Text, func
from core.db import Base


class ReglaAlerta(Base):
    __tablename__ = "reglas_alerta"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    tipo_evento = Column(String(100), nullable=True, index=True)
    condicion = Column(JSON, nullable=False)
    severidad = Column(String(30), nullable=False, default="media")
    canal = Column(String(80), nullable=False, default="dashboard")
    mensaje = Column(Text, nullable=True)
    activa = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
