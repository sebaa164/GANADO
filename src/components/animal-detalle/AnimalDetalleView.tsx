'use client'

import { useState } from 'react'
import { AnimalHeader } from './AnimalHeader'
import { PesoChart } from './PesoChart'
import { MovimientosTimeline } from './MovimientosTimeline'
import { AlertasAnimal } from './AlertasAnimal'
import { ConsumoTab } from './ConsumoTab'
import { MOCK_ANIMAL, MOCK_HISTORIAL_PESOS, MOCK_MOVIMIENTOS, MOCK_ALERTAS } from './mock-animal'

type TabId = 'general' | 'sanitario' | 'consumo'
const TABS: { id: TabId; label: string }[] = [
  { id: 'general',   label: 'General'   },
  { id: 'sanitario', label: 'Sanitario' },
  { id: 'consumo',   label: 'Consumo'   },
]

export function AnimalDetalleView({ animalId, activeTab = 'general' }: { animalId: string; activeTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(activeTab)
  const animal = { ...MOCK_ANIMAL, rfid: animalId, id: animalId }

  return (
    <div className="w-full">
      <AnimalHeader animal={animal} onEdit={() => alert('Editar animal')} />

      <nav aria-label="Secciones del animal" className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors
              ${tab === t.id ? 'border-green-dark text-green-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'general' && (
        <div className="space-y-5">
          <PesoChart historial={MOCK_HISTORIAL_PESOS} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MovimientosTimeline movimientos={MOCK_MOVIMIENTOS} />
            <AlertasAnimal alertas={MOCK_ALERTAS} />
          </div>
        </div>
      )}

      {tab === 'sanitario' && (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-6 border border-dashed border-gray-200 text-center">
          El historial sanitario está en{' '}
          <a href={`/animales/${animalId}/sanitario`} className="text-green-dark underline font-medium">
            /animales/{animalId}/sanitario
          </a>
        </div>
      )}

      {tab === 'consumo' && <ConsumoTab />}
    </div>
  )
}
