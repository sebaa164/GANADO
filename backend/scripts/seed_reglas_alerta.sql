INSERT INTO reglas_alerta (nombre, tipo_evento, condicion, severidad, canal, mensaje, activa)
VALUES
(
  'peso_bajo',
  'peso.actualizado',
  '{"campo":"peso_kg","op":"<","valor":280}'::jsonb,
  'alta',
  'dashboard',
  'Animal {animal_id} con peso bajo: {peso_kg} kg',
  true
),
(
  'consumo_bajo',
  'consumo.actualizado',
  '{"campo":"consumo_porcentaje","op":"<","valor":70}'::jsonb,
  'media',
  'dashboard',
  'Animal {animal_id} con consumo bajo: {consumo_porcentaje}%',
  true
),
(
  'temperatura_corral_alta',
  'ambiente.actualizado',
  '{"campo":"temperatura_corral","op":">","valor":35}'::jsonb,
  'alta',
  'dashboard',
  'Corral {corral_id} con temperatura alta: {temperatura_corral} °C',
  true
);
