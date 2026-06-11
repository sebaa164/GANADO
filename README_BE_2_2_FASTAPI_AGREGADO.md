# BE-2.2 agregado sin eliminar Laravel

Este ZIP mantiene el proyecto Laravel original y agrega/completa el backend FastAPI dentro de la carpeta:

```text
backend/
```

## Qué se agregó

- Motor de reglas para alertas automáticas.
- Modelo `reglas_alerta`.
- Migración Alembic `0003_be_2_2_reglas_alerta.py`.
- Evaluador de reglas con condiciones JSON.
- Worker consumidor de eventos desde Redis Pub/Sub.
- Persistencia de alertas en la tabla `alertas`.
- Publicación del evento `alerta.creada`.
- Endpoints REST de reglas y alertas en FastAPI.
- Documentación en `backend/docs/fase_2/BE-2.2_motor_reglas_alertas.md`.

## Qué NO se eliminó

No se eliminó Laravel. La estructura original sigue estando:

```text
app/
routes/
database/
resources/
composer.json
artisan
```

Laravel puede seguir funcionando como venía, y FastAPI queda agregado para alinear el proyecto con el stack pedido.

## Endpoints nuevos FastAPI

```text
POST   /api/v1/alertas/reglas
GET    /api/v1/alertas/reglas
PATCH  /api/v1/alertas/reglas/{regla_id}
DELETE /api/v1/alertas/reglas/{regla_id}
POST   /api/v1/alertas/evaluar-evento
GET    /api/v1/alertas
PATCH  /api/v1/alertas/{id}/resolver
```

## Cómo probar FastAPI

```bash
cd backend
docker compose up --build
```

Abrir:

```text
http://localhost:8000/docs
```

## Nota importante

Laravel y FastAPI pueden convivir en el mismo repositorio. Para evitar choque de puertos, si Laravel corre en `8000`, levantar FastAPI en otro puerto modificando el `docker-compose.yml` o usando `8001:8000`.
