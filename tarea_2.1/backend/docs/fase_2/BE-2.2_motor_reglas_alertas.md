# BE-2.2 — Motor de reglas para alertas automáticas

## Objetivo

Implementar en el backend FastAPI un motor de reglas que consuma eventos del sistema, evalúe condiciones configurables y genere alertas automáticas.

Esta entrega **no elimina Laravel**. Laravel queda como parte del repositorio existente y se agrega el módulo FastAPI pedido por el stack del proyecto.

## Checklist cubierto

- Modelo DB `reglas_alerta` con condición JSON.
- Worker consumidor de eventos por Redis Pub/Sub.
- Evaluador de reglas configurable tipo JSON/JSONLogic simple.
- Persistencia de alertas generadas en `alertas`.
- Publicación del evento `alerta.creada`.
- Endpoint admin para CRUD de reglas.
- Reglas iniciales: peso bajo, consumo bajo y temperatura alta.

## Archivos agregados

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
backend/docs/fase_2/BE-2.2_motor_reglas_alertas.md
```

También se actualiza:

```text
backend/api_gateway/main.py
backend/alembic/env.py
backend/pyproject.toml
```

## Endpoints

### Crear regla

`POST /api/v1/alertas/reglas`

```json
{
  "nombre": "peso_bajo",
  "tipo_evento": "peso.actualizado",
  "condicion": {
    "campo": "peso_kg",
    "op": "<",
    "valor": 280
  },
  "severidad": "alta",
  "canal": "dashboard",
  "mensaje": "Animal {animal_id} con peso bajo: {peso_kg} kg",
  "activa": true
}
```

### Evaluar evento manualmente

`POST /api/v1/alertas/evaluar-evento`

```json
{
  "tipo_evento": "peso.actualizado",
  "payload": {
    "animal_id": 10,
    "corral_id": 2,
    "peso_kg": 260
  }
}
```

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

El worker consume eventos desde Redis Pub/Sub:

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

En producción, Redis Pub/Sub puede reemplazarse por RabbitMQ o Kafka manteniendo la misma lógica del motor.

## Evento publicado

Cuando se genera una alerta, se publica:

```text
alerta.creada
```

Ejemplo:

```json
{
  "event": "alerta.creada",
  "alerta_id": 1,
  "severidad": "alta",
  "tipo": "peso_bajo",
  "timestamp": "2026-06-09T10:00:00Z"
}
```

## Condiciones soportadas

Condición simple:

```json
{"campo": "peso_kg", "op": "<", "valor": 280}
```

Condición compuesta:

```json
{
  "and": [
    {"campo": "peso_kg", "op": "<", "valor": 280},
    {"campo": "consumo_porcentaje", "op": "<", "valor": 70}
  ]
}
```

Operadores:

```text
==, !=, >, >=, <, <=, in, contains
```

## Corrección de integración Alembic

La cadena de migraciones queda lineal:

```text
0001_modelo_inicial -> 0002_be_1_2 -> 0003_be_2_2
```

De esta manera `alembic upgrade head` crea primero el modelo inicial, luego cámaras/frames y finalmente `reglas_alerta`.
