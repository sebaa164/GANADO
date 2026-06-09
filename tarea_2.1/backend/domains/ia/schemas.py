from typing import Any, Optional

from pydantic import BaseModel, Field


class PredictWeightRequest(BaseModel):
    snapshot_url: Optional[str] = Field(default=None, min_length=1)
    animal_id: Optional[int] = Field(default=None, ge=1)


class PredictWeightResponse(BaseModel):
    peso_estimado: float
    confidence: float
    model_version: str
    image_hash: str
    cached: bool
    metadata: dict[str, Any] = Field(default_factory=dict)
