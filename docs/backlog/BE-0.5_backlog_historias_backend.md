# [BE-0.5] Backlog de historias de usuario — Backend

**Proyecto:** Plataforma de Monitoreo Bovino
**Tablero:** Backend
**Fase:** 0 — Fundamentos
**Tarjeta:** BE-0.5
**Objetivo:** Dividir los módulos backend principales en historias de usuario pequeñas, estimadas entre 2 y 4 horas, para facilitar la planificación del sprint y el reparto de tareas entre desarrolladores.

---

## 1. Criterio general para las historias

Las historias se redactan con el siguiente formato:

> Como [tipo de usuario o sistema], quiero [acción o funcionalidad], para [beneficio esperado].

Cada historia incluye:
- Módulo.
- Prioridad.
- Estimación.
- Criterios de aceptación.
- Dependencias técnicas, si corresponde.

---

# 2. Backlog Backend

## Módulo RFID

### BE-RFID-01 — Recibir eventos RFID desde antenas

**Como** sistema backend, **quiero** recibir eventos generados por antenas RFID, **para** detectar animales cuando pasen por zonas monitoreadas.

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** BE-1.1 Driver RFID

**Criterios de aceptación:**
- El sistema debe recibir un evento con `rfid`, `antena_id`, `timestamp` y `ubicacion`.
- El evento debe validarse antes de procesarse.
- Si falta un dato obligatorio, debe registrarse un error.
- Si el RFID existe, debe asociarse al animal correspondiente.

### BE-RFID-02 — Validar formato de lectura RFID

**Prioridad:** Alta | **Estimación:** 2 hs | **Dependencias:** BE-RFID-01

**Criterios de aceptación:**
- El RFID no debe estar vacío.
- El RFID debe cumplir con el formato definido por el sistema.
- Las lecturas inválidas deben descartarse o marcarse como erróneas.
- Debe quedar registro en logs de la lectura inválida.

### BE-RFID-03 — Registrar detección de animal

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-RFID-01, modelo de datos de animales

**Criterios de aceptación:**
- La detección debe guardarse en base de datos.
- Debe asociarse a un animal existente.
- Debe incluir fecha, hora, antena y ubicación.
- Debe evitar duplicados excesivos en un intervalo corto de tiempo.

### BE-RFID-04 — Publicar evento `animal.detected`

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** RabbitMQ/Kafka configurado

**Criterios de aceptación:**
- Se debe publicar el evento `animal.detected`.
- El evento debe incluir `animal_id`, `rfid`, `antena_id`, `timestamp` y `ubicacion`.
- El evento debe enviarse al bus de mensajería.
- Si falla la publicación, debe registrarse el error.

### BE-RFID-05 — Simular eventos RFID en entorno de desarrollo

**Prioridad:** Media | **Estimación:** 3 hs | **Dependencias:** BE-RFID-01

**Criterios de aceptación:**
- Debe existir un script o endpoint para generar eventos simulados.
- Los eventos deben usar RFID de animales de prueba.
- Debe poder configurarse la frecuencia de emisión.
- Debe documentarse su uso para desarrollo.

---

## Módulo Trazabilidad

### BE-TRAZ-01 — Crear animal

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** Modelo de datos inicial

**Criterios de aceptación:**
- Endpoint `POST /api/v1/animales`.
- Debe recibir RFID, raza, edad, peso inicial, lote y corral.
- El RFID debe ser único.
- Debe devolver el animal creado.
- Debe validar datos obligatorios.

### BE-TRAZ-02 — Listar animales con paginación y filtros

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** BE-TRAZ-01

**Criterios de aceptación:**
- Endpoint `GET /api/v1/animales`.
- Debe soportar paginación.
- Debe permitir filtrar por corral, lote, estado y RFID.
- Debe devolver total de registros.
- Debe responder en formato JSON.

### BE-TRAZ-03 — Consultar detalle de animal

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-TRAZ-01

**Criterios de aceptación:**
- Endpoint `GET /api/v1/animales/{id}`.
- Debe devolver datos básicos del animal.
- Debe indicar lote, corral y estado actual.
- Si el animal no existe, debe devolver error 404.

