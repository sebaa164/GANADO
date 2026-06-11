# [BE-2.4] API de consumo de alimentación (RFID + IA)

## Objetivo técnico
Implementar una API FastAPI para simular eventos RFID, registrar detecciones IA de alimentación y correlacionar ambos datos para calcular consumo por animal y promedios por lote.

La solución mantiene el stack del backend: FastAPI, SQLAlchemy async, Alembic y Pydantic.

## Modelos creados

- `eventos_rfid`: registra entradas y salidas RFID por animal, RFID, ubicación y timestamp.
- `detecciones_ia_alimentacion`: registra detecciones IA con `comiendo`, `confidence`, ubicación y timestamp.
- `eventos_alimentacion`: registra eventos consolidados con `rfid_in`, `rfid_out`, `duracion_segundos`, `lote_id`, `ubicacion`, `confidence` y `estado`.

Estados de `eventos_alimentacion`:

- `abierto`: consumo iniciado, pendiente de salida RFID.
- `cerrado`: consumo finalizado con duración calculada.
- `anomalia`: evento cerrado marcado como consumo anómalo.

## Endpoints disponibles

```http
POST /api/v1/alimentacion/rfid
POST /api/v1/alimentacion/ia
POST /api/v1/alimentacion/correlacionar
GET /api/v1/alimentacion/animal/{id}?desde=&hasta=
GET /api/v1/alimentacion/lotes/promedios-diarios?desde=&hasta=
GET /api/v1/alimentacion/animal/{id}/anomalias?desde=&hasta=
POST /api/v1/alimentacion/animal/{id}/detectar-anomalias?desde=&hasta=
```

## Cumplimiento del checklist del Tech Leader

- Modelo `eventos_alimentacion`: implementado como `EventoAlimentacion` en `domains/alimentacion/models.py`, con `animal_id`, `rfid_in`, `rfid_out` y `duracion_segundos`. El campo `duracion_segundos` representa la duración solicitada en el checklist.
- Worker de correlación: implementado en `domains/alimentacion/worker.py`, función principal `correlacionar_eventos_alimentacion(db)`.
- Endpoint por animal: `GET /api/v1/alimentacion/animal/{id}?desde=&hasta=`, filtra por `animal_id`, permite fechas opcionales y ordena por `rfid_in`.
- Promedios diarios por lote: `GET /api/v1/alimentacion/lotes/promedios-diarios?desde=&hasta=`, devuelve lote, fecha, cantidad de eventos, promedio y total de duración.
- Anomalías: `GET /api/v1/alimentacion/animal/{id}/anomalias?desde=&hasta=` aplica la regla `duracion_segundos < 70%` del promedio histórico sin modificar datos.
- Marcado opcional de anomalías: `POST /api/v1/alimentacion/animal/{id}/detectar-anomalias?desde=&hasta=` marca eventos como `anomalia` cuando se requiere persistir el resultado.

## Ejemplos JSON para Swagger

### Registrar RFID entrada

```json
{
  "animal_id": 1,
  "rfid": "RFID001",
  "tipo_evento": "entrada",
  "timestamp": "2026-06-11T10:00:00Z",
  "ubicacion": "comedero_1"
}
```

El RFID debe coincidir con el RFID real del animal. Si no coincide, la API devuelve HTTP 422.

### Registrar detección IA comiendo

```json
{
  "animal_id": 1,
  "timestamp": "2026-06-11T10:02:00Z",
  "ubicacion": "comedero_1",
  "comiendo": true,
  "confidence": 0.91
}
```

### Registrar RFID salida

```json
{
  "animal_id": 1,
  "rfid": "RFID001",
  "tipo_evento": "salida",
  "timestamp": "2026-06-11T10:10:00Z",
  "ubicacion": "comedero_1"
}
```

## Flujo de prueba completo

1. Crear o usar un animal existente con RFID cargado.
2. Registrar una entrada RFID válida con `POST /api/v1/alimentacion/rfid`.
3. Registrar una detección IA con `comiendo = true` en la misma ubicación.
4. Ejecutar `POST /api/v1/alimentacion/correlacionar` para abrir el evento de alimentación.
5. Registrar una salida RFID posterior del mismo animal y ubicación.
6. Ejecutar nuevamente `POST /api/v1/alimentacion/correlacionar` para cerrar el evento y calcular `duracion_segundos`.
7. Consultar eventos con `GET /api/v1/alimentacion/animal/{id}`.
8. Consultar promedios diarios con `GET /api/v1/alimentacion/lotes/promedios-diarios`.
9. Consultar anomalías sin modificar datos con `GET /api/v1/alimentacion/animal/{id}/anomalias`.
10. Marcar anomalías con `POST /api/v1/alimentacion/animal/{id}/detectar-anomalias`.

## Reglas de correlación

- Una entrada RFID más una detección IA `comiendo` en la misma ubicación y dentro de una ventana cercana abre un evento.
- Una salida RFID posterior del mismo animal y ubicación cierra el evento abierto.
- Al cerrar, se calcula `duracion_segundos = rfid_out - rfid_in`.
- No se abre otro evento si el animal ya tiene un evento abierto.
- Una salida sin evento abierto no genera error; la API responde con un mensaje claro.
- El endpoint `POST /api/v1/alimentacion/correlacionar` dispara manualmente el worker interno para pruebas y revisión inicial.

## Reglas de anomalías

- El promedio histórico se calcula solo con eventos `cerrado` y con `duracion_segundos` no nula.
- Los eventos ya marcados como `anomalia` no participan del promedio histórico.
- Un evento es anómalo si `duracion_segundos < 70%` del promedio histórico.
- `GET /anomalias` es solo lectura y no modifica estado.
- `POST /detectar-anomalias` marca como `anomalia` los eventos detectados.

## Migraciones

```bash
cd backend
poetry install
poetry run alembic upgrade head
```

Con Docker:

```bash
cd backend
docker compose up --build
docker compose exec api alembic upgrade head
```

## Levantar FastAPI

```bash
cd backend
poetry run uvicorn api_gateway.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger queda disponible en:

```text
http://localhost:8000/docs
```

## Tests

```bash
cd backend
poetry run pytest tests/test_alimentacion.py
```

## Nota técnica
La correlación está implementada de forma simple y simulada para una primera revisión técnica. En producción debería ejecutarse como un worker automático que consuma eventos RFID e IA desde una cola o bus de eventos, con control de duplicados más estricto y monitoreo operativo.
