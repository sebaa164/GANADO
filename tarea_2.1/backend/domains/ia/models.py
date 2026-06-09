from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, Numeric, String, Text, func

from core.db import Base


class PrediccionPeso(Base):
    __tablename__ = "predicciones_peso"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animales.id"), nullable=True, index=True)
    snapshot_url = Column(Text, nullable=True)
    image_hash = Column(String(64), nullable=False, index=True)
    peso_estimado = Column(Numeric(8, 2), nullable=False)
    confidence = Column(Numeric(4, 2), nullable=False)
    model_version = Column(String(80), nullable=False)
    metadata_json = Column("metadata", JSON, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
