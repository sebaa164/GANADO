# [BE-1.2] Servicio de ingesta de frames desde cámaras IP (RTSP)

## Objetivo
Implementar un servicio backend que permita conectarse a cámaras IP mediante RTSP, capturar frames a intervalos definidos y dejar esos snapshots disponibles para el procesamiento posterior de IA.

## Alcance

- Módulo `domains/camaras` en FastAPI.
- Captura de frames desde una URL RTSP o fuente de video local.
- Endpoint de captura manual.
- Endpoint de captura simulada para desarrollo sin cámara real.
- Modelo de datos para cámaras y frames capturados.
- Migración Alembic.
- Carpeta local `storage/snapshots` para guardar imágenes.

## Endpoints

### Estado del servicio
```
GET /api/v1/camaras/health
```

### Capturar frame desde RTSP
```
POST /api/v1/camaras/{camara_id}/capture?rtsp_url=rtsp://usuario:clave@ip:554/stream1
```

### Capturar frame simulado
```
POST /api/v1/camaras/{camara_id}/capture/simulado
```

## Dependencias

```text
opencv-python-headless
numpy
```

## Criterios de aceptación cubiertos

- Cliente RTSP con OpenCV.
- Configuración mínima de cámara: URL, ubicación, FPS y resolución.
- Guardado de snapshots por timestamp.
- Endpoint para captura manual.
- Simulación para desarrollo sin hardware real.
- Base lista para publicar luego el evento `frame.captured`.

## Pendiente para completar en campo

- Conectar cámara IP real.
- Medir frames perdidos.
- Agregar worker periódico.
- Publicar evento `frame.captured` en Redis/RabbitMQ/Kafka.
- Guardar snapshots en MinIO/S3 en vez de disco local.
