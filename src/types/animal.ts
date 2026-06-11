import { z } from 'zod'

export type Sexo = 'macho' | 'hembra'
export type EstadoSanitario = 'sano' | 'en_observacion' | 'enfermo'

export interface Animal {
  id: number
  corral_id: number
  codigo_caravana: string
  raza: string
  sexo: Sexo
  fecha_nacimiento: string
  fecha_ingreso: string
  fecha_egreso: string | null
  peso_ingreso_kg: number
  peso_egreso_kg: number | null
  estado_sanitario: EstadoSanitario
  activo: boolean
  created_at: string
  updated_at: string
  corral?: { id: number; nombre: string; codigo: string }
  ultimo_peso?: { peso_kg: number; pesado_en: string } | null
}

export interface AnimalFiltersState {
  search: string
  corral_id: number | null
  estado: 'todos' | 'activo' | 'baja'
  page: number
  per_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  last_page: number
}

const requiredMsg = 'Este campo es requerido'

export const animalSchema = z.object({
  corral_id: z
    .number({ message: requiredMsg })
    .positive('Debe ser un ID válido'),
  codigo_caravana: z
    .string()
    .min(1, 'El código de caravana es requerido')
    .max(100, 'Máximo 100 caracteres'),
  raza: z
    .string()
    .min(1, 'La raza es requerida')
    .max(100, 'Máximo 100 caracteres'),
  sexo: z.enum(['macho', 'hembra']),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  fecha_ingreso: z.string().min(1, 'La fecha de ingreso es requerida'),
  peso_ingreso_kg: z
    .number({ message: requiredMsg })
    .positive('Debe ser un peso válido'),
  estado_sanitario: z.enum(['sano', 'en_observacion', 'enfermo']),
})

export type AnimalFormData = z.infer<typeof animalSchema>
