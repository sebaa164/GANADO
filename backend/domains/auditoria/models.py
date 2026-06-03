from sqlalchemy import Column, DateTime, Integer, JSON, String, func
from core.db import Base


class AuditoriaLog(Base):
    __tablename__ = "auditoria_logs"

    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, nullable=True)
    accion = Column(String(120), nullable=False)
    entidad = Column(String(120), nullable=False)
    entidad_id = Column(String(80))
    datos = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
