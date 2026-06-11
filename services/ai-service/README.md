# AI Service — Lookin' at Cows

Microservicio de procesamiento de imágenes y detección de comportamiento bovino.

## Responsabilidades

- Recibir imágenes desde las cámaras del feedlot
- Procesar imágenes con modelos YOLO para detectar animales
- Clasificar el estado de cada animal (sano / en observación / enfermo)
- Exponer endpoints REST para que el servicio Laravel consuma los resultados

## Instalación

```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
```

## Levantar el servidor

```bash
uvicorn main:app --reload --port 8001
```

## Documentación interactiva

Una vez levantado, accedé a:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | /health | Health check del servicio |
| GET | /api/v1/ping | Ping de prueba |
