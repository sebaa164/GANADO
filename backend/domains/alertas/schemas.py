from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class ReglaAlertaBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=150)
    tipo_evento: Optional[str] = Field(default=None, max_length=100)
    condicion: dict[str, Any]
    severidad: str = Field(default="media", pattern="^(baja|media|alta|critica)$")
    canal: str = Field(default="dashboard", max_length=80)
    mensaje: Optional[str] = None
    activa: bool = True


class ReglaAlertaCreate(ReglaAlertaBase):
    pass


class ReglaAlertaUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=3, max_length=150)
    tipo_evento: Optional[str] = Field(default=None, max_length=100)
    condicion: Optional[dict[str, Any]] = None
    severidad: Optional[str] = Field(default=None, pattern="^(baja|media|alta|critica)$")
    canal: Optional[str] = Field(default=None, max_length=80)
    mensaje: Optional[str] = None
    activa: Optional[bool] = None


class ReglaAlertaRead(ReglaAlertaBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class EventoParaEvaluar(BaseModel):
    tipo_evento: str = Field(..., examples=["peso.actualizado", "consumo.actualizado", "comportamiento.detectado"])
    payload: dict[str, Any] = Field(
        ...,
        examples=[
            {
                "animal_id": 10,
                "corral_id": 2,
                "peso_kg": 260,
                "consumo_porcentaje": 55,
                "temperatura_corral": 36.5,
            }
        ],
    )


class AlertaRead(BaseModel):
    id: int
    animal_id: Optional[int] = None
    corral_id: Optional[int] = None
    tipo: str
    severidad: str
    estado: str
    descripcion: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class EvaluacionResultado(BaseModel):
    evento: str
    reglas_evaluadas: int
    alertas_creadas: int
    alertas: list[AlertaRead]
