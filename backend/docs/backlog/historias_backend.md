# [BE-0.5] Backlog de historias de usuario — Backend

## Plataforma de Monitoreo Bovino

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

---

# Módulo RFID

## BE-RFID-01 — Recibir eventos RFID desde antenas

**Como** sistema backend,  
**quiero** recibir eventos generados por antenas RFID,  
**para** detectar animales cuando pasen por zonas monitoreadas.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-1.1 Driver RFID

### Criterios de aceptación

- El sistema debe recibir un evento con `rfid`, `antena_id`, `timestamp` y `ubicacion`.
- El evento debe validarse antes de procesarse.
- Si falta un dato obligatorio, debe registrarse un error.
- Si el RFID existe, debe asociarse al animal correspondiente.

---

## BE-RFID-02 — Validar formato de lectura RFID

**Como** sistema backend,  
**quiero** validar el formato de los códigos RFID recibidos,  
**para** evitar procesar lecturas inválidas.

**Prioridad:** Alta  
**Estimación:** 2 hs  
**Dependencias:** BE-RFID-01

### Criterios de aceptación

- El RFID no debe estar vacío.
- El RFID debe cumplir con el formato definido por el sistema.
- Las lecturas inválidas deben descartarse o marcarse como erróneas.
- Debe quedar registro en logs de la lectura inválida.

---

## BE-RFID-03 — Registrar detección de animal

**Como** sistema backend,  
**quiero** registrar cada detección RFID válida,  
**para** mantener historial de movimientos y presencia de animales.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-RFID-01, modelo de datos de animales

### Criterios de aceptación

- La detección debe guardarse en base de datos.
- Debe asociarse a un animal existente.
- Debe incluir fecha, hora, antena y ubicación.
- Debe evitar duplicados excesivos en un intervalo corto de tiempo.

---

## BE-RFID-04 — Publicar evento `animal.detected`

**Como** sistema backend,  
**quiero** publicar un evento cuando se detecta un animal por RFID,  
**para** que otros servicios puedan reaccionar de forma asíncrona.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** RabbitMQ/Kafka configurado

### Criterios de aceptación

- Se debe publicar el evento `animal.detected`.
- El evento debe incluir `animal_id`, `rfid`, `antena_id`, `timestamp` y `ubicacion`.
- El evento debe enviarse al bus de mensajería.
- Si falla la publicación, debe registrarse el error.

---

## BE-RFID-05 — Simular eventos RFID en entorno de desarrollo

**Como** desarrollador backend,  
**quiero** generar eventos RFID simulados,  
**para** probar el sistema sin depender del hardware real.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:** BE-RFID-01

### Criterios de aceptación

- Debe existir un script o endpoint para generar eventos simulados.
- Los eventos deben usar RFID de animales de prueba.
- Debe poder configurarse la frecuencia de emisión.
- Debe documentarse su uso para desarrollo.

---

# Módulo Trazabilidad

## BE-TRAZ-01 — Crear animal

**Como** usuario administrador o encargado,  
**quiero** registrar un nuevo animal,  
**para** incorporarlo al sistema de monitoreo.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** Modelo de datos inicial

### Criterios de aceptación

- Endpoint `POST /api/v1/animales`.
- Debe recibir RFID, raza, edad, peso inicial, lote y corral.
- El RFID debe ser único.
- Debe devolver el animal creado.
- Debe validar datos obligatorios.

---

## BE-TRAZ-02 — Listar animales con paginación y filtros

**Como** usuario del sistema,  
**quiero** consultar el listado de animales con filtros,  
**para** encontrar rápidamente la información que necesito.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-TRAZ-01

### Criterios de aceptación

- Endpoint `GET /api/v1/animales`.
- Debe soportar paginación.
- Debe permitir filtrar por corral, lote, estado y RFID.
- Debe devolver total de registros.
- Debe responder en formato JSON.

---

## BE-TRAZ-03 — Consultar detalle de animal

**Como** usuario del sistema,  
**quiero** ver el detalle completo de un animal,  
**para** consultar sus datos principales.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-TRAZ-01

### Criterios de aceptación

- Endpoint `GET /api/v1/animales/{id}`.
- Debe devolver datos básicos del animal.
- Debe indicar lote, corral y estado actual.
- Si el animal no existe, debe devolver error 404.

---

## BE-TRAZ-04 — Modificar datos de animal

**Como** usuario autorizado,  
**quiero** modificar datos de un animal,  
**para** mantener actualizada su información.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-TRAZ-03

