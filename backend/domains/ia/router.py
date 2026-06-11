from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from domains.ia import service
from domains.ia.schemas import PredictWeightRequest, PredictWeightResponse

router = APIRouter(prefix="/api/v1/ai", tags=["IA"])


def _parse_animal_id(value: Any) -> int | None:
    if value is None or value == "":
        return None
    try:
        animal_id = int(value)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="animal_id debe ser un entero")
    if animal_id < 1:
        raise HTTPException(status_code=400, detail="animal_id debe ser mayor a 0")
    return animal_id


@router.post(
    "/predict/weight",
    response_model=PredictWeightResponse,
    openapi_extra={
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": {
                        **PredictWeightRequest.model_json_schema(),
                        "required": ["snapshot_url"],
                    },
                    "example": {"snapshot_url": "https://example.com/snapshots/bovino-1.jpg", "animal_id": 1},
                },
                "multipart/form-data": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "file": {"type": "string", "format": "binary"},
                            "animal_id": {"type": "integer"},
                        },
                    }
                },
            },
            "required": True,
        }
    },
)
async def predict_weight(request: Request, db: AsyncSession = Depends(get_db)):
    content_type = request.headers.get("content-type", "")
    file_content: bytes | None = None
    snapshot_url: str | None = None
    animal_id: int | None = None

    if content_type.startswith("multipart/form-data"):
        form = await request.form()
        animal_id = _parse_animal_id(form.get("animal_id"))
        file = form.get("file")

        if file is not None and hasattr(file, "read"):
            service.validar_tipo_imagen(
                content_type=getattr(file, "content_type", None),
                filename=getattr(file, "filename", None),
            )
            file_content = await file.read()
            if not file_content:
                raise HTTPException(status_code=400, detail="El archivo no puede estar vacio")
            service.validar_tamano_imagen(file_content)
            image_hash = service.calcular_hash_bytes(file_content)
            source = "upload"
        else:
            raise HTTPException(status_code=400, detail="Enviar un archivo file o un snapshot_url")
    elif content_type.startswith("application/json"):
        try:
            payload = await request.json()
            data = PredictWeightRequest.model_validate(payload)
        except ValidationError:
            raise HTTPException(status_code=400, detail="JSON debe incluir snapshot_url y animal_id valido si se envia")
        except Exception:
            raise HTTPException(status_code=400, detail="JSON invalido")

        animal_id = data.animal_id
        snapshot_url = data.snapshot_url.strip() if data.snapshot_url else None
        if not snapshot_url:
            raise HTTPException(status_code=400, detail="Enviar un archivo file o un snapshot_url")

        file_content = await service.descargar_imagen_snapshot(snapshot_url)
        image_hash = service.calcular_hash_bytes(file_content)
        source = "snapshot_url"
    else:
        raise HTTPException(status_code=400, detail="Usar application/json o multipart/form-data")

    return await service.predecir_peso(
        db=db,
        image_hash=image_hash,
        source=source,
        animal_id=animal_id,
        snapshot_url=snapshot_url,
        file_content=file_content,
    )
