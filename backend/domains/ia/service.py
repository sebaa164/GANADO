import base64
import hashlib
import json
from typing import Any

import httpx
import structlog
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.redis_client import redis_client
from domains.ia.models import PrediccionPeso
from domains.ia.schemas import PredictWeightResponse

logger = structlog.get_logger()

ALLOWED_IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def calcular_hash_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def _normalizar_content_type(content_type: str | None) -> str:
    return (content_type or "").split(";")[0].strip().lower()


def validar_tipo_imagen(content_type: str | None, filename: str | None = None) -> None:
    tipo = _normalizar_content_type(content_type)
    if tipo not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de imagen no permitido. Usar JPG, PNG o WEBP")

    if filename:
        filename_lower = filename.lower()
        if not any(filename_lower.endswith(extension) for extension in ALLOWED_IMAGE_EXTENSIONS):
            raise HTTPException(status_code=400, detail="Extension de imagen no permitida. Usar .jpg, .jpeg, .png o .webp")


def _max_image_size_bytes() -> int:
    return settings.ai_max_image_size_mb * 1024 * 1024


def validar_tamano_imagen(content: bytes) -> None:
    if len(content) > _max_image_size_bytes():
        raise HTTPException(
            status_code=400,
            detail=f"La imagen supera el tamano maximo de {settings.ai_max_image_size_mb} MB",
        )


async def descargar_imagen_snapshot(snapshot_url: str) -> bytes:
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            async with client.stream("GET", snapshot_url) as response:
                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="No se pudo descargar la imagen del snapshot_url")

                validar_tipo_imagen(response.headers.get("content-type"))

                content_length = response.headers.get("content-length")
                if content_length:
                    try:
                        if int(content_length) > _max_image_size_bytes():
                            raise HTTPException(
                                status_code=400,
                                detail=f"La imagen supera el tamano maximo de {settings.ai_max_image_size_mb} MB",
                            )
                    except ValueError:
                        pass

                content = bytearray()
                async for chunk in response.aiter_bytes():
                    content.extend(chunk)
                    if len(content) > _max_image_size_bytes():
                        raise HTTPException(
                            status_code=400,
                            detail=f"La imagen supera el tamano maximo de {settings.ai_max_image_size_mb} MB",
                        )
    except HTTPException:
        raise
    except httpx.InvalidURL:
        raise HTTPException(status_code=400, detail="snapshot_url invalida")
    except httpx.TimeoutException as exc:
        logger.error("predict_weight_snapshot_timeout", snapshot_url=snapshot_url, error=str(exc))
        raise HTTPException(status_code=503, detail="Timeout descargando la imagen del snapshot_url")
    except httpx.RequestError as exc:
        logger.error("predict_weight_snapshot_download_error", snapshot_url=snapshot_url, error=str(exc))
        raise HTTPException(status_code=503, detail="No se pudo descargar la imagen del snapshot_url")

    image_content = bytes(content)
    if not image_content:
        raise HTTPException(status_code=400, detail="La imagen descargada no puede estar vacia")
    validar_tamano_imagen(image_content)
    return image_content


def _cache_key(image_hash: str) -> str:
    return f"ai:predict_weight:{image_hash}"


async def buscar_prediccion_cache(image_hash: str) -> dict[str, Any] | None:
    try:
        cached = await redis_client.get(_cache_key(image_hash))
    except Exception as exc:
        logger.warning("predict_weight_cache_error", image_hash=image_hash, error=str(exc))
        return None

    if not cached:
        return None

    try:
        return json.loads(cached)
    except json.JSONDecodeError as exc:
        logger.warning("predict_weight_cache_invalid", image_hash=image_hash, error=str(exc))
        return None


async def guardar_prediccion_cache(image_hash: str, prediction: dict[str, Any]) -> None:
    try:
        await redis_client.setex(
            _cache_key(image_hash),
            settings.ai_cache_ttl_seconds,
            json.dumps(prediction),
        )
    except Exception as exc:
        logger.warning("predict_weight_cache_save_error", image_hash=image_hash, error=str(exc))


