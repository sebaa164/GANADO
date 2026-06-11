'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NuevoEventoModal } from './NuevoEventoModal'
import { EventoTimeline } from './EventoTimeline'
import { SanitarioContadores } from './SanitarioContadores'
import { MOCK_EVENTOS } from './mock-data'
import type { EventoSanitario, FiltroEstado, NuevoEventoForm } from './types'

const FILTROS: { value: FiltroEstado; label: string }[] = [
  { value: 'todos',          label: 'Todos' },
  { value: 'enfermos',       label: 'Enfermos' },
  { value: 'en_tratamiento', label: 'En tratamiento' },
  { value: 'recuperado',     label: 'Recuperados' },
  { value: 'muerto',         label: 'Muertos' },
]

function filtrarEventos(eventos: EventoSanitario[], filtro: FiltroEstado): EventoSanitario[] {
  switch (filtro) {
    case 'todos':          return eventos
    case 'enfermos':       return eventos.filter(e => e.tipo === 'enfermedad' && e.estado !== 'recuperado' && e.estado !== 'muerto')
    case 'en_tratamiento': return eventos.filter(e => e.estado === 'en_tratamiento')
    case 'recuperado':     return eventos.filter(e => e.estado === 'recuperado')
    case 'muerto':         return eventos.filter(e => e.tipo === 'muerte' || e.estado === 'muerto')
    default:               return eventos
  }
}

interface SanitarioViewProps {
  animalId: string
}

export function SanitarioView({ animalId }: SanitarioViewProps) {
  const [eventos, setEventos] = useState<EventoSanitario[]>(MOCK_EVENTOS)
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')
  const [modalOpen, setModalOpen] = useState(false)

  const eventosFiltrados = filtrarEventos(eventos, filtro)

  const handleNuevoEvento = (data: NuevoEventoForm) => {
    const nuevo: EventoSanitario = {
      id: crypto.randomUUID(),
      animalId,
      ...data,
      tratamientoCerrado: false,
    }
    setEventos(prev => [nuevo, ...prev])
  }

  const handleCerrarTratamiento = (id: string) => {
    setEventos(prev =>
      prev.map(e => e.id === id ? { ...e, estado: 'recuperado', tratamientoCerrado: true } : e)
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Historial sanitario</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Animal <span className="font-semibold text-green-dark">#{animalId}</span>
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo evento
        </Button>
      </div>

      <SanitarioContadores eventos={eventos} />

      <div role="group" aria-label="Filtrar eventos" className="flex flex-wrap gap-2 mb-6">
        {FILTROS.map(f => {
          const count = filtrarEventos(eventos, f.value).length
          return (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              aria-pressed={filtro === f.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${filtro === f.value
                  ? 'bg-green-dark text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-dark hover:text-green-dark'
                }`}
            >
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${filtro === f.value ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <EventoTimeline eventos={eventosFiltrados} onCerrarTratamiento={handleCerrarTratamiento} />

      <NuevoEventoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleNuevoEvento}
      />
    </div>
  )
}

