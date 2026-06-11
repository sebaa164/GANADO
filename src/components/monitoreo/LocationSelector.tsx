'use client'

import React from 'react'
import { useMonitoreoStore, type Camara } from '@/stores/monitoreoStore'

interface LocationSelectorProps {
  camaras: Camara[]
}

export function LocationSelector({ camaras }: LocationSelectorProps) {
  const selectedLocation = useMonitoreoStore((s) => s.selectedLocation)
  const setSelectedLocation = useMonitoreoStore((s) => s.setSelectedLocation)

  // Agrupar por corral
  const corralMap = new Map<number, { nombre: string; camaras: Camara[] }>()
  camaras.forEach((c) => {
    if (!corralMap.has(c.corral_id)) {
      corralMap.set(c.corral_id, { nombre: c.corral_nombre, camaras: [] })
    }
    corralMap.get(c.corral_id)!.camaras.push(c)
  })

  return (
    <select
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-green-dark focus:ring-1 focus:ring-green-dark"
    >
      <option value="all">Todas las ubicaciones</option>
      {Array.from(corralMap.entries()).map(([corralId, corral]) => (
        <optgroup key={corralId} label={corral.nombre}>
          <option value={`corral_${corralId}`}>{corral.nombre} — Todas</option>
          {corral.camaras.map((cam) => (
            <option key={cam.id} value={`camara_${cam.id}`}>
              &nbsp;&nbsp;&nbsp;{cam.nombre}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
