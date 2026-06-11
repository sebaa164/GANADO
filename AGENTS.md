# AGENTS.md — Guía para agentes IA

## Stack del proyecto

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4 (en `frontend/`)
- **Backend principal:** Laravel 10 + PostgreSQL + Sanctum (puerto 8000)
- **Backend IA:** FastAPI + Python (en `/backend/`)
- **Microservicio visión:** FastAPI + YOLO (en `/services/ai-service/`)

## Reglas generales

- Los archivos no deben superar las 1000 líneas de código.
- El frontend Next.js vive en `frontend/src/`.
- No crear archivos `.txt` sueltos en la raíz. La documentación va en `docs/` o en el `README.md`.
- Las rutas API de Laravel van en `routes/api.php`, protegidas con `auth:sanctum`.
- Los controllers Laravel van en `app/Http/Controllers/`, organizados en subcarpetas por dominio.
- Las vistas Blade (Laravel) aún son funcionales en `resources/views/` pero el frontend principal es Next.js.

## Arquitectura

- **Next.js** (puerto 3000): App Router, componentes cliente en `frontend/src/components/`, contextos de auth en `frontend/src/contexts/`, utilidades en `frontend/src/lib/`.
- **Laravel** (puerto 8000): API REST con Sanctum, 6 controladores API (Auth, Dashboard, Animales, Corrales, Alertas, Configuración).
- **FastAPI** (puerto 8000/8001): Backend de IA y motor de reglas, módulos en `backend/domains/`.
- **Ambos servidores deben correr simultáneamente** para que el login funcione.

## Ramas del equipo (GitHub: sebaa164/GANADO)

- `carlitos`: Documentación backend (BE-0.5 backlog, BE-1.2, BE-2.1, BE-2.2)
- `jesus`: Backend FastAPI (arquitectura, motor reglas, ingesta RTSP)
- `MAGA`/`ismael`: Frontend Next.js con componentes UI, hooks, stores Zustand, Storybook, Playwright, Vitest