### Criterios de aceptación

- Endpoint `PATCH /api/v1/animales/{id}`.
- Debe permitir actualizar campos editables.
- No debe permitir duplicar RFID.
- Debe registrar auditoría del cambio.
- Si el animal no existe, debe devolver error 404.

---

## BE-TRAZ-05 — Dar de baja lógica a un animal

**Como** usuario autorizado,  
**quiero** dar de baja un animal sin eliminarlo físicamente,  
**para** conservar su historial.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-TRAZ-03

### Criterios de aceptación

- Endpoint `DELETE /api/v1/animales/{id}`.
- El animal debe cambiar su estado a `baja`.
- No debe eliminarse físicamente de la base de datos.
- Debe registrarse la operación en auditoría.

---

## BE-TRAZ-06 — Registrar movimiento entre corrales o lotes

**Como** usuario encargado,  
**quiero** registrar movimientos de animales entre corrales o lotes,  
**para** mantener trazabilidad completa.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-TRAZ-03

### Criterios de aceptación

- Endpoint `POST /api/v1/animales/{id}/movimientos`.
- Debe registrar corral/lote origen y destino.
- Debe actualizar ubicación actual del animal.
- Debe guardar fecha y responsable del movimiento.
- Debe validar que el animal esté activo.

---

## BE-TRAZ-07 — Consultar historial de movimientos

**Como** usuario del sistema,  
**quiero** consultar el historial de movimientos de un animal,  
**para** conocer su trazabilidad.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-TRAZ-06

### Criterios de aceptación

- Endpoint `GET /api/v1/animales/{id}/historial`.
- Debe listar movimientos ordenados por fecha.
- Debe mostrar origen, destino y responsable.
- Debe permitir paginación si hay muchos registros.

---

# Módulo Alertas

## BE-ALER-01 — Crear modelo de alertas

**Como** sistema backend,  
**quiero** contar con un modelo de datos para alertas,  
**para** registrar situaciones importantes detectadas automáticamente.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** Modelo de datos inicial

### Criterios de aceptación

- Crear tabla `alertas`.
- Debe incluir tipo, severidad, estado, mensaje y fecha.
- Debe poder asociarse a un animal, corral o lote.
- Debe incluir estado `abierta` o `resuelta`.

---

## BE-ALER-02 — Generar alerta por evento recibido

**Como** sistema backend,  
**quiero** generar alertas a partir de eventos del bus,  
**para** notificar situaciones anormales.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-ALER-01, bus de eventos

### Criterios de aceptación

- El servicio debe consumir eventos relevantes.
- Debe evaluar reglas simples.
- Si se cumple una condición, debe crear una alerta.
- Debe evitar duplicar alertas iguales abiertas.

---

## BE-ALER-03 — Listar alertas con filtros

**Como** usuario del sistema,  
**quiero** listar alertas filtradas por estado y severidad,  
**para** priorizar la atención de problemas.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-ALER-01

### Criterios de aceptación

- Endpoint `GET /api/v1/alertas`.
- Debe permitir filtros por severidad y estado.
- Debe soportar paginación.
- Debe ordenar por fecha descendente.

---

## BE-ALER-04 — Marcar alerta como resuelta

**Como** usuario encargado,  
**quiero** marcar una alerta como resuelta,  
**para** indicar que el problema fue atendido.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-ALER-03

### Criterios de aceptación

- Endpoint `PATCH /api/v1/alertas/{id}/resolver`.
- Debe cambiar estado a `resuelta`.
- Debe guardar fecha de resolución.
- Debe registrar usuario responsable.
- Si la alerta no existe, debe devolver 404.

---

## BE-ALER-05 — Publicar evento `alerta.creada`

**Como** sistema backend,  
**quiero** publicar un evento cuando se crea una alerta,  
**para** permitir notificaciones y actualización del dashboard.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-ALER-02

### Criterios de aceptación

- Debe publicarse evento `alerta.creada`.
- El evento debe incluir `alerta_id`, severidad, tipo y timestamp.
- El evento debe estar disponible para WebSocket y notificaciones.
- Debe registrarse error si falla la publicación.

---

# Módulo Sanitario

## BE-SAN-01 — Registrar evento sanitario

**Como** usuario encargado,  
**quiero** registrar eventos sanitarios de un animal,  
**para** llevar control de enfermedades, vacunas y tratamientos.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** Modelo de animales

### Criterios de aceptación

