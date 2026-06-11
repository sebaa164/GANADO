from typing import Optional
from pydantic import BaseModel, Field

class ProveedorCreate(BaseModel):
    nombre:str
    telefono: Optional[str]=None
    email: Optional[str]=None
    direccion: Optional[str]=None

class ProveedorUpdate(BaseModel):
    nombre: Optional[str]=None
    telefono: Optional[str]=None
    email: Optional[str]=None
    direccion: Optional[str]=None

class InsumoCreate(BaseModel):
    nombre:str
    tipo:str
    descripcion: Optional[str]=None
    stock_actual: float=0
    stock_minimo: float=0
    unidad_medida:str

class InsumoUpdate(BaseModel):
    nombre: Optional[str]=None
    tipo: Optional[str]=None
    descripcion: Optional[str]=None
    stock_actual: Optional[float]=None
    stock_minimo: Optional[float]=None
    unidad_medida: Optional[str]=None

class MovimientoCreate(BaseModel):
    insumo_id:int
    tipo_movimiento:str
    cantidad: float = Field(gt=0)
    observacion: Optional[str]=None
