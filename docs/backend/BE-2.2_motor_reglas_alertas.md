# [BE-2.2] Motor de reglas para alertas automáticas

## Objetivo

Implementar en el backend FastAPI un motor de reglas que consuma eventos del sistema, evalúe condiciones configurables y genere alertas automáticas.

## Checklist cubierto

- Modelo DB `reglas_alerta` con condición JSON.
- Worker consumidor de eventos por Redis Pub/Sub.
- Evaluador de reglas configurable tipo JSON/JSONLogic simple.
- Persistencia de alertas generadas en `alertas`.
- Publicación del evento `alerta.creada`.
- Endpoint admin para CRUD de reglas.
- Reglas iniciales: peso bajo, consumo bajo y temperatura alta.

## Archivos agregados (en `/backend/`)

```text
backend/domains/alertas/models.py
backend/domains/alertas/schemas.py
backend/domains/alertas/rule_engine.py
backend/domains/alertas/event_bus.py
backend/domains/alertas/service.py
backend/domains/alertas/router.py
backend/domains/alertas/worker.py
backend/alembic/versions/0003_be_2_2_reglas_alerta.py
backend/scripts/seed_reglas_alerta.sql
```

## Endpoints

### Crear regla
`POST /api/v1/alertas/reglas`

### Evaluar evento manualmente
`POST /api/v1/alertas/evaluar-evento`

### Listar reglas
`GET /api/v1/alertas/reglas`

### Actualizar regla
`PATCH /api/v1/alertas/reglas/{regla_id}`

### Desactivar regla
`DELETE /api/v1/alertas/reglas/{regla_id}`

### Listar alertas
`GET /api/v1/alertas?estado=abierta&severidad=alta`

### Resolver alerta
`PATCH /api/v1/alertas/{id}/resolver`

## Worker de eventos

Consume eventos desde Redis Pub/Sub:
```text
peso.actualizado
consumo.actualizado
comportamiento.detectado
ambiente.actualizado
```

Comando:
```bash
cd backend
poetry run python -m domains.alertas.worker
```

## Condiciones soportadas

### Simple
```json
{"campo": "peso_kg", "op": "<", "valor": 280}
```

### Compuesta
```json
{
  "and": [
    {"campo": "peso_kg", "op": "<", "valor": 280},
    {"campo": "consumo_porcentaje", "op": "<", "valor": 70}
  ]
}
```

**Operadores:** `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `contains`

## Migración Alembic

Cadena lineal: `0001_modelo_inicial -> 0002_be_1_2 -> 0003_be_2_2`
