export type EventoTipo = 'enfermedad' | 'tratamiento' | 'vacuna' | 'muerte'
export type EventoEstado = 'activo' | 'en_tratamiento' | 'recuperado' | 'muerto'

export interface EventoSanitario {
  id: string
  animalId: string
  tipo: EventoTipo
  fecha: string
  descripcion: string
  estado: EventoEstado
  medicamento?: string
  veterinario?: string
  tratamientoCerrado?: boolean
}

export type FiltroEstado = 'todos' | EventoEstado | 'enfermos'

export interface NuevoEventoForm {
  tipo: EventoTipo
  fecha: string
  descripcion: string
  estado: EventoEstado
  medicamento?: string
  veterinario?: string
}