def generar_prediccion_fake(image_hash: str, source: str, animal_id: int | None = None) -> dict[str, Any]:
    seed = int(image_hash[:16], 16)
    peso_estimado = round(250 + (seed % 30001) / 100, 2)
    confidence = round(0.70 + ((seed // 1000) % 2501) / 10000, 2)

    return {
        "peso_estimado": peso_estimado,
        "confidence": confidence,
        "model_version": "fake-local-v1",
        "image_hash": image_hash,
        "metadata": {
            "source": source,
            "animal_id": animal_id,
        },
    }


def _parse_tf_serving_response(body: dict[str, Any]) -> tuple[float, float, str]:
    if not isinstance(body, dict):
        raise ValueError("TF Serving devolvio una respuesta invalida")

    predictions = body.get("predictions")
    if not predictions:
        raise ValueError("TF Serving no devolvio predictions")

    prediction = predictions[0]
    confidence = 0.0

    if isinstance(prediction, dict):
        peso = prediction.get("peso_estimado")
        if peso is None:
            peso = prediction.get("weight")
        if peso is None:
            peso = prediction.get("peso")
        confidence = prediction.get("confidence", prediction.get("confianza", 0.0))
    elif isinstance(prediction, list):
        peso = prediction[0]
        if len(prediction) > 1:
            confidence = prediction[1]
    else:
        peso = prediction

    if peso is None:
        raise ValueError("TF Serving no devolvio peso estimado")

    model_version = str(body.get("model_version") or "tf-serving")
    return float(peso), float(confidence), model_version


async def llamar_tensorflow_serving(
    image_hash: str,
    source: str,
    animal_id: int | None = None,
    snapshot_url: str | None = None,
    file_content: bytes | None = None,
) -> dict[str, Any]:
    instance: dict[str, Any] = {
        "image_hash": image_hash,
        "source": source,
        "animal_id": animal_id,
    }
    if snapshot_url:
        instance["snapshot_url"] = snapshot_url
    if file_content is not None:
        # Contrato provisorio hasta que ML confirme el formato final del modelo.
        instance["image_base64"] = base64.b64encode(file_content).decode("ascii")

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(settings.tf_serving_weight_url, json={"instances": [instance]})
            response.raise_for_status()
            body = response.json()
    except httpx.HTTPError as exc:
        logger.error("predict_weight_ai_service_error", image_hash=image_hash, error=str(exc))
        raise HTTPException(status_code=503, detail="El servicio de IA no esta disponible")
    except ValueError as exc:
        logger.error("predict_weight_ai_response_invalid", image_hash=image_hash, error=str(exc))
        raise HTTPException(status_code=503, detail="Respuesta invalida del servicio de IA")

    try:
        peso_estimado, confidence, model_version = _parse_tf_serving_response(body)
    except (TypeError, ValueError) as exc:
        logger.error("predict_weight_ai_response_invalid", image_hash=image_hash, error=str(exc))
        raise HTTPException(status_code=503, detail="Respuesta invalida del servicio de IA")

    return {
        "peso_estimado": round(peso_estimado, 2),
        "confidence": round(confidence, 2),
        "model_version": model_version,
        "image_hash": image_hash,
        "metadata": {
            "source": source,
            "animal_id": animal_id,
            "provider": "tf-serving",
        },
    }


async def guardar_prediccion_db(
    db: AsyncSession,
    animal_id: int | None,
    snapshot_url: str | None,
    image_hash: str,
    prediction: dict[str, Any],
) -> PrediccionPeso:
    prediccion = PrediccionPeso(
        animal_id=animal_id,
        snapshot_url=snapshot_url,
        image_hash=image_hash,
        peso_estimado=prediction["peso_estimado"],
        confidence=prediction["confidence"],
        model_version=prediction["model_version"],
        metadata_json=prediction["metadata"],
    )

    try:
        db.add(prediccion)
        await db.commit()
        await db.refresh(prediccion)
    except Exception:
        await db.rollback()
        raise

    logger.info("predict_weight_saved", prediction_id=prediccion.id, image_hash=image_hash)
    return prediccion


async def predecir_peso(
    db: AsyncSession,
    image_hash: str,
    source: str,
    animal_id: int | None = None,
    snapshot_url: str | None = None,
    file_content: bytes | None = None,
) -> PredictWeightResponse:
    logger.info("predict_weight_started", image_hash=image_hash, source=source, animal_id=animal_id)

    cached_prediction = await buscar_prediccion_cache(image_hash)
    if cached_prediction:
        logger.info("predict_weight_cache_hit", image_hash=image_hash)
        cached_prediction["cached"] = True
        return PredictWeightResponse(**cached_prediction)

    logger.info("predict_weight_cache_miss", image_hash=image_hash)

    if settings.ai_fake_mode:
        prediction = generar_prediccion_fake(image_hash=image_hash, source=source, animal_id=animal_id)
    else:
        prediction = await llamar_tensorflow_serving(
            image_hash=image_hash,
            source=source,
            animal_id=animal_id,
            snapshot_url=snapshot_url,
            file_content=file_content,
        )

    await guardar_prediccion_db(
        db=db,
        animal_id=animal_id,
        snapshot_url=snapshot_url,
        image_hash=image_hash,
        prediction=prediction,
    )
    await guardar_prediccion_cache(image_hash=image_hash, prediction=prediction)

    return PredictWeightResponse(**prediction, cached=False)
