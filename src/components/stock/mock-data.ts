import { Insumo, Movimiento } from './types'

export const insumosMock: Insumo[] = [
  { id: '1', nombre: 'Heno de alfalfa', tipo: 'alimento', unidad: 'kg', saldoActual: 1200, stockMinimo: 500 },
  { id: '2', nombre: 'Maíz molido', tipo: 'alimento', unidad: 'kg', saldoActual: 80, stockMinimo: 300 },
  { id: '3', nombre: 'Silaje', tipo: 'alimento', unidad: 'kg', saldoActual: 3500, stockMinimo: 1000 },
  { id: '4', nombre: 'Ivermectina', tipo: 'medicamento', unidad: 'ml', saldoActual: 45, stockMinimo: 100 },
  { id: '5', nombre: 'Oxitetraciclina', tipo: 'medicamento', unidad: 'ml', saldoActual: 200, stockMinimo: 50 },
  { id: '6', nombre: 'Vacuna aftosa', tipo: 'vacuna', unidad: 'dosis', saldoActual: 20, stockMinimo: 50 },
  { id: '7', nombre: 'Vacuna carbunclo', tipo: 'vacuna', unidad: 'dosis', saldoActual: 80, stockMinimo: 30 },
  { id: '8', nombre: 'Sal mineral', tipo: 'otro', unidad: 'kg', saldoActual: 15, stockMinimo: 20 },
]

export const movimientosMock: Movimiento[] = [
  { id: 'm1', insumoId: '1', tipo: 'ingreso', cantidad: 500, fecha: '2026-06-10', observacion: 'Compra proveedor A' },
  { id: 'm2', insumoId: '1', tipo: 'egreso', cantidad: 100, fecha: '2026-06-11', observacion: 'Consumo corral 1' },
  { id: 'm3', insumoId: '2', tipo: 'egreso', cantidad: 220, fecha: '2026-06-09', observacion: 'Consumo semanal' },
  { id: 'm4', insumoId: '4', tipo: 'egreso', cantidad: 55, fecha: '2026-06-08', observacion: 'Tratamiento animal #1023' },
  { id: 'm5', insumoId: '6', tipo: 'egreso', cantidad: 30, fecha: '2026-06-07', observacion: 'Campaña vacunación' },
  { id: 'm6', insumoId: '3', tipo: 'ingreso', cantidad: 1000, fecha: '2026-06-06', observacion: 'Producción propia' },
  { id: 'm7', insumoId: '8', tipo: 'ajuste', cantidad: -5, fecha: '2026-06-05', observacion: 'Ajuste inventario' },
]
