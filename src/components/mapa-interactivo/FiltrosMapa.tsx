'use client'

import React from 'react'
import { useMapaStore } from '@/stores/mapaStore'

export function FiltrosMapa() {
  const filtroCorral = useMapaStore((s) => s.filtroCorral)
  const filtroLote = useMapaStore((s) => s.filtroLote)
  const corrales = useMapaStore((s) => s.corrales)
  const lotesDisponibles = useMapaStore((s) => s.lotesDisponibles)
  const satelite = useMapaStore((s) => s.satelite)
  const setFiltroCorral = useMapaStore((s) => s.setFiltroCorral)
  const setFiltroLote = useMapaStore((s) => s.setFiltroLote)
  const setSatelite = useMapaStore((s) => s.setSatelite)
  const animalesFiltrados = useMapaStore((s) => s.animalesFiltrados)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-soft space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
        <span className="text-xs text-gray-400">
          {animalesFiltrados().length} animales
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Filtro por corral */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Corral</label>
          <select
            value={filtroCorral ?? ''}
            onChange={(e) => setFiltroCorral(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
            style={{ color: '#000000' }}
          >
            <option value="" className="text-black" style={{ color: '#000000' }}>Todos los corrales</option>
            {corrales.map((c) => (
              <option key={c.id} value={c.id} className="text-black" style={{ color: '#000000' }}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtro por lote */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Lote</label>
          <select
            value={filtroLote}
            onChange={(e) => setFiltroLote(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
            style={{ color: '#000000' }}
          >
            <option value="" className="text-black" style={{ color: '#000000' }}>Todos los lotes</option>
            {lotesDisponibles().map((l) => (
              <option key={l} value={l} className="text-black" style={{ color: '#000000' }}>{l}</option>
            ))}
          </select>
        </div>

        {/* Toggle satélite */}
        <div className="flex items-end">
          <button
            onClick={() => setSatelite(!satelite)}
            className={`w-full px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              satelite
                ? 'bg-green-dark text-white border-green-dark'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            🛰 {satelite ? 'Satélite' : 'Mapa calle'}
          </button>
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {(filtroCorral !== null || filtroLote !== '') && (
        <button
          onClick={() => {
            setFiltroCorral(null)
            setFiltroLote('')
          }}
          className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
