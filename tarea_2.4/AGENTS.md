# AGENTS.md — Guía para agentes IA

## Stack del proyecto

- **Frontend:** Laravel Blade + Tailwind CSS v4 + Alpine.js (compilado con Vite)
- **Backend principal:** Laravel 10 + PostgreSQL + Sanctum
- **Backend IA:** FastAPI + Python (en `/backend`)
- **Microservicio visión:** FastAPI + YOLO (en `/services/ai-service`)

## Reglas generales

- Los archivos no deben superar las 1000 líneas de código.
- El frontend vive en `resources/views/` (Blade) y `resources/css/` + `resources/js/`.
- No crear archivos `.txt` sueltos en la raíz. La documentación va en `docs/` o en el `README.md`.
- No usar Next.js — el proyecto migró a MVC con Blade.
- Las rutas web van en `routes/web.php`, las de API en `routes/api.php`.
- Los controllers van en `app/Http/Controllers/`, organizados en subcarpetas por dominio si crecen.
