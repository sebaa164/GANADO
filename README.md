# GanadoVision — Sistema Inteligente de Monitoreo de Ganado en Feedlot

Sistema automatizado de monitoreo de ganado bovino en feedlot. Detecta anomalías de comportamiento en tiempo real mediante visión artificial (YOLO), genera alertas automáticas y centraliza toda la información en una plataforma web.

---

## Arquitectura

```
sistema-vacas/
├── frontend/               # Next.js 16 — Frontend React con App Router
│   ├── src/
│   │   ├── app/            # Rutas y páginas (App Router)
│   │   │   ├── (auth)/     # Login
│   │   │   └── (dashboard)/# Dashboard, Animales, Corrales, Alertas, Config
│   │   ├── components/     # Sidebar, Navbar, etc.
│   │   ├── contexts/       # AuthContext (Sanctum token)
│   │   └── lib/            # API client (axios), utils
│   └── .env.local          # NEXT_PUBLIC_API_URL=http://localhost:8000/api
│
├── app/                    # Laravel 10 — Backend API (Controllers, Models, Middleware)
├── resources/views/        # Blade views aún disponibles (migración en progreso)
├── resources/css/          # Tailwind CSS v4
├── resources/js/           # Alpine.js
├── routes/                 # web.php (Blade) + api.php (JSON API para Next.js)
├── database/               # Migraciones y seeders (PostgreSQL)
├── backend/                # FastAPI Python — API Gateway y dominios
└── services/ai-service/    # FastAPI + YOLO — Procesamiento de imágenes
```

### Flujo de comunicación

```
Navegador → Next.js (Frontend, SSR/React, puerto 3000)
                ↕ REST API JSON (axios + Bearer token)
            Laravel (Backend API, Sanctum, puerto 8000)
                ↕ PostgreSQL + FastAPI Python + AI Service
```

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend (nuevo) | **Next.js 16** + React 19 + Tailwind CSS v4 + TypeScript |
| Frontend (legacy) | Laravel Blade + Alpine.js (migración en progreso) |
| Backend API | PHP 8.1 / **Laravel 10** / PostgreSQL / Sanctum |
| Backend Python | FastAPI + SQLAlchemy + Alembic + Redis |
| Visión artificial | YOLO via Python |

---

## Requisitos

- PHP >= 8.1 + Composer
- PostgreSQL
- Node.js >= 18
- Python >= 3.10 (para backend Python y AI Service)

---

## Instalación

### Backend Laravel
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Frontend Next.js
```bash
cd frontend
npm install
cp .env.local.example .env.local  # editar API URL si es necesario
```

---

## Levantar el proyecto

```bash
# Terminal 1 — Laravel API
php artisan serve --port=8000

# Terminal 2 — Next.js frontend
cd frontend && npm run dev         # http://localhost:3000
```

> Abrí **http://localhost:3000** — el frontend Next.js se conecta a la API Laravel en `localhost:8000/api`.

Para el backend Python (opcional):
```bash
cd backend
pip install -e .
uvicorn api_gateway.main:app --reload --port=8001
```

---

## Variables de entorno

### Laravel
Copiá `.env.example` a `.env` y completá:
- `DB_*` — conexión a PostgreSQL
- `APP_KEY` — generada con `php artisan key:generate`
- `SANCTUM_STATEFUL_DOMAINS` — debe incluir `localhost:3000` (ya configurado)

### Next.js
Ver `frontend/.env.local`:
- `NEXT_PUBLIC_API_URL` — URL base de la API Laravel (default: `http://localhost:8000/api`)

### Backend Python
Copiá `backend/.env.example` a `backend/.env`.

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, devuelve token + user |
| POST | `/api/auth/logout` | Revoca token actual |
| GET | `/api/auth/user` | Devuelve usuario autenticado |

### Dashboard
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard` | KPIs: peso promedio, animales, alertas, temperatura + datos recientes |

### Animales
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/animales` | Listado paginado con filtros |
| GET | `/api/animales/{id}` | Detalle con relaciones |
| POST | `/api/animales` | Crear animal |
| PUT | `/api/animales/{id}` | Actualizar animal |
| DELETE | `/api/animales/{id}` | Dar de baja (soft delete) |

### Corrales
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/corrales` | Listado con conteo de animales y alertas |
| GET | `/api/corrales/{id}` | Detalle |
| POST | `/api/corrales` | Crear corral |
| PUT | `/api/corrales/{id}` | Actualizar |
| DELETE | `/api/corrales/{id}` | Desactivar |

### Alertas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/alertas` | Listado paginado con filtros |
| GET | `/api/alertas/{id}` | Detalle |
| PUT | `/api/alertas/{id}/resolver` | Marcar como resuelta |

### Configuración
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/configuracion` | Obtener configuraciones agrupadas |
| PUT | `/api/configuracion` | Actualizar configuración + re-evaluar reglas |
| POST | `/api/configuracion/ejecutar-reglas` | Ejecutar motor de reglas manualmente |

---

## Rutas del Frontend (Next.js)

| Ruta | Descripción |
|------|-------------|
| `/login` | Login con formulario |
| `/dashboard` | KPIs, alertas recientes, últimos ingresos, ocupación |
| `/animales` | Listado con filtros y paginación |
| `/animales/nuevo` | Formulario de registro |
| `/corrales` | Grid de corrales con barras de ocupación |
| `/alertas` | Listado con filtros y botón resolver |
| `/configuracion` | Panel de configuración + motor de reglas en vivo |

---

## Migración desde Blade

El proyecto está migrando de Laravel Blade a Next.js + Laravel API. El proceso sigue estos pasos:

1. ✅ **API Layer** — Controladores API en `app/Http/Controllers/Api/` con Sanctum token auth
2. ✅ **Next.js setup** — App Router, Tailwind CSS v4, tema GanadoVision
3. ✅ **Login** — Página de login con Ken Burns background
4. ✅ **Dashboard** — KPIs con count-up, alertas recientes, ocupación
5. ✅ **Animales** — Listado con filtros, formulario de creación
6. ✅ **Corrales** — Grid con cards de ocupación
7. ✅ **Alertas** — Listado con filtros por severidad/estado/tipo
8. ✅ **Configuración** — Formularios + motor de reglas interactivo
9. ⬜ **Vista detalle animal** — Página individual con gráficos
10. ⬜ **Mapa interactivo** — Leaflet/Mapbox con posiciones de animales
11. ⬜ **Notificaciones push** — WebPush en navegador
12. ⬜ **Módulo de reportes** — Exportación CSV/Excel

---

## Dashboard — Plan de Desarrollo Futuro

### Backend (a través de Laravel API o FastAPI)

- [BE-3.1] WebSocket server para métricas en vivo
- [BE-3.2] API de métricas agregadas con Redis cache
- [BE-3.3] Servicio de notificaciones push y email
- [BE-3.4] API de reportes con exportación CSV/Excel

### Frontend (Next.js)

- [FE-3.2] Mapa interactivo con Leaflet/Mapbox
- [FE-3.3] Vista detallada de animal con gráficos de peso
- [FE-3.5] Notificaciones push en navegador
- [FE-3.6] Módulo de Reportes con gráficos (recharts)
