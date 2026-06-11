'use client'

import React from 'react'
import type { Deteccion } from '@/stores/monitoreoStore'

interface AiOverlayProps {
  detecciones: Deteccion[]
}

export function AiOverlay({ detecciones }: AiOverlayProps) {
  if (!detecciones || detecciones.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detecciones.map((det, i) => (
        <div
          key={i}
          className="absolute border-2 border-yellow-400 bg-yellow-400/10"
          style={{
            left: `${det.x}%`,
            top: `${det.y}%`,
            width: `${det.w}%`,
            height: `${det.h}%`,
          }}
        >
          <span className="absolute -top-5 left-0 bg-yellow-400 text-gray-900 text-[10px] font-semibold px-1 rounded-t whitespace-nowrap">
            {det.label} {Math.round(det.confianza * 100)}%
          </span>
        </div>
      ))}
    </div>
  )
}
