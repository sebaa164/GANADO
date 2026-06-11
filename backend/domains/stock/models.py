from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from core.db import Base

class Insumo(Base):
    __tablename__ = "insumos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    tipo = Column(String(50), nullable=False)
    descripcion = Column(Text)
    stock_actual = Column(Numeric(12, 2), nullable=False, default=0)
    stock_minimo = Column(Numeric(12, 2), nullable=False, default=0)
    unidad_medida = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    telefono = Column(String(80))
    email = Column(String(150))
    direccion = Column(String(250))


class MovimientoStock(Base):
    __tablename__ = "movimientos_stock"

    id = Column(Integer, primary_key=True)
    insumo_id = Column(Integer, ForeignKey("insumos.id"), nullable=False)
    tipo_movimiento = Column(String(20), nullable=False)  # ingreso | egreso | ajuste
    cantidad = Column(Numeric(12, 2), nullable=False)
    observacion = Column(Text)
    fecha_movimiento = Column(DateTime(timezone=True), server_default=func.now())
