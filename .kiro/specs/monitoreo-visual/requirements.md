# Requirements Document

## Introduction

El Módulo de Monitoreo Visual (FE-2.1) provee una página dedicada (`/monitoreo-visual`) dentro de GanadoVision para que los usuarios puedan observar en tiempo real los feeds de cámaras IP instaladas en los distintos sectores del rancho. El módulo ofrece una grilla configurable de streams (HLS o WebRTC), selector de ubicación, modo pantalla completa por cámara, indicadores de estado (online/offline), notificaciones flotantes para alertas críticas, y soporte para overlay de detecciones IA (opcional, preparado para Fase 4). Se integra con el MainLayout existente, el sistema de autenticación (AuthGuard), el cliente Axios (`src/lib/axios.ts`) y el store de Zustand para estado global.

---

## Glossary

- **MonitoreoVisual_Page**: La página Next.js ubicada en `/monitoreo-visual` que contiene el módulo completo de monitoreo.
- **Camera_Grid**: El componente que renderiza la grilla de feeds de cámaras en disposición 2×2 o 3×3.
- **Camera_Cell**: La celda individual dentro de la grilla que aloja el reproductor de un feed de cámara.
- **Video_Player**: El componente encargado de reproducir un stream HLS o WebRTC dentro de una Camera_Cell.
- **Location_Selector**: El componente de selección (dropdown) que permite filtrar las cámaras por zona o corral.
- **Fullscreen_View**: La vista de pantalla completa activada al expandir una Camera_Cell específica.
- **Offline_Indicator**: El elemento visual dentro de la Camera_Cell que señala que una cámara no está transmitiendo.
- **Alert_Notification**: El componente de notificación flotante (toast) que muestra alertas críticas relacionadas con el monitoreo visual.
- **AI_Overlay**: El componente SVG/Canvas superpuesto sobre el Video_Player para dibujar bounding boxes de detecciones IA (preparado para Fase 4).
- **Detection_Event**: Un evento generado por el sistema de IA que incluye coordenadas normalizadas en rango [0.0, 1.0], tipo de detección, porcentaje de confianza (0–100) y timestamp.
- **Camera_Feed**: La fuente de video de una cámara IP, representada por una URL de stream HLS o una señal WebRTC.
- **Zone**: Una ubicación física del rancho (corral, zona de alimentación, galpón, etc.) a la que pueden estar asociadas una o más cámaras.
- **Stream_Status**: El estado de conexión de un Camera_Feed: `online`, `offline` o `loading`.

---

## Requirements

### Requirement 1: Página de Monitoreo Visual

**User Story:** Como usuario del sistema, quiero acceder a la página `/monitoreo-visual`, para ver el módulo de monitoreo de cámaras integrado en el layout principal de la aplicación.

#### Acceptance Criteria

1. WHEN un usuario autenticado navega a `/monitoreo-visual`, THEN THE MonitoreoVisual_Page SHALL renderizarse utilizando el App Router de Next.js dentro del componente `MainLayout`.
2. THE MonitoreoVisual_Page SHALL envolver su contenido en el componente `AuthGuard` para proteger el acceso a usuarios no autenticados.
3. WHEN un usuario no autenticado accede a `/monitoreo-visual`, THEN THE sistema SHALL redirigirlo a `/login?from=/monitoreo-visual` para que pueda volver tras autenticarse.
4. WHEN el usuario autenticado llega a la página, THEN THE MonitoreoVisual_Page SHALL mostrar el encabezado "Monitoreo Visual" y la Camera_Grid como contenido principal visible.
5. THE MonitoreoVisual_Page SHALL completar su renderizado inicial en menos de 3 segundos bajo condiciones de red normales.

---

### Requirement 2: Grilla de Cámaras

**User Story:** Como usuario del sistema, quiero ver una grilla de feeds de cámaras en vivo, para monitorear múltiples zonas simultáneamente en una sola vista.

#### Acceptance Criteria

1. WHEN la MonitoreoVisual_Page carga por primera vez, THE Camera_Grid SHALL renderizar en disposición 2×2 (4 celdas) por defecto.
2. WHEN el usuario selecciona la disposición 3×3, THE Camera_Grid SHALL renderizar hasta 9 Camera_Cell simultáneamente.
3. THE Camera_Grid SHALL distribuir las Camera_Cell de forma equitativa: cada celda tendrá el mismo ancho y la misma altura, calculados a partir del espacio disponible dividido entre el número de columnas y filas de la disposición activa.
4. WHEN la lista de Camera_Feed devuelta por la API contiene menos celdas que la disposición activa, THE Camera_Grid SHALL mostrar celdas vacías con fondo neutro para completar la grilla.
5. IF el viewport tiene un ancho menor a 768 px, THEN THE Camera_Grid SHALL colapsar a una disposición de una columna mostrando las celdas en lista vertical.
6. WHEN la API de cámaras retorna un error, THEN THE Camera_Grid SHALL reemplazar su contenido con un mensaje de error descriptivo y un botón "Reintentar" visible.
7. WHEN la API de cámaras está siendo consultada, THEN THE Camera_Grid SHALL mostrar un estado de carga (skeleton o spinner) en lugar del contenido.
8. WHEN el usuario hace clic en "Reintentar", THEN THE Camera_Grid SHALL volver a consultar la API de cámaras.

