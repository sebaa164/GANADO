from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class RfidEventoCreate(BaseModel):
    animal_id: int = Field(..., gt=0)
    rfid: str = Field(..., min_length=1, max_length=80)
    tipo_evento: Literal["entrada", "salida"]
    timestamp: datetime
    ubicacion: str = Field(..., min_length=1, max_length=180)


class IaDeteccionCreate(BaseModel):
    animal_id: int | None = Field(default=None, gt=0)
    timestamp: datetime
    ubicacion: str = Field(..., min_length=1, max_length=180)
    comiendo: bool
    confidence: float | None = Field(default=None, ge=0, le=1)


class EventoAlimentacionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    animal_id: int
    lote_id: int
    rfid_in: datetime
    rfid_out: datetime | None
    duracion_segundos: int | None
    ubicacion: str | None
    estado: str
    confidence: float | None


class PromedioDiarioLoteRead(BaseModel):
    lote_id: int
    fecha: date
    cantidad_eventos: int
    promedio_segundos: float
    total_segundos: int


class AnomaliaConsumoRead(EventoAlimentacionRead):
    promedio_historico: float


class MensajeCorrelacionRead(BaseModel):
    mensaje: str
    eventos_abiertos: int = 0
    eventos_cerrados: int = 0


class AnomaliasMarcadasRead(BaseModel):
    mensaje: str
    animal_id: int
    anomalias_detectadas: int
    anomalias_marcadas: int
    promedio_historico: float | None = None
