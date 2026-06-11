# BE-2.1 Endpoint de inferencia `/predict/weight`

## Objetivo

Crear un endpoint FastAPI para estimar el peso de un bovino a partir de una imagen subida o una URL de snapshot.

El endpoint calcula un hash SHA256 de los bytes reales de la imagen, usa Redis como cache por hash y registra las predicciones nuevas en la tabla `predicciones_peso`.

## Endpoint

`POST /api/v1/ai/predict/weight`

El router queda publicado con prefijo `/api/v1/ai` y tag `IA`.

## Ejemplo con multipart/form-data

```bash
curl -X POST "http://localhost:8000/api/v1/ai/predict/weight" \
  -F "animal_id=1" \
  -F "file=@./bovino.jpg"
```

## Ejemplo con JSON

```bash
curl -X POST "http://localhost:8000/api/v1/ai/predict/weight" \
  -H "Content-Type: application/json" \
  -d '{"snapshot_url":"https://example.com/snapshots/bovino-1.jpg","animal_id":1}'
```

## Ejemplo de respuesta

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

## Validaciones de imagen

El endpoint acepta solo estos tipos de imagen:

- `image/jpeg`
- `image/png`
- `image/webp`

En uploads multipart tambien se valida la extension del nombre de archivo si viene informada:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

Si el tipo o extension no es valida, responde HTTP 400.

## Tamano maximo

El tamano maximo se configura con `AI_MAX_IMAGE_SIZE_MB`.

Valor por defecto:

`AI_MAX_IMAGE_SIZE_MB=5`

Si la imagen supera el limite, responde HTTP 400 antes de calcular la prediccion.

## Hash de snapshot_url

Cuando se envia `snapshot_url`, el backend descarga la imagen con `httpx`, valida status HTTP 200, valida `Content-Type`, valida tamano maximo y calcula el SHA256 sobre los bytes descargados.

No se usa el texto de la URL como hash principal.

Si la URL es invalida o devuelve un tipo no permitido, responde HTTP 400. Si hay timeout o error temporal descargando la imagen, responde HTTP 503.

## Cache Redis

La clave usada para cachear es:

`ai:predict_weight:{image_hash}`

El TTL se configura con `AI_CACHE_TTL_SECONDS`. Si Redis devuelve una prediccion cacheada, el endpoint responde con `cached: true` y no vuelve a llamar al modelo.

Si Redis no esta disponible, se registra el error y se sigue con la prediccion para no bloquear la inferencia.

## AI_FAKE_MODE

Con `AI_FAKE_MODE=true`, el backend genera una prediccion simulada y estable usando el hash de los bytes de la imagen.

La misma entrada genera siempre el mismo peso y confidence mientras el hash no cambie.

Valores simulados:

- `peso_estimado`: entre 250 y 550 kg.
- `confidence`: entre 0.70 y 0.95.
- `model_version`: `fake-local-v1`.

## TensorFlow Serving

Con `AI_FAKE_MODE=false`, el backend llama a `TF_SERVING_WEIGHT_URL` usando `httpx`.

El contrato enviado es provisorio:

```json
{
  "instances": [
    {
      "image_hash": "...",
      "source": "snapshot_url",
      "animal_id": 1,
      "snapshot_url": "https://example.com/snapshots/bovino-1.jpg"
    }
  ]
}
```

Para uploads se envia `image_base64`. Esto queda preparado para adaptarse cuando el equipo de ML entregue el contrato final del modelo real.

El `docker-compose.yml` incluye un servicio opcional `tf-serving` con profile `ml`:

```bash
docker compose --profile ml up -d --build
```

El compose normal sigue funcionando sin levantar TF Serving:

```bash
docker compose up -d --build
```

Para usar el profile `ml` se requiere un modelo real en `./models/weight`. Aun no hay modelo real entregado por ML; el endpoint queda preparado para conectarse cuando el contrato final este disponible.
