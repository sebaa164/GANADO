export type EstadoAnimal = 'activo' | 'baja'

export interface Animal {
  id: string
  rfid: string
  raza: string
  fechaNacimiento: string
  pesoUltimo: number
  corral: string
  lote: string
  estado: EstadoAnimal
}

export interface FiltrosAnimales {
  busqueda: string
  corral: string
  lote: string
  estado: EstadoAnimal | 'todos'
}