- Endpoint `POST /api/v1/animales/{id}/eventos-sanitarios`.
- Debe permitir tipo: enfermedad, tratamiento, vacuna o muerte.
- Debe registrar fecha, descripción y estado.
- Debe validar que el animal exista.
- Si el evento es muerte, debe actualizar estado del animal.

---

## BE-SAN-02 — Listar eventos sanitarios

**Como** usuario del sistema,  
**quiero** consultar eventos sanitarios con filtros,  
**para** analizar la situación sanitaria del rodeo.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-SAN-01

### Criterios de aceptación

- Endpoint `GET /api/v1/eventos-sanitarios`.
- Debe permitir filtros por tipo, fecha y estado.
- Debe devolver datos paginados.
- Debe incluir información básica del animal asociado.

---

## BE-SAN-03 — Cerrar tratamiento sanitario

**Como** usuario encargado,  
**quiero** cerrar un tratamiento sanitario,  
**para** indicar que el animal finalizó su atención.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:** BE-SAN-01

### Criterios de aceptación

- Endpoint `PATCH /api/v1/eventos-sanitarios/{id}`.
- Debe permitir cambiar estado a cerrado.
- Debe guardar fecha de cierre.
- Debe validar que el evento sea de tipo tratamiento.

---

## BE-SAN-04 — Obtener estadísticas sanitarias

**Como** usuario administrador,  
**quiero** consultar estadísticas sanitarias generales,  
**para** tomar decisiones sobre el estado del rodeo.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:** BE-SAN-02

### Criterios de aceptación

- Endpoint `GET /api/v1/eventos-sanitarios/stats`.
- Debe devolver cantidad de enfermos.
- Debe devolver tratamientos activos.
- Debe devolver cantidad de muertes del mes.
- Debe permitir filtrar por establecimiento o lote.

---

# Módulo Stock e Insumos

## BE-STOCK-01 — Crear insumo

**Como** usuario administrador,  
**quiero** registrar un nuevo insumo,  
**para** gestionar alimento, medicamentos y vacunas.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:** Modelo de datos inicial

### Criterios de aceptación

- Endpoint `POST /api/v1/stock/insumos`.
- Debe recibir nombre, tipo, unidad de medida y stock mínimo.
- Debe validar datos obligatorios.
- Debe evitar nombres duplicados dentro de la misma empresa.

---

## BE-STOCK-02 — Listar insumos

**Como** usuario del sistema,  
**quiero** consultar los insumos disponibles,  
**para** conocer el inventario registrado.

**Prioridad:** Media  
**Estimación:** 2 hs  
**Dependencias:** BE-STOCK-01

### Criterios de aceptación

- Endpoint `GET /api/v1/stock/insumos`.
- Debe devolver listado paginado.
- Debe permitir filtro por tipo.
- Debe mostrar saldo actual.

---

## BE-STOCK-03 — Registrar movimiento de stock

**Como** usuario encargado,  
**quiero** registrar ingresos, egresos o ajustes de stock,  
**para** mantener actualizado el inventario.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-STOCK-01

### Criterios de aceptación

- Endpoint `POST /api/v1/stock/movimientos`.
- Debe permitir tipo: ingreso, egreso o ajuste.
- Debe actualizar el saldo del insumo.
- No debe permitir egresos mayores al saldo disponible.
- Debe registrar fecha y usuario responsable.

---

## BE-STOCK-04 — Consultar saldos de stock

**Como** usuario del sistema,  
**quiero** consultar los saldos actuales de insumos,  
**para** saber qué recursos están disponibles.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** BE-STOCK-03

### Criterios de aceptación

- Endpoint `GET /api/v1/stock/saldos`.
- Debe mostrar saldo actual por insumo.
- Debe indicar si está por debajo del stock mínimo.
- Debe permitir filtro por tipo de insumo.

---

## BE-STOCK-05 — Generar alerta por stock bajo

**Como** sistema backend,  
**quiero** generar una alerta cuando un insumo esté por debajo del stock mínimo,  
**para** avisar al usuario que debe reponerlo.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:** BE-STOCK-04, BE-ALER-01

### Criterios de aceptación

- El sistema debe comparar saldo actual contra stock mínimo.
- Si el saldo es menor al mínimo, debe crear una alerta.
- Debe evitar duplicar alertas abiertas del mismo insumo.
- Debe publicar evento `alerta.creada`.

---

# 3. Resumen de historias por módulo

