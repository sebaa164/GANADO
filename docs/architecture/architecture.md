# Arquitectura del sistema (Fase 0)

## Objetivo
Definir la arquitectura inicial del backend de la plataforma de monitoreo bovino usando FastAPI como API principal, PostgreSQL como base de datos, Redis como soporte de cache/pub-sub y servicios separados para módulos críticos.

## Componentes

- **API Gateway FastAPI:** punto de entrada REST para frontend y servicios externos.
- **Servicio de trazabilidad:** gestiona animales, lotes, corrales y movimientos.
- **Servicio RFID:** recibirá lecturas de caravanas/chips y publicará eventos `animal.detected`.
- **Servicio de cámaras:** recibirá/capturará frames RTSP y publicará eventos `frame.captured`.
- **Servicio de IA:** procesará imágenes para estimar peso y comportamiento.
- **Servicio de alertas:** aplicará reglas y generará alertas sanitarias/productivas.
- **PostgreSQL:** persistencia transaccional.
- **Redis:** cache, readiness y pub/sub inicial.

## Comunicación

### REST inicial
- `GET /health`
- `GET /ready`
- Fase siguiente: `/api/v1/animales`, `/api/v1/corrales`, `/api/v1/alertas`, `/api/v1/hardware`.

### Eventos definidos para fases siguientes
- `animal.detected`
- `frame.captured`
- `weight.estimated`
- `alert.created`
- `stock.low`

## Pendiente planificado
RabbitMQ/Kafka se documenta como bus objetivo, pero su implementación queda para Fase 1 cuando se conecte hardware real.

## Stack actual del proyecto

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4 (en `frontend/`)
- **Backend principal:** Laravel 10 + PostgreSQL + Sanctum (puerto 8000)
- **Backend IA:** FastAPI + Python (en `/backend/`, puerto 8000 o 8001)
- **Microservicio visión:** FastAPI + YOLO (en `/services/ai-service/`)
