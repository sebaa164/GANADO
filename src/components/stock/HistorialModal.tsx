'use client'

import React from 'react'
import { Insumo, Movimiento } from './types'

interface Props {
  insumo: Insumo
  movimientos: Movimiento[]
  onClose: () => void
}

const tipoConfig = {
  ingreso: { label: 'Ingreso', color: '#16a34a', bg: '#f0fdf4', sign: '+' },
  egreso:  { label: 'Egreso',  color: '#dc2626', bg: '#fef2f2', sign: '-' },
  ajuste:  { label: 'Ajuste',  color: '#d97706', bg: '#fffbeb', sign: '±' },
}

export function HistorialModal({ insumo, movimientos, onClose }: Props) {
  const hist = movimientos
    .filter(m => m.insumoId === insumo.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Historial de movimientos</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{insumo.nombre}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-2">
          {hist.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin movimientos registrados</p>
          ) : hist.map(m => {
            const cfg = tipoConfig[m.tipo]
            return (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  {cfg.sign}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="text-xs text-gray-400">{m.fecha}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.observacion || '—'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold" style={{ color: cfg.color }}>
                    {cfg.sign}{Math.abs(m.cantidad)} {insumo.unidad}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
