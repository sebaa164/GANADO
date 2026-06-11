'use client'

import React from 'react'
import { useMonitoreoStore, type Camara } from '@/stores/monitoreoStore'
import { VideoPlayer } from './VideoPlayer'
import { AiOverlay } from './AiOverlay'

interface CameraCardProps {
  camara: Camara
}

export function CameraCard({ camara }: CameraCardProps) {
  const setFullscreenCam = useMonitoreoStore((s) => s.setFullscreenCam)

  return (
    <div
      className={`relative bg-gray-900 rounded-xl overflow-hidden group ${!camara.activa ? 'ring-2 ring-red-500' : ''}`}
    >
      <VideoPlayer
        streamUrl={camara.stream_url}
        cameraName={camara.nombre}
        activa={camara.activa}
      />

      <AiOverlay detecciones={camara.detecciones} />

      {/* Badge offline */}
      {!camara.activa && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
          Offline
        </div>
      )}

      {/* Indicador LIVE */}
      {camara.activa && camara.stream_url && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
          LIVE
        </div>
      )}

      {/* Nombre cámara */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
        <span className="text-white text-sm font-medium">{camara.nombre}</span>
        <span className="text-gray-300 text-xs ml-2">· {camara.corral_nombre}</span>
      </div>

      {/* Botones de control */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setFullscreenCam(camara.id)}
          className="bg-black/50 hover:bg-black/70 text-white rounded-lg p-1.5 transition-colors"
          title="Pantalla completa"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
