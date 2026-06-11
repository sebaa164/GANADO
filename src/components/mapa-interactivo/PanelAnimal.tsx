'use client'

import React from 'react'
import Link from 'next/link'
import { useMapaStore } from '@/stores/mapaStore'

export function PanelAnimal() {
  const selectedAnimal = useMapaStore((s) => s.selectedAnimal)
  const setSelectedAnimal = useMapaStore((s) => s.setSelectedAnimal)

  if (!selectedAnimal) return null

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: selectedAnimal.estado_salud === 'normal' ? '#2D6A2D' : selectedAnimal.estado_salud === 'alerta' ? '#f59e0b' : '#ef4444',
            }}
          />
          <h3 className="text-sm font-semibold text-gray-900">{selectedAnimal.nombre}</h3>
        </div>
        <button onClick={() => setSelectedAnimal(null)} className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p><span className="text-gray-400">Arete:</span> <span className="font-medium">{selectedAnimal.arete}</span></p>
        <p><span className="text-gray-400">Corral:</span> <span className="font-medium">{selectedAnimal.corral_nombre}</span></p>
        <p><span className="text-gray-400">Lote:</span> <span className="font-medium">{selectedAnimal.lote}</span></p>
        <p><span className="text-gray-400">Temperatura:</span> <span className="font-medium">{selectedAnimal.temperatura.toFixed(1)}°C</span></p>
        <p><span className="text-gray-400">Peso:</span> <span className="font-medium">{selectedAnimal.peso} kg</span></p>
        <p><span className="text-gray-400">Última lectura:</span> <span className="font-medium">{selectedAnimal.ultima_lectura}</span></p>
      </div>

      <Link
        href={`/animales/${selectedAnimal.id}`}
        className="inline-block mt-3 text-sm font-medium text-green-dark hover:text-green-600 transition-colors underline"
      >
        Ver detalle completo →
      </Link>
    </div>
  )
}