### BE-TRAZ-04 — Modificar datos de animal

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-TRAZ-03

**Criterios de aceptación:**
- Endpoint `PATCH /api/v1/animales/{id}`.
- Debe permitir actualizar campos editables.
- No debe permitir duplicar RFID.
- Debe registrar auditoría del cambio.
- Si el animal no existe, debe devolver error 404.

### BE-TRAZ-05 — Dar de baja lógica a un animal

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-TRAZ-03

**Criterios de aceptación:**
- Endpoint `DELETE /api/v1/animales/{id}`.
- El animal debe cambiar su estado a `baja`.
- No debe eliminarse físicamente de la base de datos.
- Debe registrarse la operación en auditoría.

### BE-TRAZ-06 — Registrar movimiento entre corrales o lotes

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** BE-TRAZ-03

**Criterios de aceptación:**
- Endpoint `POST /api/v1/animales/{id}/movimientos`.
- Debe registrar corral/lote origen y destino.
- Debe actualizar ubicación actual del animal.
- Debe guardar fecha y responsable del movimiento.
- Debe validar que el animal esté activo.

### BE-TRAZ-07 — Consultar historial de movimientos

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-TRAZ-06

**Criterios de aceptación:**
- Endpoint `GET /api/v1/animales/{id}/historial`.
- Debe listar movimientos ordenados por fecha.
- Debe mostrar origen, destino y responsable.
- Debe permitir paginación si hay muchos registros.

---

## Módulo Alertas

### BE-ALER-01 — Crear modelo de alertas

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** Modelo de datos inicial

**Criterios de aceptación:**
- Crear tabla `alertas`.
- Debe incluir tipo, severidad, estado, mensaje y fecha.
- Debe poder asociarse a un animal, corral o lote.
- Debe incluir estado `abierta` o `resuelta`.

### BE-ALER-02 — Generar alerta por evento recibido

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** BE-ALER-01, bus de eventos

**Criterios de aceptación:**
- El servicio debe consumir eventos relevantes.
- Debe evaluar reglas simples.
- Si se cumple una condición, debe crear una alerta.
- Debe evitar duplicar alertas iguales abiertas.

### BE-ALER-03 — Listar alertas con filtros

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-ALER-01

**Criterios de aceptación:**
- Endpoint `GET /api/v1/alertas`.
- Debe permitir filtros por severidad y estado.
- Debe soportar paginación.
- Debe ordenar por fecha descendente.

### BE-ALER-04 — Marcar alerta como resuelta

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-ALER-03

**Criterios de aceptación:**
- Endpoint `PATCH /api/v1/alertas/{id}/resolver`.
- Debe cambiar estado a `resuelta`.
- Debe guardar fecha de resolución.
- Debe registrar usuario responsable.
- Si la alerta no existe, debe devolver 404.

### BE-ALER-05 — Publicar evento `alerta.creada`

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-ALER-02

**Criterios de aceptación:**
- Debe publicarse evento `alerta.creada`.
- El evento debe incluir `alerta_id`, severidad, tipo y timestamp.
- El evento debe estar disponible para WebSocket y notificaciones.
- Debe registrarse error si falla la publicación.

---

## Módulo Sanitario

### BE-SAN-01 — Registrar evento sanitario

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** Modelo de animales

**Criterios de aceptación:**
- Endpoint `POST /api/v1/animales/{id}/eventos-sanitarios`.
- Debe permitir tipo: enfermedad, tratamiento, vacuna o muerte.
- Debe registrar fecha, descripción y estado.
- Debe validar que el animal exista.
- Si el evento es muerte, debe actualizar estado del animal.

### BE-SAN-02 — Listar eventos sanitarios

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-SAN-01

**Criterios de aceptación:**
- Endpoint `GET /api/v1/eventos-sanitarios`.
- Debe permitir filtros por tipo, fecha y estado.
- Debe devolver datos paginados.
- Debe incluir información básica del animal asociado.

### BE-SAN-03 — Cerrar tratamiento sanitario

**Prioridad:** Media | **Estimación:** 3 hs | **Dependencias:** BE-SAN-01