---

### Requirement 3: Reproductor de Stream por Cámara

**User Story:** Como usuario del sistema, quiero que cada celda de la grilla reproduzca el feed en vivo de su cámara asignada, para ver lo que está ocurriendo en cada zona.

#### Acceptance Criteria

1. IF el navegador no soporta HLS nativo y el Camera_Feed provee una URL HLS, THEN THE Video_Player SHALL reproducir el stream utilizando la librería `hls.js`.
2. WHERE el Camera_Feed provee una URL WebRTC, THE Video_Player SHALL conectarse al stream utilizando la API WebRTC del navegador.
3. WHEN el Video_Player está cargando el stream, THE Camera_Cell SHALL mostrar un skeleton loader animado; IF el stream no conecta dentro de 30 segundos, THEN THE Camera_Cell SHALL transicionar al estado de error.
4. WHEN el Video_Player monta el componente, THE Video_Player SHALL iniciar la reproducción en modo silenciado (`muted`) y con reproducción automática (`autoplay`).
5. WHEN el stream falla o se interrumpe, THEN THE Video_Player SHALL intentar reconectar automáticamente hasta 3 veces con intervalos de 5 segundos entre intentos.
6. WHEN los 3 intentos de reconexión fallan, THEN THE Video_Player SHALL actualizar el Stream_Status de la Camera_Cell a `offline` y mostrar el Offline_Indicator.
7. IF el stream nunca establece conexión durante la carga inicial y se agota el timeout de 30 segundos, THEN THE Camera_Cell SHALL mostrar el Offline_Indicator con el mensaje "Sin señal".

---

### Requirement 4: Selector de Ubicación

**User Story:** Como usuario del sistema, quiero filtrar las cámaras por zona o corral, para enfocarme en áreas específicas del rancho sin ver todas las cámaras a la vez.

#### Acceptance Criteria

1. WHEN la MonitoreoVisual_Page carga, THE Location_Selector SHALL obtener la lista de Zone disponibles desde el endpoint `GET /api/v1/zonas` y mostrar un indicador de carga mientras la solicitud está en curso.
2. THE Location_Selector SHALL incluir la opción "Todas las zonas" seleccionada por defecto tras la carga inicial.
3. WHEN el usuario selecciona una Zone, THE Camera_Grid SHALL mostrar únicamente los Camera_Cell cuyo identificador de zona coincida con el de la Zone seleccionada; IF no hay cámaras en esa Zone, THEN THE Camera_Grid SHALL mostrar un mensaje "No hay cámaras en esta zona".
4. WHEN el usuario selecciona "Todas las zonas", THE Camera_Grid SHALL mostrar todos los Camera_Cell registrados independientemente de su Stream_Status.
5. WHEN la lista de zonas se carga correctamente, THE Location_Selector SHALL mostrar junto a cada Zone el conteo de cámaras en formato "N online / M offline", donde N y M son enteros ≥ 0.
6. IF la API de zonas retorna un error y existe una carga previa exitosa, THEN THE Location_Selector SHALL conservar las opciones cargadas previamente.
7. IF la API de zonas retorna un error y no existe carga previa, THEN THE Location_Selector SHALL mostrar únicamente la opción "Todas las zonas" junto con un mensaje de error descriptivo.

---

### Requirement 5: Modo Pantalla Completa

**User Story:** Como usuario del sistema, quiero expandir una cámara a pantalla completa, para analizar el feed con mayor detalle.

#### Acceptance Criteria

