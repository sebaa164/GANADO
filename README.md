# 🐄 GanadoVision — Sistema Inteligente de Monitoreo de Ganado en Feedlot

## ¿Qué es esto?

Sistema automatizado de monitoreo de ganado bovino en feedlot. Detecta anomalías de comportamiento en tiempo real mediante visión artificial (YOLO), genera alertas automáticas y centraliza toda la información en una plataforma web.

---

## Arquitectura

```
sistema-vacas/
├── app/                    # Laravel — Controllers, Models, Middleware
├── resources/views/        # Vistas Blade (frontend)
├── resources/css/          # Tailwind CSS v4
├── resources/js/           # Alpine.js
├── routes/                 # web.php, api.php
├── database/               # Migraciones y seeders (PostgreSQL)
├── backend/                # FastAPI Python — API Gateway y dominios (Jesus)
└── services/ai-service/    # FastAPI + YOLO — Procesamiento de imágenes
```

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Laravel Blade + Tailwind v4 + Alpine.js |
| Backend principal | PHP 8.1 / Laravel 10 / PostgreSQL |
| Autenticación | Laravel Sanctum |
| Backend Python | FastAPI + SQLAlchemy + Alembic + Redis |
| Visión artificial | YOLO via Python |

---

## Requisitos

- PHP >= 8.1 + Composer
- PostgreSQL
- Node.js >= 18
- Python >= 3.10 (para el backend Python y el servicio de IA)

---

## Instalación

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

## Levantar el proyecto

```bash
# Un solo comando para el frontend Laravel:
php artisan serve --port=8000
```

> Abrí **http://localhost:8000**

Para el backend Python (opcional, en desarrollo separado):
```bash
cd backend
pip install -e .
uvicorn api_gateway.main:app --reload --port=8001
```

---

## Variables de entorno

Copiá `.env.example` a `.env` y completá:
- `DB_*` — conexión a PostgreSQL
- `APP_KEY` — generada con `php artisan key:generate`

Para el backend Python, copiá `backend/.env.example` a `backend/.env`.
