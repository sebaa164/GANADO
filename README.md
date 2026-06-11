# GanadoVision — Sistema Inteligente de Monitoreo de Ganado en Feedlot

## Descripcion

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

---

## Dashboard — Resumen y Plan de Desarrollo

El dashboard es el módulo central del sistema. Concentra métricas en tiempo real, mapa de animales, gestión de alertas, notificaciones push y reportes.

---

### Backend — Soporte para el Dashboard

#### [BE-3.1] WebSocket server para métricas en vivo
**Estimación:** 4 días | **Prioridad:** Alta

Servidor WebSocket que emite en tiempo real las métricas que consume el dashboard.

- FastAPI WebSocket en `/ws/dashboard`
- Autenticación JWT en el handshake
- Pub/Sub con Redis para escalar horizontalmente
- Eventos a emitir: `metric.update`, `alert.new`, `animal.moved`
- Tests con `websocket_client`

---

#### [BE-3.2] API de métricas agregadas del dashboard
**Estimación:** 3 días | **Prioridad:** Alta

Endpoints que devuelven los KPIs principales cacheados con Redis.

- `GET /api/v1/dashboard/metrics` — snapshot completo
- `GET /api/v1/dashboard/timeseries?metric=peso&desde&hasta`
- Cache Redis con TTL 30 segundos
- Filtros por establecimiento, corral y lote

---

#### [BE-3.3] API de alertas (listado y resolver)
**Estimación:** 2 días | **Prioridad:** Alta

CRUD de alertas para el panel de alertas del dashboard.

- `GET /api/v1/alertas?severidad=&estado=` — paginado
- `PATCH /api/v1/alertas/{id}/resolver`
- `PATCH /api/v1/alertas/{id}/asignar` — asignar a usuario
- Tests

---

#### [BE-3.4] Servicio de notificaciones push y email
**Estimación:** 5 días | **Prioridad:** Alta

Servicio que envía notificaciones WebPush + email para alertas críticas.

- Integración con WebPush (VAPID keys)
- Cliente SMTP con plantillas Jinja2
- Tabla `suscripciones_notificacion` en BD
- Worker que consume el evento `alerta.creada`
- Endpoint para suscribirse a WebPush
- Plantillas de email por tipo de alerta

---

#### [BE-3.5] API de reportes (datos para gráficos)
**Estimación:** 4 días | **Prioridad:** Quick win

Endpoints con datos agregados para los gráficos del módulo de reportes.

- `GET /api/v1/reportes/peso-evolucion?lote=&desde&hasta&granularidad`
- `GET /api/v1/reportes/consumo?corral=&desde&hasta`
- `GET /api/v1/reportes/comparativo-lotes?lotes[]=&metric=`
- `POST /api/v1/reportes/export` — exportación CSV/Excel async con Celery

---

### Frontend — Vistas del Dashboard

#### [FE-3.1] Dashboard principal con métricas en tiempo real
**Estimación:** 4 días | **Prioridad:** Alta

Página de entrada al sistema con 4 KPI cards conectadas vía WebSocket.

- Ruta `/` (raíz = dashboard)
- MetricCard "Peso Promedio" — `#639922`
- MetricCard "Animales Activos" — `#3B6D11`
- MetricCard "Alertas Activas" — `#BA7517`
- MetricCard "Temperatura Ambiente" — `#C0DD97`
- Hook `useWebSocket('/ws/dashboard')` para recibir updates en vivo
- Animación count-up al cambiar valores
- Estado de loading inicial y manejo de reconexión

---

#### [FE-3.2] Mapa interactivo con posición de animales
**Estimación:** 6 días | **Prioridad:** Alta

Mapa centrado en el campo (`-33.3435, -66.0574167`) con animales, corrales y antenas.

- Integración con Leaflet o Mapbox GL
- Capa base de imagen satelital del campo
- Polígonos de corrales (configurables)
- Marcadores de antenas RFID
- Marcadores de animales con clustering para +100
- Click en animal → popup con info básica + link a detalle
- Filtros por lote/corral
- Actualización en vivo de posiciones por WebSocket

---

#### [FE-3.3] Vista detallada de animal
**Estimación:** 5 días | **Prioridad:** Alta

Página completa de un animal individual, accesible desde el mapa o la tabla.

- Ruta `/animales/[id]`
- Header con datos básicos: RFID, raza, edad, peso actual, corral
- Gráfico de línea con evolución de peso (recharts)
- Timeline de eventos: sanitarios + movimientos
- Lista de alertas asociadas al animal
- Tab de consumo de alimentación
- Foto del animal (último frame de cámara)
- Botón "Editar"

---

#### [FE-3.4] Panel de alertas con niveles de criticidad
**Estimación:** 4 días | **Prioridad:** Alta

Vista de alertas codificadas por color con acciones de resolución.

- Ruta `/alertas`
- Filtros: severidad, estado (abiertas/resueltas), tipo
- Cards con ícono grande según tipo de alerta
- Colores: Normal `#639922` · Advertencia `#BA7517` · Crítico `#C94A3F`
- Botón "Marcar como resuelta"
- Asignar alerta a otro usuario
- Vista de detalle con contexto (animal + lectura que la generó)
- Badge en la navbar con contador de alertas activas

---

#### [FE-3.5] Notificaciones push en navegador
**Estimación:** 3 días | **Prioridad:** Alta

Suscripción a WebPush para recibir alertas aunque la pestaña esté cerrada.

- Service Worker registrado
- Solicitar permiso de notificación al usuario
- Suscribir a WebPush con VAPID public key del backend
- `POST /api/v1/notifications/subscribe` con la subscription del browser
- Handler de push event en el SW que muestra la notificación
- Click en notificación → abre la app en la alerta correspondiente
- Toggle en el perfil del usuario para activar/desactivar

---

#### [FE-3.6] Módulo de Reportes con gráficos
**Estimación:** 6 días | **Prioridad:** Alta

Vista de reportes con filtros, múltiples gráficos y exportación.

- Ruta `/reportes`
- Filtros superiores: fecha, lote, corral
- Gráfico de línea: peso en el tiempo (recharts)
- Gráfico de barras: consumo de alimentación
- Gráfico comparativo entre lotes
- Tabla detallada con datos crudos (TanStack Table)
- Botones de exportación: CSV, Excel, PDF
- Loading states para queries pesadas

---

### Estimación total — Dashboard

| Sección | Tarjetas | Estimación |
|---|---|---|
| Backend (BE-3.x) | 5 | ~18 días-persona |
| Frontend (FE-3.x) | 6 | ~28 días-persona |
| **Total** | **11** | **~46 días-persona** |

---

### Orden lógico de desarrollo

1. **BE-3.1** + **BE-3.2** primero — el WebSocket y la API de métricas son prerequisitos de FE-3.1
2. **FE-3.2** (mapa) puede desarrollarse en paralelo con datos mockeados
3. **BE-3.3** antes de **FE-3.4** (panel de alertas depende del CRUD de alertas)
4. **BE-3.4** + **FE-3.5** en paralelo (notificaciones push)
5. **BE-3.5** + **FE-3.6** al final (reportes son independientes del flujo principal)
