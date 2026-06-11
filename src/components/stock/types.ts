export type TipoInsumo = 'alimento' | 'medicamento' | 'vacuna' | 'otro'
export type TipoMovimiento = 'ingreso' | 'egreso' | 'ajuste'

export interface Insumo {
  id: string
  nombre: string
  tipo: TipoInsumo
  unidad: string
  saldoActual: number
  stockMinimo: number
}

export interface Movimiento {
  id: string
  insumoId: string
  tipo: TipoMovimiento
  cantidad: number
  fecha: string
  observacion: string
}
