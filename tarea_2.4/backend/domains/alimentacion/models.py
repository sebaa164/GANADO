from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, ForeignKey, Integer, Numeric, String, func

from core.db import Base


class EventoRfid(Base):
    __tablename__ = "eventos_rfid"
    __table_args__ = (
        CheckConstraint("tipo_evento IN ('entrada', 'salida')", name="ck_eventos_rfid_tipo_evento"),
    )

    id = Column(Integer, primary_key=True)
    animal_id = Column(Integer, ForeignKey("animales.id"), nullable=False, index=True)
    rfid = Column(String(80), nullable=False)
    tipo_evento = Column(String(20), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    ubicacion = Column(String(180), nullable=False)


class DeteccionIaAlimentacion(Base):
    __tablename__ = "detecciones_ia_alimentacion"
    __table_args__ = (
        CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 1)",
            name="ck_detecciones_ia_alimentacion_confidence",
        ),
    )

    id = Column(Integer, primary_key=True)
    animal_id = Column(Integer, ForeignKey("animales.id"), nullable=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    ubicacion = Column(String(180), nullable=False)
    comiendo = Column(Boolean, nullable=False)
    confidence = Column(Numeric(5, 4), nullable=True)


class EventoAlimentacion(Base):
    __tablename__ = "eventos_alimentacion"
    __table_args__ = (
        CheckConstraint("estado IN ('abierto', 'cerrado', 'anomalia')", name="ck_eventos_alimentacion_estado"),
        CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 1)",
            name="ck_eventos_alimentacion_confidence",
        ),
    )

    id = Column(Integer, primary_key=True)
    animal_id = Column(Integer, ForeignKey("animales.id"), nullable=False, index=True)
    lote_id = Column(Integer, ForeignKey("lotes.id"), nullable=False, index=True)
    rfid_in = Column(DateTime(timezone=True), nullable=False, index=True)
    rfid_out = Column(DateTime(timezone=True), nullable=True)
    duracion_segundos = Column(Integer, nullable=True)
    ubicacion = Column(String(180), nullable=True)
    confidence = Column(Numeric(5, 4), nullable=True)
    estado = Column(String(20), nullable=False, default="abierto", server_default="abierto")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
