# 🐄 Lookin' at Cows — Sistema Inteligente de Monitoreo de Ganado en Feedlot

## Introducción

Este proyecto es un sistema automatizado de monitoreo de ganado bovino en sistemas de engorde a corral (feedlot), desarrollado para detectar anomalías de comportamiento en tiempo real mediante visión artificial e inteligencia artificial.

El problema que resuelve es concreto: hoy el control del estado de los animales se hace de forma manual, con recorridas periódicas que dependen del ojo humano. Eso genera detección tardía de enfermedades, falta de registros históricos y una dependencia total del factor humano. Este sistema apunta a cambiar eso.

Las cámaras capturan imágenes de los corrales, un modelo de IA (YOLO) analiza el comportamiento de cada animal, y el sistema genera alertas automáticas cuando detecta signos de enfermedad o comportamiento anómalo — aislamiento, inactividad prolongada, permanencia en el suelo, falta de acceso al comedero, entre otros.

El usuario accede a toda esta información desde una plataforma web: estado general del sistema, alertas activas, historial de eventos y datos climáticos integrados.

---

## Arquitectura del Sistema

El proyecto está organizado como un monorepo con múltiples servicios:

```
sistema-vacas/
├── app/                        # Laravel — API principal (backend)
├── services/
│   └── ai-service/             # FastAPI — Microservicio de IA y procesamiento de imágenes
├── database/                   # Migraciones y seeders (PostgreSQL)
├── routes/                     # Rutas de la API REST
└── ...
```

### Servicios principales

| Servicio | Tecnología | Responsabilidad |
|---|---|---|
| API Principal | Laravel 10 + PostgreSQL | Lógica de negocio, trazabilidad, alertas, usuarios |
| Servicio de IA | FastAPI + Python | Procesamiento de imágenes, detección YOLO, clasificación de estados |

---

## Stack Tecnológico

- **Backend principal:** PHP 8.1 / Laravel 10
- **Microservicio IA:** Python / FastAPI
- **Base de datos:** PostgreSQL
- **Autenticación:** Laravel Sanctum
- **Visión artificial:** YOLO (via Python)
- **Comunicación entre servicios:** REST

---

## Requisitos

- PHP >= 8.1
- Composer
- Python >= 3.10
- PostgreSQL
- Node.js (para assets frontend)

---

## Instalación

### Backend Laravel

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```

> El servidor de desarrollo corre en **http://localhost:8000**

### Microservicio IA (FastAPI)

```bash
cd services/ai-service
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

---

## Variables de entorno

Copiá `.env.example` a `.env` en la raíz del proyecto y completá los valores de conexión a PostgreSQL y las claves necesarias.

Para el microservicio de IA, hacé lo mismo dentro de `services/ai-service/`.