| Módulo | Cantidad de historias | Estimación total aproximada |
|---|---:|---:|
| RFID | 5 | 15 hs |
| Trazabilidad | 7 | 24 hs |
| Alertas | 5 | 16 hs |
| Sanitario | 4 | 14 hs |
| Stock/Insumos | 5 | 16 hs |
| **Total** | **26 historias** | **85 hs** |

---

# 4. Priorización sugerida

## Prioridad Alta

1. BE-RFID-01 — Recibir eventos RFID desde antenas.
2. BE-RFID-02 — Validar formato de lectura RFID.
3. BE-RFID-03 — Registrar detección de animal.
4. BE-RFID-04 — Publicar evento `animal.detected`.
5. BE-TRAZ-01 — Crear animal.
6. BE-TRAZ-02 — Listar animales.
7. BE-TRAZ-03 — Consultar detalle.
8. BE-TRAZ-04 — Modificar datos.
9. BE-TRAZ-05 — Baja lógica.
10. BE-TRAZ-06 — Registrar movimiento.
11. BE-TRAZ-07 — Consultar historial.
12. BE-ALER-01 — Crear modelo de alertas.
13. BE-ALER-02 — Generar alerta.
14. BE-ALER-03 — Listar alertas.
15. BE-ALER-04 — Resolver alerta.
16. BE-ALER-05 — Publicar evento `alerta.creada`.
17. BE-SAN-01 — Registrar evento sanitario.
18. BE-SAN-02 — Listar eventos sanitarios.
19. BE-STOCK-03 — Registrar movimiento de stock.
20. BE-STOCK-04 — Consultar saldos.

## Prioridad Media

1. BE-RFID-05 — Simular eventos RFID.
2. BE-SAN-03 — Cerrar tratamiento sanitario.
3. BE-SAN-04 — Obtener estadísticas sanitarias.
4. BE-STOCK-01 — Crear insumo.
5. BE-STOCK-02 — Listar insumos.
6. BE-STOCK-05 — Generar alerta por stock bajo.

---

# 5. Propuesta para repartir tareas en el equipo

## Equipo RFID

- BE-RFID-01
- BE-RFID-02
- BE-RFID-03
- BE-RFID-04
- BE-RFID-05

## Equipo Trazabilidad

- BE-TRAZ-01
- BE-TRAZ-02
- BE-TRAZ-03
- BE-TRAZ-04
- BE-TRAZ-05
- BE-TRAZ-06
- BE-TRAZ-07

## Equipo Alertas

- BE-ALER-01
- BE-ALER-02
- BE-ALER-03
- BE-ALER-04
- BE-ALER-05

## Equipo Sanitario

- BE-SAN-01
- BE-SAN-02
- BE-SAN-03
- BE-SAN-04

## Equipo Stock/Insumos

- BE-STOCK-01
- BE-STOCK-02
- BE-STOCK-03
- BE-STOCK-04
- BE-STOCK-05

---

# 6. Definición de terminado

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

# 7. Resultado esperado de BE-0.5

Al finalizar esta tarea, el equipo backend debe contar con:

- Historias separadas por módulo.
- Historias estimadas entre 2 y 4 horas.
- Priorización inicial.
- Criterios de aceptación claros.
- Base lista para cargar en Trello o herramienta de gestión.
- Material suficiente para refinamiento con el equipo.


---

# 8. Historias pendientes para próximas fases

Estas historias no forman parte obligatoria del alcance inmediato de BE-0.5, pero se dejan registradas para que el equipo pueda refinarlas y cargarlas en Trello en las siguientes fases del backend.

---

# Módulo Cámaras / Ingesta de imágenes

## BE-CAM-01 — Registrar cámaras IP del establecimiento

**Como** usuario administrador,  
**quiero** registrar cámaras IP con su ubicación,  
**para** poder monitorear corrales, comederos y zonas críticas del campo.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** Modelo de datos de establecimientos y corrales

### Criterios de aceptación

- Endpoint `POST /api/v1/hardware/camaras`.
- Debe registrar nombre, ubicación, URL/RTSP, corral asociado y estado.
- Debe validar datos obligatorios.
- Debe permitir marcar una cámara como activa o inactiva.

---

## BE-CAM-02 — Capturar frames desde cámaras IP

**Como** sistema backend,  
**quiero** capturar imágenes desde cámaras IP,  
**para** enviarlas posteriormente al servicio de IA.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-CAM-01

### Criterios de aceptación

- El sistema debe conectarse a una cámara configurada.
- Debe capturar frames en intervalos definidos.
- Debe guardar o referenciar el snapshot generado.
- Si la cámara falla, debe registrar el error.

---

