'use client'

import React, { useState } from 'react'
import { Insumo, Movimiento, TipoInsumo } from './types'
import { insumosMock, movimientosMock } from './mock-data'
import { MovimientoModal } from './MovimientoModal'
import { HistorialModal } from './HistorialModal'

const tipoLabels: Record<TipoInsumo, string> = {
  alimento:    'Alimento',
  medicamento: 'Medicamento',
  vacuna:      'Vacuna',
  otro:        'Otro',
}

const tipoBadgeColors: Record<TipoInsumo, { bg: string; text: string }> = {
  alimento:    { bg: '#f0fdf4', text: '#16a34a' },
  medicamento: { bg: '#eff6ff', text: '#2563eb' },
  vacuna:      { bg: '#fdf4ff', text: '#9333ea' },
  otro:        { bg: '#f9fafb', text: '#6b7280' },
}

export function StockView() {
  const [insumos, setInsumos] = useState<Insumo[]>(insumosMock)
  const [movimientos, setMovimientos] = useState<Movimiento[]>(movimientosMock)
  const [filtroTipo, setFiltroTipo] = useState<TipoInsumo | 'todos'>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [modalMovimiento, setModalMovimiento] = useState<Insumo | null>(null)
  const [modalHistorial, setModalHistorial] = useState<Insumo | null>(null)

  const stockBajo = insumos.filter(i => i.saldoActual < i.stockMinimo)

  const insumosFiltrados = insumos.filter(i => {
    const matchTipo = filtroTipo === 'todos' || i.tipo === filtroTipo
    const matchBusqueda = i.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusqueda
  })

  const handleSaveMovimiento = (mov: Movimiento) => {
    setMovimientos(prev => [...prev, mov])
    setInsumos(prev => prev.map(i => {
      if (i.id !== mov.insumoId) return i
      return { ...i, saldoActual: i.saldoActual + mov.cantidad }
    }))
  }

  return (
    <div className="space-y-4 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Stock e Insumos</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Inventario y movimientos</p>
        </div>
      </div>

      {/* Alertas stock bajo */}
      {stockBajo.length > 0 && (
        <div className="rounded-xl p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">
              {stockBajo.length} insumo{stockBajo.length > 1 ? 's' : ''} con stock bajo
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stockBajo.map(i => (
              <span key={i.id} className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
                {i.nombre} ({i.saldoActual}/{i.stockMinimo} {i.unidad})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar insumo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-green-500"
        />
        <div className="flex gap-2 flex-wrap">
          {(['todos', 'alimento', 'medicamento', 'vacuna', 'otro'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border"
              style={{
                backgroundColor: filtroTipo === t ? '#2D6A2D' : 'white',
                color: filtroTipo === t ? 'white' : '#6b7280',
                borderColor: filtroTipo === t ? '#2D6A2D' : '#e5e7eb',
              }}
            >
              {t === 'todos' ? 'Todos' : tipoLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Insumo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Tipo</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Saldo actual</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Stock mín.</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumosFiltrados.map((insumo, idx) => {
              const bajo = insumo.saldoActual < insumo.stockMinimo
              const pct = Math.min((insumo.saldoActual / insumo.stockMinimo) * 100, 100)
              const badge = tipoBadgeColors[insumo.tipo]
              return (
                <tr
                  key={insumo.id}
                  className={`border-b border-gray-50 dark:border-gray-700/50 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${bajo ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 dark:text-white">{insumo.nombre}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: badge.bg, color: badge.text }}>
                      {tipoLabels[insumo.tipo]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-bold ${bajo ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                      {insumo.saldoActual}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{insumo.unidad}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                    {insumo.stockMinimo} {insumo.unidad}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: bajo ? '#dc2626' : '#2D6A2D' }}
                        />
                      </div>
                      {bajo ? (
                        <span className="text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded-full">Bajo</span>
                      ) : (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded-full">OK</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModalMovimiento(insumo)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                        style={{ backgroundColor: '#2D6A2D' }}
                        title="Registrar movimiento"
                      >
                        + Mov.
                      </button>
                      <button
                        onClick={() => setModalHistorial(insumo)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Ver historial"
                      >
                        Historial
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {insumosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  No se encontraron insumos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modalMovimiento && (
        <MovimientoModal
          insumo={modalMovimiento}
          onClose={() => setModalMovimiento(null)}
          onSave={handleSaveMovimiento}
        />
      )}
      {modalHistorial && (
        <HistorialModal
          insumo={modalHistorial}
          movimientos={movimientos}
          onClose={() => setModalHistorial(null)}
        />
      )}
    </div>
  )
}
