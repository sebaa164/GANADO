import { z } from 'zod'

export const animalSchema = z.object({
  rfid: z.string().min(3, 'El RFID debe tener al menos 3 caracteres.'),
  raza: z.string().min(2, 'Ingresá la raza del animal.'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria.'),
  pesoUltimo: z.number({ invalid_type_error: 'Ingresá un número válido.' }).positive('El peso debe ser mayor a 0.'),
  corral: z.string().min(1, 'Ingresá el corral.'),
  lote: z.string().min(1, 'Ingresá el lote.'),
  estado: z.enum(['activo', 'baja']),
})

export type AnimalFormData = z.infer<typeof animalSchema>