1. WHEN el usuario hace clic en el botón de expansión de una Camera_Cell, THE Fullscreen_View SHALL activarse mostrando el Video_Player de esa cámara ocupando el 100% del viewport; solo una Fullscreen_View puede estar activa a la vez.
2. WHILE la Fullscreen_View está activa, THE Fullscreen_View SHALL mostrar de forma permanente una barra de información con altura máxima de 48 px que contenga el nombre y la Zone de la cámara.
3. WHILE la Fullscreen_View está activa, THE Fullscreen_View SHALL actualizar el timestamp del stream con una frecuencia de 1 segundo.
4. WHEN el usuario presiona la tecla `Escape` o hace clic en el botón "Cerrar", THE Fullscreen_View SHALL cerrarse y devolver el foco al botón de expansión de la Camera_Cell que la originó.
5. WHILE la Fullscreen_View está activa, THE Camera_Grid SHALL detener la recepción de datos de stream en segundo plano para reducir el consumo de ancho de banda.
6. WHILE la Fullscreen_View está activa, THE foco del teclado SHALL quedar atrapado dentro de la Fullscreen_View (focus trap), impidiendo que el Tab alcance elementos fuera de ella.
7. THE botón de expansión de cada Camera_Cell SHALL ser activable mediante la tecla `Enter` cuando tiene el foco del teclado.

---

### Requirement 6: Indicador de Cámara Offline

**User Story:** Como usuario del sistema, quiero identificar visualmente qué cámaras están sin señal, para saber de inmediato cuáles zonas no tienen cobertura activa.

#### Acceptance Criteria

1. WHEN el Stream_Status de una Camera_Cell es `offline`, THE Offline_Indicator SHALL superponerse sobre la Camera_Cell con fondo de color negro con opacidad del 70% y el texto "Sin señal".
2. THE Offline_Indicator SHALL mostrar un ícono de cámara con una línea diagonal en color rojo (`#EF4444`).
3. WHEN el Offline_Indicator se muestra, THE Offline_Indicator SHALL mostrar el timestamp del último momento en que el stream estuvo activo en formato `DD/MM/YYYY HH:mm`; IF no existe registro previo de actividad, THEN THE Offline_Indicator SHALL mostrar el texto "Sin actividad registrada".
4. WHEN el Stream_Status de una Camera_Cell cambia de `offline` a `online`, THE Offline_Indicator SHALL desaparecer del DOM.
5. WHEN el Stream_Status de una Camera_Cell cambia de `offline` a `online`, THE Video_Player SHALL reanudar la reproducción del stream automáticamente; IF la reanudación falla, THEN THE Camera_Cell SHALL volver a mostrar el Offline_Indicator.
6. WHEN el conjunto de Camera_Cell visible cambia o alguna Camera_Cell actualiza su Stream_Status, THE encabezado de la Camera_Grid SHALL mostrar un contador con el formato "N cámaras sin señal", donde N es el total de Camera_Cell con Stream_Status `offline` actualmente visibles.

---

### Requirement 7: Notificaciones Flotantes de Alertas Críticas

**User Story:** Como usuario del sistema, quiero recibir notificaciones flotantes cuando ocurran alertas críticas, para poder reaccionar de inmediato sin abandonar la vista de monitoreo.

#### Acceptance Criteria

1. WHEN el sistema recibe una alerta crítica a través del canal de notificaciones en tiempo real, THE Alert_Notification SHALL aparecer en la esquina superior derecha de la pantalla con animación de entrada.
2. THE Alert_Notification SHALL mostrar: tipo de alerta, nombre de la cámara o zona afectada, descripción breve del evento (máximo 120 caracteres), y timestamp en formato `HH:mm:ss`.
3. THE Alert_Notification SHALL utilizar el componente `Badge` existente con la variante `alerta` (fondo rojo) para severidad urgente y con la variante correspondiente a advertencia (fondo amarillo) para severidad de advertencia.
4. WHEN una Alert_Notification lleva 10 segundos visible sin que el usuario interactúe con ella, THE Alert_Notification SHALL desaparecer con animación de salida; cada notificación tiene su propio temporizador independiente.
5. WHEN el usuario hace clic en una Alert_Notification, THE Alert_Notification SHALL detener su temporizador y permanecer visible, y THE Camera_Cell correspondiente SHALL mostrar un borde resaltado de color rojo durante 5 segundos.
6. THE MonitoreoVisual_Page SHALL mostrar como máximo 3 Alert_Notification simultáneamente, apiladas verticalmente con la más reciente en la parte superior.
7. IF llega una nueva alerta cuando ya hay 3 Alert_Notification visibles, THEN THE nueva alerta SHALL incorporarse a una cola interna y THE MonitoreoVisual_Page SHALL mostrar un indicador "N más alertas" debajo de las 3 visibles, donde N es el tamaño actual de la cola.
8. WHEN una Alert_Notification visible se descarta (por timeout o clic), THE siguiente alerta en la cola SHALL promoverse a visible si existe.

---

### Requirement 8: Overlay de Detecciones IA (Preparado para Fase 4)

