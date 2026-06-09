# Fase 0 Backend corregida

Esta versión deja la Fase 0 alineada al stack pedido: **FastAPI + PostgreSQL + Redis + Docker**.

## Qué contiene

- BE-0.1 Arquitectura documentada en `docs/architecture/architecture.md`.
- BE-0.2 Estructura base tipo DDD: `domains/`, `core/`, `api_gateway/`.
- BE-0.3 Setup FastAPI con Docker Compose, PostgreSQL, Redis, `/health`, `/ready`, logging estructurado con `structlog` y correlation IDs.
- BE-0.4 Modelo de datos inicial con Alembic, SQL, DER y tablas principales.
- BE-0.5 Backlog de historias backend.

## Cómo levantar

```bash
cd backend
docker compose up --build
```

Abrir:

- http://localhost:8000/health
- http://localhost:8000/ready
- http://localhost:8000/docs

## Migraciones

Con los contenedores arriba:

```bash
docker compose exec api alembic upgrade head
```

## Nota importante

Este paquete no reemplaza el proyecto Laravel anterior. Es una Fase 0 corregida para cumplir el stack definido por las tarjetas Trello.