# Módulo IA / Predicción de peso

## BE-IA-01 — Enviar imagen al servicio de predicción de peso

**Como** sistema backend,  
**quiero** enviar una imagen o URL de snapshot al servicio de IA,  
**para** obtener una estimación de peso del animal.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** Servicio IA disponible

### Criterios de aceptación

- Endpoint `POST /api/v1/ai/predict/weight`.
- Debe aceptar imagen o URL de snapshot.
- Debe devolver peso estimado, confianza y metadata.
- Debe registrar la predicción en base de datos.

---

## BE-IA-02 — Guardar historial de predicciones de IA

**Como** sistema backend,  
**quiero** guardar las predicciones realizadas por IA,  
**para** consultar evolución de peso y validar resultados.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:** BE-IA-01, modelo de animales

### Criterios de aceptación

- Debe guardar animal, fecha, peso estimado, confianza y origen de imagen.
- Debe permitir consultar historial por animal.
- Debe diferenciar predicción IA de pesaje manual o balanza.
- Debe manejar errores cuando no se identifique el animal.

---

# Módulo Usuarios, roles y autenticación

## BE-AUTH-01 — Iniciar sesión con JWT

**Como** usuario del sistema,  
**quiero** iniciar sesión con mis credenciales,  
**para** acceder a las funcionalidades según mi rol.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** Modelo de usuarios y roles

### Criterios de aceptación

- Endpoint `POST /auth/login`.
- Debe validar email y contraseña.
- Debe devolver access token.
- Si las credenciales son incorrectas, debe devolver error 401.

---

## BE-AUTH-02 — Proteger endpoints por rol

**Como** sistema backend,  
**quiero** validar permisos antes de ejecutar acciones,  
**para** evitar accesos no autorizados.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:** BE-AUTH-01, roles y permisos

### Criterios de aceptación

- Los endpoints sensibles deben requerir autenticación.
- El sistema debe validar el rol del usuario.
- Un usuario sin permiso debe recibir error 403.
- La validación debe aplicarse de forma reutilizable.

---

# Módulo Dashboard y métricas

## BE-DASH-01 — Consultar métricas principales del dashboard

**Como** usuario administrador o encargado,  
**quiero** consultar métricas generales del establecimiento,  
**para** conocer rápidamente el estado del sistema.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:** Modelos de animales, alertas y clima

### Criterios de aceptación

- Endpoint `GET /api/v1/dashboard/metrics`.
- Debe devolver animales activos.
- Debe devolver alertas activas.
- Debe devolver peso promedio disponible.
- Debe devolver última condición ambiental registrada.

---

## BE-DASH-02 — Emitir métricas en tiempo real por WebSocket

**Como** sistema backend,  
**quiero** enviar actualizaciones en vivo al dashboard,  
**para** que el usuario vea cambios sin recargar la pantalla.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:** Redis Pub/Sub, endpoint de métricas

### Criterios de aceptación

- WebSocket `/ws/dashboard`.
- Debe emitir cambios de alertas, animales y métricas principales.
- Debe manejar reconexión del cliente.
- Debe validar usuario autenticado.

---

# Módulo Reportes

## BE-REP-01 — Generar reporte de evolución de peso

**Como** usuario administrador,  
**quiero** consultar la evolución de peso por animal, lote o corral,  
**para** analizar el rendimiento productivo.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:** Historial de pesajes o predicciones IA

### Criterios de aceptación

- Endpoint `GET /api/v1/reportes/peso-evolucion`.
- Debe permitir filtros por animal, lote, corral y fecha.
- Debe devolver datos aptos para gráficos.
- Debe responder en formato JSON.

---

## BE-REP-02 — Exportar reportes en CSV o Excel

**Como** usuario administrador,  
**quiero** exportar reportes,  
**para** compartir o analizar la información fuera del sistema.

**Prioridad:** Baja  
**Estimación:** 4 hs  
**Dependencias:** BE-REP-01

### Criterios de aceptación

- Endpoint `POST /api/v1/reportes/export`.
- Debe permitir exportar CSV o Excel.
- Debe respetar los filtros seleccionados.
- Debe devolver un archivo descargable o una URL temporal.

---

# 9. Observación final

Las historias principales de BE-0.5 cubren los módulos base de RFID, trazabilidad, alertas, sanitario y stock. Las historias pendientes agregadas en esta sección permiten dejar preparado el crecimiento del sistema hacia cámaras, IA, autenticación, dashboard en tiempo real y reportes, que serán necesarios en fases posteriores.
