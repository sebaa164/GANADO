from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship
from core.db import Base


class Animal(Base):
    __tablename__ = "animales"
    __table_args__ = (UniqueConstraint("rfid", name="uq_animales_rfid"),)

    id = Column(Integer, primary_key=True)
    lote_id = Column(Integer, ForeignKey("lotes.id"), nullable=False)
    rfid = Column(String(80), nullable=False)
    numero_caravana = Column(String(80))
    raza = Column(String(100))
    sexo = Column(String(20))
    estado = Column(String(50), default="activo", nullable=False)
    peso_ingreso = Column(Numeric(8, 2))
    fecha_ingreso = Column(DateTime(timezone=True), server_default=func.now())


class Pesaje(Base):
    __tablename__ = "pesajes"

    id = Column(Integer, primary_key=True)
    animal_id = Column(Integer, ForeignKey("animales.id"), nullable=False)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    peso_estimado = Column(Numeric(8, 2), nullable=False)
    metodo = Column(String(50), nullable=False)
    margen_error = Column(Numeric(5, 2))


class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True)
    animal_id = Column(Integer, ForeignKey("animales.id"), nullable=True)
    corral_id = Column(Integer, ForeignKey("corrales.id"), nullable=True)
    tipo = Column(String(80), nullable=False)
    severidad = Column(String(30), nullable=False)
    estado = Column(String(30), default="abierta", nullable=False)
    descripcion = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