**User Story:** Como usuario del sistema, quiero que el módulo sea capaz de mostrar bounding boxes de detecciones IA sobre el feed de cada cámara, para identificar visualmente animales o eventos detectados por el sistema.

#### Acceptance Criteria

1. THE Camera_Cell SHALL renderizar el AI_Overlay como una capa SVG/Canvas transparente superpuesta al Video_Player con exactamente el mismo ancho y alto que el Video_Player.
2. IF el AI_Overlay no tiene Detection_Event activos, THEN THE AI_Overlay SHALL ser completamente transparente sin elementos visuales adicionales.
3. WHEN el AI_Overlay recibe uno o más Detection_Event, THE AI_Overlay SHALL dibujar un rectángulo delimitador (bounding box) en color verde para cada detección, escalando las coordenadas normalizadas en rango [0.0, 1.0] al tamaño de píxeles actual del Video_Player; se renderizarán como máximo 20 bounding boxes simultáneos.
4. WHEN el AI_Overlay dibuja un bounding box, THE AI_Overlay SHALL mostrar una etiqueta sobre el bounding box con el tipo de detección y el porcentaje de confianza en formato "Tipo NN%".
5. WHEN un Detection_Event supera su tiempo de vida (TTL definido en el evento), THE AI_Overlay SHALL eliminar el bounding box correspondiente sin re-renderizar el Video_Player.
6. WHERE la funcionalidad de AI_Overlay está deshabilitada mediante feature flag de configuración, THE Camera_Cell SHALL ocultar el AI_Overlay completamente sin afectar la reproducción del Video_Player.
7. WHEN el AI_Overlay recibe un nuevo Detection_Event, THE AI_Overlay SHALL actualizar únicamente los bounding boxes sin re-renderizar el Video_Player.

---

### Requirement 9: Selector de Disposición de Grilla

**User Story:** Como usuario del sistema, quiero cambiar entre disposición 2×2 y 3×3 de la grilla, para adaptar la cantidad de cámaras visibles según mi necesidad.

#### Acceptance Criteria

1. THE MonitoreoVisual_Page SHALL mostrar un control de selección de disposición con las opciones "2×2" y "3×3", y la opción activa SHALL estar visualmente diferenciada (ej. fondo destacado o borde activo).
2. WHEN el usuario selecciona una disposición, THE Camera_Grid SHALL reorganizarse a la nueva disposición en menos de 500 ms sin interrumpir ni reiniciar los streams activos.
3. WHEN la nueva disposición tiene más celdas que Camera_Feed disponibles, THE Camera_Grid SHALL rellenar las celdas sobrantes como celdas vacías.
4. WHEN la nueva disposición tiene menos celdas que la disposición anterior, THE Camera_Grid SHALL ocultar las Camera_Cell que exceden el nuevo límite y suspender sus streams; los streams de las celdas que permanecen visibles no se verán interrumpidos.
5. WHEN el usuario selecciona una disposición, THE MonitoreoVisual_Page SHALL persistir la selección en el store de Zustand; la disposición persistida se mantendrá hasta que el usuario la cambie o cierre la pestaña del navegador.
6. WHEN la MonitoreoVisual_Page carga y no existe una disposición persistida en el store de Zustand, THE Camera_Grid SHALL usar la disposición 2×2 por defecto.

---

### Requirement 10: Accesibilidad e Internacionalización

**User Story:** Como usuario del sistema, quiero que el módulo de monitoreo sea accesible y utilice el español como idioma de la interfaz, para asegurar una experiencia consistente con el resto de la plataforma.

#### Acceptance Criteria

1. THE MonitoreoVisual_Page SHALL usar el español como idioma en todos los textos visibles de la interfaz, incluyendo etiquetas, mensajes de error, estados vacíos, botones y notificaciones.
2. THE Camera_Cell SHALL incluir un atributo `aria-label` con el formato "Cámara [nombre] - [zone] - [estado]", donde [estado] es uno de: "en línea", "sin señal" o "cargando", correspondiente a los valores de Stream_Status `online`, `offline` y `loading` respectivamente.
3. THE Location_Selector SHALL incluir un atributo `aria-label` con el texto "Seleccionar zona de monitoreo".
4. WHILE la Fullscreen_View está activa, THE foco del teclado SHALL quedar restringido a los elementos interactivos dentro de la Fullscreen_View.
5. WHEN la Fullscreen_View se cierra, THE foco SHALL regresar al botón de expansión que activó la vista.
6. THE Alert_Notification SHALL incluir `role="alert"` y `aria-live="assertive"` para que los lectores de pantalla anuncien las notificaciones de forma inmediata al aparecer.