**Criterios de aceptación:**
- Endpoint `PATCH /api/v1/eventos-sanitarios/{id}`.
- Debe permitir cambiar estado a cerrado.
- Debe guardar fecha de cierre.
- Debe validar que el evento sea de tipo tratamiento.

### BE-SAN-04 — Obtener estadísticas sanitarias

**Prioridad:** Media | **Estimación:** 4 hs | **Dependencias:** BE-SAN-02

**Criterios de aceptación:**
- Endpoint `GET /api/v1/eventos-sanitarios/stats`.
- Debe devolver cantidad de enfermos.
- Debe devolver tratamientos activos.
- Debe devolver cantidad de muertes del mes.
- Debe permitir filtrar por establecimiento o lote.

---

## Módulo Stock e Insumos

### BE-STOCK-01 — Crear insumo

**Prioridad:** Media | **Estimación:** 3 hs | **Dependencias:** Modelo de datos inicial

### BE-STOCK-02 — Listar insumos

**Prioridad:** Media | **Estimación:** 2 hs | **Dependencias:** BE-STOCK-01

### BE-STOCK-03 — Registrar movimiento de stock

**Prioridad:** Alta | **Estimación:** 4 hs | **Dependencias:** BE-STOCK-01

### BE-STOCK-04 — Consultar saldos de stock

**Prioridad:** Alta | **Estimación:** 3 hs | **Dependencias:** BE-STOCK-03

### BE-STOCK-05 — Generar alerta por stock bajo

**Prioridad:** Media | **Estimación:** 4 hs | **Dependencias:** BE-STOCK-04, BE-ALER-01

---

## 3. Resumen de historias por módulo

| Módulo | Cantidad | Estimación total |
|---|---:|---:|
| RFID | 5 | 15 hs |
| Trazabilidad | 7 | 24 hs |
| Alertas | 5 | 16 hs |
| Sanitario | 4 | 14 hs |
| Stock/Insumos | 5 | 16 hs |
| **Total** | **26** | **85 hs** |

---

## 4. Priorización sugerida

### Prioridad Alta
BE-RFID-01, BE-RFID-02, BE-RFID-03, BE-RFID-04, BE-TRAZ-01, BE-TRAZ-02, BE-TRAZ-03, BE-TRAZ-04, BE-TRAZ-05, BE-TRAZ-06, BE-TRAZ-07, BE-ALER-01, BE-ALER-02, BE-ALER-03, BE-ALER-04, BE-ALER-05, BE-SAN-01, BE-SAN-02, BE-STOCK-03, BE-STOCK-04

### Prioridad Media
BE-RFID-05, BE-SAN-03, BE-SAN-04, BE-STOCK-01, BE-STOCK-02, BE-STOCK-05

---

## 5. Definición de terminado (DoD)

Una historia se considera terminada cuando:
- El endpoint o funcionalidad está implementada.
- Tiene validaciones de entrada.
- Tiene manejo de errores.
- Tiene tests básicos.
- Está documentada en Swagger/OpenAPI.
- El código fue revisado mediante Pull Request.
- No rompe funcionalidades existentes.
- Cumple los criterios de aceptación definidos.

---

## 6. Historias pendientes para próximas fases

### Módulo Cámaras / Ingesta de imágenes
- BE-CAM-01 — Registrar cámaras IP del establecimiento
- BE-CAM-02 — Capturar frames desde cámaras IP

### Módulo IA / Predicción de peso
- BE-IA-01 — Enviar imagen al servicio de predicción de peso
- BE-IA-02 — Guardar historial de predicciones de IA

### Módulo Usuarios, roles y autenticación
- BE-AUTH-01 — Iniciar sesión con JWT
- BE-AUTH-02 — Proteger endpoints por rol

### Módulo Dashboard y métricas
- BE-DASH-01 — Consultar métricas principales del dashboard
- BE-DASH-02 — Emitir métricas en tiempo real por WebSocket

### Módulo Reportes
- BE-REP-01 — Generar reporte de evolución de peso
- BE-REP-02 — Exportar reportes en CSV o Excel
