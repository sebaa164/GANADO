# [BE-2.1] Endpoint de inferencia `/predict/weight`

## Objetivo

Crear un endpoint FastAPI para estimar el peso de un bovino a partir de una imagen subida o una URL de snapshot.

El endpoint calcula un hash SHA256 de los bytes reales de la imagen, usa Redis como cache por hash y registra las predicciones nuevas en la tabla `predicciones_peso`.

## Endpoint

`POST /api/v1/ai/predict/weight`

## Ejemplos

### Multipart/form-data
```bash
curl -X POST "http://localhost:8000/api/v1/ai/predict/weight" \
  -F "animal_id=1" \
  -F "file=@./bovino.jpg"
```

### JSON
```bash
curl -X POST "http://localhost:8000/api/v1/ai/predict/weight" \
  -H "Content-Type: application/json" \
  -d '{"snapshot_url":"https://example.com/snapshots/bovino-1.jpg","animal_id":1}'
```

### Respuesta
```json
{
  "peso_estimado": 382.45,
  "confidence": 0.87,
  "model_version": "fake-local-v1",
  "image_hash": "abc123...",
  "cached": false,
  "metadata": {
    "source": "upload",
    "animal_id": 1
  }
}
```

## Validaciones

- Tipos aceptados: `image/jpeg`, `image/png`, `image/webp`
- Extensiones: `.jpg`, `.jpeg`, `.png`, `.webp`
- Tamaño máximo configurable via `AI_MAX_IMAGE_SIZE_MB` (default: 5 MB)

## Cache Redis

Clave: `ai:predict_weight:{image_hash}`
TTL configurable via `AI_CACHE_TTL_SECONDS`

## Modos de operación

### AI_FAKE_MODE=true (default)
Genera predicción simulada determinística basada en el hash de la imagen.
- peso_estimado: 250-550 kg
- confidence: 0.70-0.95
- model_version: `fake-local-v1`

### AI_FAKE_MODE=false
Llama a TensorFlow Serving en `TF_SERVING_WEIGHT_URL`.
Requiere modelo real en `./models/weight`.

Docker Compose con perfil ML:
```bash
docker compose --profile ml up -d --build
```
