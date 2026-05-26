# Arquitectura de Microservicios - Sistema de Trazabilidad

| Campo | Valor |
|-------|-------|
| Versión | 1.0 |
| Fecha | 2026-05-26 |
| Autores | Backend + TLs |
| Estado | Propuesta |

---

## 1. Componentes del sistema

| Componente | Tecnología | Base de datos |
|------------|------------|---------------|
| API Gateway | Kong / NGINX | - |
| Trazabilidad | Java + Spring Boot | PostgreSQL |
| RFID | Go + MQTT | Redis |
| Cámaras | Python + FastAPI + OpenCV | MinIO |
| IA | Python + TensorRT | - |
| Alertas | Node.js + Express | Redis |
| Broker | Kafka / RabbitMQ | - |

---

## 2. Comunicación REST (síncrona)

| Origen | Destino | Método | Endpoint |
|--------|---------|--------|----------|
| API Gateway | Trazabilidad | GET | /trace/{lotId} |
| API Gateway | Trazabilidad | POST | /trace/register |
| API Gateway | RFID | GET | /rfid/last/{tagId} |
| API Gateway | RFID | POST | /rfid/scan/force |
| API Gateway | Alertas | GET | /alerts/active |
| Cámaras | IA | POST | /infer/from-frame |

---

## 3. Eventos asíncronos

| Evento | Productor | Consumidor(es) |
|--------|-----------|----------------|
| rfid.read | RFID | Trazabilidad, Alertas |
| camera.detection | Cámaras | IA |
| ia.inference | IA | Trazabilidad, Alertas |
| alert.triggered | Alertas | API Gateway |

### Formato de cada evento

**Evento: rfid.read**
```json
{
  "eventType": "rfid.read",
  "tagId": "TAG001",
  "gateId": "GATE1",
  "timestamp": "2026-05-26T10:00:00Z"
}