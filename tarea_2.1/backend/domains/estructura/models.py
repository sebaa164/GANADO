from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import relationship
from core.db import Base


class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    cuit = Column(String(20), unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    establecimientos = relationship("Establecimiento", back_populates="empresa")


class Establecimiento(Base):
    __tablename__ = "establecimientos"

    id = Column(Integer, primary_key=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    nombre = Column(String(150), nullable=False)
    latitud = Column(Numeric(10, 7))
    longitud = Column(Numeric(10, 7))
    descripcion = Column(Text)

    empresa = relationship("Empresa", back_populates="establecimientos")
    corrales = relationship("Corral", back_populates="establecimiento")


class Corral(Base):
    __tablename__ = "corrales"

    id = Column(Integer, primary_key=True)
    establecimiento_id = Column(Integer, ForeignKey("establecimientos.id"), nullable=False)
    codigo = Column(String(50), nullable=False)
    capacidad = Column(Integer)
    superficie_m2 = Column(Numeric(10, 2))
    frente_comedero_m = Column(Numeric(10, 2))

    establecimiento = relationship("Establecimiento", back_populates="corrales")
    lotes = relationship("Lote", back_populates="corral")


class Lote(Base):
    __tablename__ = "lotes"

    id = Column(Integer, primary_key=True)
    corral_id = Column(Integer, ForeignKey("corrales.id"), nullable=False)
    nombre = Column(String(100), nullable=False)
    categoria = Column(String(80))
    fecha_inicio = Column(DateTime(timezone=True))

    corral = relationship("Corral", back_populates="lotes")
