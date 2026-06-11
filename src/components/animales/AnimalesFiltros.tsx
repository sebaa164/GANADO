'use client'

import { Search, X } from 'lucide-react'
import type { FiltrosAnimales } from './types'
import { CORRALES, LOTES } from './mock-data'

interface AnimalesFiltrosProps {
  filtros: FiltrosAnimales
  onChange: (filtros: FiltrosAnimales) => void
}

export function AnimalesFiltros({ filtros, onChange }: AnimalesFiltrosProps) {
  const set = (key: keyof FiltrosAnimales, value: string) => onChange({ ...filtros, [key]: value })
  const limpiar = () => onChange({ busqueda: '', corral: '', lote: '', estado: 'todos' })
  const hayFiltros = filtros.busqueda || filtros.corral || filtros.lote || filtros.estado !== 'todos'

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Buscar por RFID..." value={filtros.busqueda} onChange={e => set('busqueda', e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-green-dark focus:ring-2 focus:ring-green-dark/20" />
      </div>
      <select value={filtros.corral} onChange={e => set('corral', e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-green-dark min-w-32">
        <option value="">Todos los corrales</option>
        {CORRALES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filtros.lote} onChange={e => set('lote', e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-green-dark min-w-36">
        <option value="">Todos los lotes</option>
        {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select value={filtros.estado} onChange={e => set('estado', e.target.value as FiltrosAnimales['estado'])}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-green-dark min-w-32">
        <option value="todos">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="baja">Baja</option>
      </select>
      {hayFiltros && (
        <button onClick={limpiar} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors">
          <X className="h-4 w-4" /> Limpiar
        </button>
      )}
    </div>
  )
}
