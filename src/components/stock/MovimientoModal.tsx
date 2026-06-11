'use client'

import React, { useState } from 'react'
import { Insumo, TipoMovimiento, Movimiento } from './types'

interface Props {
  insumo: Insumo
  onClose: () => void
  onSave: (mov: Movimiento) => void
}

export function MovimientoModal({ insumo, onClose, onSave }: Props) {
  const [tipo, setTipo] = useState<TipoMovimiento>('ingreso')
  const [cantidad, setCantidad] = useState('')
  const [observacion, setObservacion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cantNum = parseFloat(cantidad)
    if (!cantNum || cantNum <= 0) return
    onSave({
      id: `m${Date.now()}`,
      insumoId: insumo.id,
      tipo,
      cantidad: tipo === 'egreso' ? -Math.abs(cantNum) : cantNum,
      fecha: new Date().toISOString().split('T')[0],
      observacion,
    })
    onClose()
  }

  const tipoColors: Record<TipoMovimiento, string> = {
    ingreso: '#16a34a',
    egreso: '#dc2626',
    ajuste: '#d97706',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Registrar movimiento</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{insumo.nombre}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo de movimiento</label>
            <div className="grid grid-cols-3 gap-2">
              {(['ingreso', 'egreso', 'ajuste'] as TipoMovimiento[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className="py-2 px-3 rounded-xl text-sm font-medium capitalize transition-all border-2"
                  style={{
                    borderColor: tipo === t ? tipoColors[t] : 'transparent',
                    backgroundColor: tipo === t ? `${tipoColors[t]}18` : '#f9fafb',
                    color: tipo === t ? tipoColors[t] : '#6b7280',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Cantidad ({insumo.unidad})
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-green-500"
              placeholder="0"
              required
            />
          </div>

          {/* Observación */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Observación</label>
            <textarea
              value={observacion}
              onChange={e => setObservacion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-green-500 resize-none"
              rows={2}
              placeholder="Motivo del movimiento..."
            />
          </div>

          {/* Saldo resultante */}
          <div className="rounded-xl p-3 bg-gray-50 dark:bg-gray-700 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Saldo actual: </span>
            <span className="font-bold text-gray-800 dark:text-white">{insumo.saldoActual} {insumo.unidad}</span>
            {cantidad && (
              <>
                <span className="text-gray-400 mx-2">→</span>
                <span className="font-bold" style={{ color: tipoColors[tipo] }}>
                  {tipo === 'egreso'
                    ? insumo.saldoActual - Math.abs(parseFloat(cantidad) || 0)
                    : insumo.saldoActual + (parseFloat(cantidad) || 0)
                  } {insumo.unidad}
                </span>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors" style={{ backgroundColor: '#2D6A2D' }}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
