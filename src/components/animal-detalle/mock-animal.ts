export interface AnimalDetalle {
  id: string; rfid: string; raza: string; fechaNacimiento: string
  pesoActual: number; corral: string; lote: string; estado: 'activo' | 'baja'
}
export interface RegistroPeso { fecha: string; peso: number }
export interface Movimiento { id: string; fecha: string; tipo: 'ingreso' | 'egreso' | 'traslado'; desde?: string; hacia: string; observacion?: string }
export interface AlertaAnimal { id: string; tipo: string; descripcion: string; severidad: 'normal' | 'advertencia' | 'critico'; fecha: string; resuelta: boolean }

export const MOCK_ANIMAL: AnimalDetalle = { id: 'GV-001', rfid: 'GV-001', raza: 'Angus', fechaNacimiento: '2021-03-12', pesoActual: 450, corral: 'A1', lote: 'Lote Norte', estado: 'activo' }
export const MOCK_HISTORIAL_PESOS: RegistroPeso[] = [
  { fecha: '2023-01', peso: 280 }, { fecha: '2023-03', peso: 310 }, { fecha: '2023-05', peso: 345 },
  { fecha: '2023-07', peso: 370 }, { fecha: '2023-09', peso: 395 }, { fecha: '2023-11', peso: 415 },
  { fecha: '2024-01', peso: 428 }, { fecha: '2024-03', peso: 438 }, { fecha: '2024-05', peso: 450 },
]
export const MOCK_MOVIMIENTOS: Movimiento[] = [
  { id: '1', fecha: '2024-04-01', tipo: 'traslado', desde: 'B2', hacia: 'A1', observacion: 'Traslado por reorganización de lote' },
  { id: '2', fecha: '2024-01-15', tipo: 'traslado', desde: 'A2', hacia: 'B2', observacion: 'Rotación de corrales' },
  { id: '3', fecha: '2023-09-10', tipo: 'ingreso', hacia: 'A2', observacion: 'Ingreso al establecimiento' },
]
export const MOCK_ALERTAS: AlertaAnimal[] = [
  { id: '1', tipo: 'Peso bajo', descripcion: 'El peso está por debajo del promedio del lote en un 8%', severidad: 'advertencia', fecha: '2024-05-10', resuelta: false },
  { id: '2', tipo: 'Sin actividad', descripcion: 'No se detectó movimiento en las últimas 18 hs', severidad: 'normal', fecha: '2024-04-28', resuelta: true },
]
