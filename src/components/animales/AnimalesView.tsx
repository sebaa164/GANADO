'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimalesTable } from './AnimalesTable'
import { AnimalesFiltros } from './AnimalesFiltros'
import { NuevoAnimalModal } from './NuevoAnimalModal'
import { MOCK_ANIMALES } from './mock-data'
import type { Animal, FiltrosAnimales } from './types'

const FILTROS_INICIAL: FiltrosAnimales = { busqueda: '', corral: '', lote: '', estado: 'todos' }

export function AnimalesView() {
  const [animales, setAnimales] = useState<Animal[]>(MOCK_ANIMALES)
  const [filtros, setFiltros] = useState<FiltrosAnimales>(FILTROS_INICIAL)
  const [modalOpen, setModalOpen] = useState(false)
  const [animalEditando, setAnimalEditando] = useState<Animal | null>(null)

  const animalesFiltrados = useMemo(() => animales.filter(a => {
    if (filtros.busqueda && !a.rfid.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false
    if (filtros.corral && a.corral !== filtros.corral) return false
    if (filtros.lote && a.lote !== filtros.lote) return false
    if (filtros.estado !== 'todos' && a.estado !== filtros.estado) return false
    return true
  }), [animales, filtros])

  const handleSave = (data: Animal) => {
    setAnimales(prev => {
      const existe = prev.find(a => a.id === data.id)
      return existe ? prev.map(a => a.id === data.id ? data : a) : [data, ...prev]
    })
    setAnimalEditando(null)
  }

  const activos = animales.filter(a => a.estado === 'activo').length
  const bajas = animales.filter(a => a.estado === 'baja').length
  const pesoPromedio = animales.length ? Math.round(animales.reduce((s, a) => s + a.pesoUltimo, 0) / animales.length) : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Animales</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión del rodeo</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Nuevo animal
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total animales', value: animales.length, color: 'text-green-dark', bg: 'bg-green-50 border-green-100' },
          { label: `Activos / ${bajas} bajas`, value: activos, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Peso promedio', value: `${pesoPromedio} kg`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 flex items-center gap-3 shadow-soft ${stat.bg}`}>
            <div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimalesFiltros filtros={filtros} onChange={setFiltros} />
      <AnimalesTable animales={animalesFiltrados} onEdit={a => { setAnimalEditando(a); setModalOpen(true) }} onDelete={id => { if (confirm('¿Eliminar este animal?')) setAnimales(prev => prev.filter(a => a.id !== id)) }} />
      <NuevoAnimalModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setAnimalEditando(null) }} onSave={handleSave} initialData={animalEditando} />
    </div>
  )
}
