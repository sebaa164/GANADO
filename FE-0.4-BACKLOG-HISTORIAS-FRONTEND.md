# [FE-0.4] Backlog de historias de usuario — Frontend

**Proyecto:** Plataforma de Monitoreo Bovino - GanadoVision  
**Tablero:** Frontend  
**Fase:** 0 — Fundamentos  
**Tarjeta:** FE-0.4  

**Objetivo:** Dividir los módulos frontend principales en historias de usuario pequeñas, estimadas entre 2 y 4 horas, para facilitar la planificación del sprint y el reparto de tareas entre desarrolladores frontend.

---

## 1. Criterio general para las historias

Las historias se redactan con el siguiente formato:

**Como** [tipo de usuario], **quiero** [acción o funcionalidad], **para** [beneficio esperado].

Cada historia incluye:
- Código de identificación (ej: FE-DASH-01)
- Módulo
- Prioridad
- Estimación
- Criterios de aceptación
- Dependencias técnicas (componentes, APIs del backend)

---

## 2. Backlog Frontend

### Módulo Dashboard

#### FE-DASH-01 — Mostrar tarjetas de métricas principales

**Como** usuario del sistema, **quiero** ver tarjetas con las métricas principales del ganado, **para** tener una vista rápida del estado general del rodeo.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:** 
- BE-TRAZ-02 (API listado animales)
- BE-ALER-03 (API listado alertas)  
- Componente Card (existente)
- Componente Badge (existente)

**Criterios de aceptación:**
- Tarjeta "Total Animales" con badge de estado
- Tarjeta "Peso Promedio" con indicador de tendencia
- Tarjeta "Alertas Activas" con contador en rojo
- Tarjeta "Temperatura Promedio" con indicador de estado
- Diseño responsive (grid 1-2-4 columnas según dispositivo)
- Colores según tema GanadoVision (#2D6A2D)
- Loading state mientras carga datos
- Manejo de error si falla la API

---

#### FE-DASH-02 — Renderizar gráfico de peso histórico

**Como** usuario del sistema, **quiero** ver un gráfico de línea con el histórico de peso promedio, **para** identificar tendencias de crecimiento del ganado.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:**
- API de historial de peso (pendiente backend)
- Librería de gráficos (Recharts o Chart.js)
- Componente Card (existente)

**Criterios de aceptación:**
- Gráfico de línea responsive
- Selector de rango temporal (7d, 30d, 90d, 1año)
- Tooltips informativos al hacer hover en los puntos
- Leyenda clara con unidades (kg)
- Loading skeleton mientras carga
- Estado vacío si no hay datos
- Manejo de error si falla la consulta

---
#### FE-DASH-03 — Mostrar lista de alertas recientes

**Como** usuario del sistema, **quiero** ver las últimas 5 alertas en el dashboard, **para** estar al tanto de situaciones urgentes sin navegar a otra sección.

**Prioridad:** Alta  
**Estimación:** 2 hs  
**Dependencias:**
- BE-ALER-03 (API listado alertas)
- Componente Badge (existente)

**Criterios de aceptación:**
- Lista de máximo 5 alertas más recientes
- Badge de prioridad con colores (urgente=rojo, advertencia=amarillo, info=azul)
- Timestamp relativo ("hace 5 min", "hace 2 horas")
- Link "Ver todas" que lleva a /alertas
- Estado visual según severidad
- Loading skeleton mientras carga
- Click en alerta abre modal con detalle

---

#### FE-DASH-04 — Botones de acciones rápidas

**Como** usuario del sistema, **quiero** botones de acciones rápidas, **para** acceder directamente a tareas comunes desde el dashboard.

**Prioridad:** Baja  
**Estimación:** 2 hs  
**Dependencias:**
- Componente Button (existente)
- Rutas de navegación

**Criterios de aceptación:**
- Botón "Registrar Animal" que abre modal de creación
- Botón "Ver Reportes" que navega a /reportes
- Botón "Ver Alertas" que navega a /alertas
- Diseño horizontal responsive (stack en móvil)
- Iconos descriptivos en cada botón

---

### Módulo Animales

#### FE-ANIM-01 — Renderizar tabla de listado de animales

**Como** usuario del sistema, **quiero** ver una tabla con todos los animales registrados, **para** consultar información básica del rodeo.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:**
- BE-TRAZ-02 (GET /api/v1/animales)
- Librería de tablas (TanStack Table)
- Componente Badge (existente)

**Criterios de aceptación:**
- Tabla responsive con columnas: RFID, Nombre, Raza, Edad, Peso, Estado
- Paginación (10, 25, 50 por página)
- Ordenamiento por columna (ascendente/descendente)
- Estado visual con badges de colores
- Botones de acción por fila (Ver, Editar, Eliminar)
- Loading skeleton mientras carga
- Estado vacío si no hay animales
- Manejo de error si falla la API

---

#### FE-ANIM-02 — Implementar filtros y búsqueda

**Como** usuario del sistema, **quiero** filtrar y buscar animales, **para** encontrar información específica rápidamente.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:**
- FE-ANIM-01 (tabla de animales)
- BE-TRAZ-02 con parámetros de filtro
- Componente Input (existente)
- Componente Select (a crear)

**Criterios de aceptación:**
- Barra de búsqueda por RFID o nombre
- Filtro por raza (dropdown con opciones)
- Filtro por estado (saludable, alerta, crítico)
- Filtro por rango de edad (min-max)
- Botón "Limpiar filtros" que resetea todo
- Resultados se actualizan al aplicar filtros
- Persistencia de filtros en URL (query params)

---

#### FE-ANIM-03 — Crear modal de registro de animal

**Como** usuario encargado, **quiero** un formulario para registrar un nuevo animal, **para** incorporarlo al sistema de monitoreo.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:**
- BE-TRAZ-01 (POST /api/v1/animales)
- Componente Modal (existente)
- Componente Input (existente)
- React Hook Form + Zod para validación

**Criterios de aceptación:**
- Modal con formulario completo
- Campos: RFID, Nombre, Raza, Fecha nacimiento, Peso inicial, Género, Lote, Corral
- Validación de RFID único
- Validación de campos obligatorios
- Selector de fecha para fecha de nacimiento
- Mensaje de éxito tras crear
- Mensaje de error si falla (RFID duplicado, etc.)
- Botones "Guardar" y "Cancelar"
- Cierra modal y actualiza tabla tras guardar

---

#### FE-ANIM-04 — Crear vista de detalle de animal

**Como** usuario del sistema, **quiero** ver toda la información detallada de un animal, **para** consultar su historial completo.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:**
- BE-TRAZ-03 (GET /api/v1/animales/{id})
- BE-TRAZ-07 (historial de movimientos)
- Librería de gráficos
- Componente Card (existente)

**Criterios de aceptación:**
- Información general (RFID, nombre, raza, edad, peso actual)
- Gráfico de evolución de peso en el tiempo
- Historial de alertas del animal
- Historial de movimientos entre corrales/lotes
- Historial de eventos sanitarios
- Botones "Editar" y "Eliminar"
- Loading state mientras carga
- Breadcrumb para volver al listado

---

#### FE-ANIM-05 — Crear modal de edición de animal

**Como** usuario autorizado, **quiero** editar la información de un animal existente, **para** mantener actualizados sus datos.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:**
- BE-TRAZ-04 (PATCH /api/v1/animales/{id})
- FE-ANIM-03 (reutilizar componente de formulario)

**Criterios de aceptación:**
- Modal con formulario pre-rellenado con datos actuales
- Todos los campos editables excepto RFID
- Validación de cambios
- No permitir duplicar RFID de otro animal
- Confirmación antes de guardar cambios
- Mensaje de éxito/error
- Actualiza vista de detalle tras guardar

---

#### FE-ANIM-06 — Implementar confirmación de baja de animal

**Como** usuario autorizado, **quiero** confirmar la baja de un animal, **para** evitar eliminaciones accidentales.

**Prioridad:** Baja  
**Estimación:** 2 hs  
**Dependencias:**
- BE-TRAZ-05 (DELETE /api/v1/animales/{id})
- Componente Modal (existente)

**Criterios de aceptación:**
- Modal de confirmación con mensaje claro
- Muestra nombre, RFID del animal a dar de baja
- Explicación de que es baja lógica (no se elimina)
- Botones "Cancelar" (gris) y "Dar de baja" (rojo)
- Mensaje de éxito tras completar
- Redirige al listado tras dar de baja
- Animal desaparece del listado activo

---

### Módulo Alertas

#### FE-ALER-01 — Renderizar lista de alertas activas

**Como** usuario del sistema, **quiero** ver todas las alertas activas ordenadas por prioridad, **para** atender primero las más urgentes.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:**
- BE-ALER-03 (GET /api/v1/alertas)
- Componente Badge (existente)
- Componente Card (existente)

**Criterios de aceptación:**
- Lista ordenada por severidad (urgente → advertencia → info)
- Cada alerta muestra: tipo, animal, descripción, timestamp
- Badge de prioridad con colores distintivos
- Botón "Atender" por cada alerta
- Filtro rápido por tipo en la misma vista
- Paginación si hay muchas alertas
- Loading state y manejo de errores

---

#### FE-ALER-02 — Implementar filtros de alertas

**Como** usuario del sistema, **quiero** filtrar alertas por tipo, prioridad y fecha, **para** enfocarme en alertas específicas.

**Prioridad:** Media  
**Estimación:** 2 hs  
**Dependencias:**
- FE-ALER-01 (lista de alertas)
- Componente Select (a crear)

**Criterios de aceptación:**
- Filtro por tipo (temperatura, peso, salud, RFID, sistema)
- Filtro por severidad (urgente, advertencia, info)
- Filtro por fecha (hoy, últimos 7d, último mes, personalizado)
- Contador de alertas por cada filtro
- Botón "Limpiar filtros"
- Los filtros se aplican de forma combinada (AND)

---

#### FE-ALER-03 — Crear modal de detalle de alerta

**Como** usuario del sistema, **quiero** ver el detalle completo de una alerta, **para** entender la situación y decidir la acción.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:**
- BE-ALER-03 (detalle de alerta)
- BE-ALER-04 (resolver alerta)
- Componente Modal (existente)

**Criterios de aceptación:**
- Modal con información completa de la alerta
- Datos del animal afectado (con link a su detalle)
- Timestamp exacto de generación
- Valor o evento que disparó la alerta
- Acciones sugeridas según tipo de alerta
- Botones "Marcar como resuelta" e "Ignorar"
- Campo opcional para agregar notas
- Actualiza lista tras resolver

---

#### FE-ALER-04 — Mostrar historial de alertas resueltas

**Como** usuario del sistema, **quiero** ver el historial de alertas ya atendidas, **para** hacer seguimiento y auditoría.

**Prioridad:** Baja  
**Estimación:** 2 hs  
**Dependencias:**
- BE-ALER-03 con filtro estado=resuelta
- Componente Table reutilizable

**Criterios de aceptación:**
- Tabla con alertas resueltas
- Columnas: tipo, animal, fecha generación, fecha resolución, resuelto por, acción tomada
- Paginación
- Filtro por tipo y rango de fechas
- No permite editar alertas resueltas
- Búsqueda por animal

---

### Módulo Reportes

#### FE-REP-01 — Crear selector de tipo de reporte

**Como** usuario del sistema, **quiero** seleccionar el tipo de reporte a generar, **para** obtener la información que necesito.

**Prioridad:** Alta  
**Estimación:** 2 hs  
**Dependencias:**
- Componente Card (existente)

**Criterios de aceptación:**
- Cards con tipos de reportes disponibles
- Tipos: Peso, Salud, Alertas, Inventario/Stock, Movimientos
- Descripción breve de cada reporte
- Icono representativo para cada tipo
- Click en card navega a configuración de ese reporte
- Diseño responsive (grid)

---

#### FE-REP-02 — Implementar formulario de configuración de reporte

**Como** usuario del sistema, **quiero** configurar los parámetros del reporte, **para** obtener exactamente la información que necesito.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:**
- API de reportes (pendiente backend)
- Date picker library (date-fns + componente)
- Multi-select component

**Criterios de aceptación:**
- Selector de rango de fechas (inicio y fin)
- Selector de animales (individual, por lote, por corral, todos)
- Selector de métricas a incluir (checkboxes)
- Selector de formato (PDF, Excel, CSV)
- Vista previa de cantidad de registros
- Botón "Generar Reporte"
- Validación de fechas (fin > inicio)
- Loading state durante generación

---

#### FE-REP-03 — Renderizar vista previa de reporte

**Como** usuario del sistema, **quiero** ver una vista previa del reporte, **para** verificar que contiene la información correcta antes de descargarlo.

**Prioridad:** Media  
**Estimación:** 4 hs  
**Dependencias:**
- FE-REP-02 (config de reporte)
- API de generación de reporte
- Librería de gráficos

**Criterios de aceptación:**
- Visualización del reporte completo en pantalla
- Gráficos y tablas renderizados
- Información de cabecera (título, fecha, rango, usuario)
- Botones "Descargar PDF", "Descargar Excel", "Modificar configuración"
- Loading state mientras genera
- Diseño compatible con impresión
- Manejo de reportes grandes (paginado virtual)

---

#### FE-REP-04 — Mostrar historial de reportes generados

**Como** usuario del sistema, **quiero** ver el historial de reportes generados, **para** re-descargarlos sin generarlos nuevamente.

**Prioridad:** Baja  
**Estimación:** 3 hs  
**Dependencias:**
- API de historial de reportes (pendiente backend)
- Componente Table

**Criterios de aceptación:**
- Tabla con reportes generados anteriormente
- Columnas: tipo, fecha generación, rango de datos, generado por, formato
- Botón "Descargar" por cada reporte
- Filtro por tipo de reporte
- Filtro por rango de fechas
- Paginación
- Indicador si el reporte todavía está disponible

---

### Módulo Monitoreo Visual

#### FE-MON-01 — Renderizar grid de cámaras en vivo

**Como** usuario del sistema, **quiero** ver múltiples feeds de cámaras en un grid, **para** monitorear varias zonas simultáneamente.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:**
- API de feeds de cámaras (pendiente backend)
- React Player o similar
- WebSocket para actualizaciones en tiempo real

**Criterios de aceptación:**
- Grid responsive (1, 4, 6 o 9 cámaras según tamaño de pantalla)
- Cada cámara muestra: nombre, ubicación, estado (online/offline)
- Click en cámara abre vista fullscreen
- Indicador visual de cámara online/offline
- Auto-refresh del feed cada X segundos
- Loading state por cámara
- Manejo de error si cámara no responde

---

#### FE-MON-02 — Implementar vista individual de cámara

**Como** usuario del sistema, **quiero** ver una cámara en pantalla completa con controles, **para** analizar detalles del feed.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:**
- FE-MON-01 (grid de cámaras)
- Librería de video player

**Criterios de aceptación:**
- Vista fullscreen del feed de cámara
- Controles: zoom digital, captura de imagen, grabación
- Información de cámara (nombre, ubicación, timestamp del feed)
- Botón "Volver al grid"
- Indicador de calidad de señal (buena/media/baja)
- Indicador de latencia del feed
- Botón para recargar feed si hay problemas

---

#### FE-MON-03 — Crear selector de ubicación/zona

**Como** usuario del sistema, **quiero** filtrar cámaras por ubicación o zona, **para** enfocarme en áreas específicas del rancho.

**Prioridad:** Media  
**Estimación:** 2 hs  
**Dependencias:**
- FE-MON-01 (grid de cámaras)
- Componente Select

**Criterios de aceptación:**
- Dropdown con zonas disponibles (Corral A, Corral B, Galpón, etc.)
- Filtro muestra solo cámaras de la zona seleccionada
- Indicador de cantidad de cámaras por zona
- Opción "Todas las zonas" para ver todo
- Contador de cámaras online/offline por zona

---

#### FE-MON-04 — Implementar alertas de detección visual

**Como** usuario del sistema, **quiero** ver notificaciones cuando se detecta movimiento inusual, **para** responder rápidamente a eventos.

**Prioridad:** Baja  
**Estimación:** 3 hs  
**Dependencias:**
- WebSocket para notificaciones en tiempo real
- Sistema de notificaciones (toast/banner)

**Criterios de aceptación:**
- Banner de alerta sobre el feed cuando se detecta evento
- Timestamp de detección
- Tipo de evento detectado (movimiento, animal fuera de zona, etc.)
- Botón "Ver grabación" si está disponible
- Auto-dismiss después de 10 segundos
- Sonido de notificación (opcional, configurable)
- Log de eventos detectados

---

### Módulo Usuarios y Roles

#### FE-USR-01 — Renderizar tabla de usuarios

**Como** administrador, **quiero** ver todos los usuarios del sistema, **para** gestionar accesos y roles.

**Prioridad:** Alta  
**Estimación:** 3 hs  
**Dependencias:**
- API de usuarios (pendiente backend)
- Componente Table
- Componente Badge

**Criterios de aceptación:**
- Tabla con columnas: nombre, email, rol, estado, última conexión
- Badge de estado (activo/inactivo) con colores
- Badge de rol con colores distintivos
- Acciones por fila: Editar, Activar/Desactivar
- Botón "Nuevo Usuario" en header
- Paginación
- Búsqueda por nombre o email
- No permite eliminar al propio usuario

---

#### FE-USR-02 — Crear modal de registro de usuario

**Como** administrador, **quiero** crear un nuevo usuario y asignarle un rol, **para** dar acceso al sistema.

**Prioridad:** Alta  
**Estimación:** 4 hs  
**Dependencias:**
- API de creación de usuario (pendiente backend)
- Componente Modal
- React Hook Form + Zod

**Criterios de aceptación:**
- Formulario con: nombre, apellido, email, contraseña, confirmar contraseña, rol
- Validación de email único
- Validación de contraseña segura (mín 8 chars, mayúscula, número, símbolo)
- Selector de rol (Admin, Supervisor, Operador, Visualizador)
- Checkbox "Enviar email de bienvenida"
- Mensaje de éxito con credenciales generadas
- Mensaje de error si email ya existe

---

#### FE-USR-03 — Crear modal de edición de usuario

**Como** administrador, **quiero** editar información de un usuario, **para** mantener actualizados sus datos y rol.

**Prioridad:** Media  
**Estimación:** 3 hs  
**Dependencias:**
- API de edición de usuario
- FE-USR-02 (reutilizar formulario)

**Criterios de aceptación:**
- Formulario pre-rellenado con datos actuales
- Permitir cambiar nombre, apellido, email, rol
- Botón "Resetear contraseña" (envía email al usuario)
- No permite que un admin cambie su propio rol
- No permite cambiar email si ya existe en otro usuario
- Mensaje de confirmación antes de guardar
- Actualiza tabla tras guardar

---

#### FE-USR-04 — Implementar gestión de roles y permisos

**Como** administrador, **quiero** configurar permisos específicos para cada rol, **para** controlar el acceso a funcionalidades.

**Prioridad:** Baja  
**Estimación:** 4 hs  
**Dependencias:**
- API de roles y permisos (pendiente backend)

**Criterios de aceptación:**
- Lista de roles del sistema
- Matriz de permisos por módulo
- Checkboxes para activar/desactivar permisos
- Permisos por módulo: Dashboard, Animales, Alertas, Reportes, Monitoreo, Usuarios
- Acciones por permiso: Ver, Crear, Editar, Eliminar
- Botón "Guardar cambios" con confirmación
- Visualización clara de qué permisos tiene cada rol
- No permite modificar rol "Admin" (siempre tiene todos los permisos)

---

#### FE-USR-05 — Mostrar log de actividad de usuarios

**Como** administrador, **quiero** ver el registro de actividades de los usuarios, **para** auditoría y seguridad.

**Prioridad:** Baja  
**Estimación:** 2 hs  
**Dependencias:**
- API de log de actividad (pendiente backend)
- Componente Table

**Criterios de aceptación:**
- Tabla con: usuario, acción, módulo, timestamp, dirección IP
- Filtro por usuario (dropdown con todos los usuarios)
- Filtro por rango de fechas
- Filtro por módulo
- Paginación (50 registros por página)
- Botón "Exportar a CSV"
- Búsqueda por acción específica

---

## 3. Resumen de historias por módulo

| Módulo | Cantidad de historias | Estimación total |
|--------|----------------------|------------------|
| Dashboard | 4 | 11 hs |
| Animales | 6 | 20 hs |
| Alertas | 4 | 10 hs |
| Reportes | 4 | 13 hs |
| Monitoreo Visual | 4 | 12 hs |
| Usuarios/Roles | 5 | 16 hs |
| **TOTAL** | **27 historias** | **82 hs** |

---

## 4. Priorización sugerida

### Prioridad Alta (12 historias - 39 horas)
1. FE-DASH-01 — Tarjetas de métricas
2. FE-DASH-03 — Alertas recientes
3. FE-ANIM-01 — Tabla de animales
4. FE-ANIM-02 — Filtros y búsqueda
5. FE-ANIM-03 — Modal de creación
6. FE-ALER-01 — Lista de alertas activas
7. FE-ALER-03 — Modal de detalle de alerta
8. FE-REP-01 — Selector de tipo de reporte
9. FE-REP-02 — Configuración de reporte
10. FE-MON-01 — Grid de cámaras
11. FE-USR-01 — Tabla de usuarios
12. FE-USR-02 — Creación de usuario

### Prioridad Media (8 historias - 26 horas)
13. FE-DASH-02 — Gráfico de peso
14. FE-ANIM-04 — Vista detalle animal
15. FE-ANIM-05 — Edición de animal
16. FE-ALER-02 — Filtros de alertas
17. FE-REP-03 — Vista previa de reporte
18. FE-MON-02 — Vista individual de cámara
19. FE-MON-03 — Selector de zona
20. FE-USR-03 — Edición de usuario

### Prioridad Baja (7 historias - 17 horas)
21. FE-DASH-04 — Acciones rápidas
22. FE-ANIM-06 — Confirmación de baja
23. FE-ALER-04 — Historial de alertas
24. FE-REP-04 — Historial de reportes
25. FE-MON-04 — Alertas de detección
26. FE-USR-04 — Gestión de permisos
27. FE-USR-05 — Log de actividad

---

## 5. Propuesta para repartir tareas en el equipo

### Equipo Dashboard + Alertas
- FE-DASH-01, FE-DASH-02, FE-DASH-03, FE-DASH-04
- FE-ALER-01, FE-ALER-02, FE-ALER-03, FE-ALER-04

**Estimación:** 21 hs

### Equipo Animales
- FE-ANIM-01, FE-ANIM-02, FE-ANIM-03
- FE-ANIM-04, FE-ANIM-05, FE-ANIM-06

**Estimación:** 20 hs

### Equipo Reportes + Monitoreo
- FE-REP-01, FE-REP-02, FE-REP-03, FE-REP-04
- FE-MON-01, FE-MON-02, FE-MON-03, FE-MON-04

**Estimación:** 25 hs

### Equipo Usuarios/Seguridad
- FE-USR-01, FE-USR-02, FE-USR-03
- FE-USR-04, FE-USR-05

**Estimación:** 16 hs

---

## 6. Dependencias con el Backend

### APIs requeridas del backend:

#### Alta prioridad (necesarias para historias prioritarias):
- `GET /api/v1/animales` - BE-TRAZ-02
- `POST /api/v1/animales` - BE-TRAZ-01
- `GET /api/v1/animales/{id}` - BE-TRAZ-03
- `PATCH /api/v1/animales/{id}` - BE-TRAZ-04
- `DELETE /api/v1/animales/{id}` - BE-TRAZ-05
- `GET /api/v1/alertas` - BE-ALER-03
- `PATCH /api/v1/alertas/{id}/resolver` - BE-ALER-04

#### Media prioridad:
- `GET /api/v1/animales/{id}/historial` - BE-TRAZ-07
- API de historial de peso (pendiente definir)
- API de reportes (pendiente definir)
- API de usuarios y roles (pendiente definir)

#### Baja prioridad:
- API de feeds de cámaras (pendiente definir)
- WebSocket para notificaciones en tiempo real
- API de log de actividad (pendiente definir)

---

## 7. Componentes UI base requeridos

### Ya implementados ✅:
- Button
- Input
- Card
- Badge
- Modal
- Layout (MainLayout, Navbar, Sidebar)

### Por implementar:
- **Table** con paginación y ordenamiento (usado en múltiples historias)
- **Select/Dropdown** (filtros)
- **DatePicker** (selección de rangos de fechas)
- **MultiSelect** (selección múltiple)
- **Toast/Notification** (mensajes de éxito/error)
- **Skeleton** (loading states)

---

## 8. Definición de terminado

Una historia se considera terminada cuando:

1. **Componente implementado** con TypeScript estricto
2. **Story en Storybook** con al menos 3 variantes
3. **Responsive** en móvil (< 768px), tablet (768-1024px) y desktop (>1024px)
4. **Integración con API mock** funcionando
5. **Loading states** implementados
6. **Error handling** implementado (errores de red, validación, etc.)
7. **Tests unitarios básicos** con Vitest (opcional pero recomendado)
8. **Accesibilidad básica:** ARIA labels, navegación por teclado en formularios
9. **Sin errores de linting** (ESLint + Prettier)
10. **Code review aprobado** por al menos un compañero
11. **Funciona en el navegador** sin errores de consola
12. **Documentación** en comentarios de código para lógica compleja

---

## 9. Stack técnico definido

### Core:
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 4

### Librerías:
- **State management:** Zustand (ya instalado)
- **Data fetching:** TanStack Query (React Query) - ya instalado
- **HTTP client:** Axios - ya instalado
- **Formularios:** React Hook Form + Zod
- **Tablas:** TanStack Table (React Table)
- **Gráficos:** Recharts
- **Fechas:** date-fns
- **Video:** React Player
- **Iconos:** SVG inline (ya implementado)

### Dev tools:
- **Component dev:** Storybook 10
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint + Prettier
- **Git hooks:** Husky + lint-staged

---

## 10. Resultado esperado de FE-0.4

Al finalizar esta tarea, el equipo frontend debe contar con:

✅ **27 historias** separadas por módulo  
✅ Historias **estimadas entre 2 y 4 horas**  
✅ **Priorización inicial** (Alta, Media, Baja)  
✅ **Criterios de aceptación** claros y verificables  
✅ **Dependencias con backend** identificadas  
✅ **Dependencias entre componentes** frontend identificadas  
✅ **División en equipos** sugerida  
✅ **Definición de "Done"** específica para frontend  
✅ Base lista para **cargar en Trello** o herramienta de gestión  
✅ Material suficiente para **refinamiento** con el equipo

---

**Fecha de creación:** 02 de Junio de 2026  
**Versión:** 1.0  
**Autor:** Equipo GanadoVision
