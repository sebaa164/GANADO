'use client'

import React, { useEffect } from 'react'
import { MainLayout } from '@/components/layout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useMonitoreoStore } from '@/stores/monitoreoStore'
import { CameraCard } from '@/components/monitoreo/CameraCard'
import { LocationSelector } from '@/components/monitoreo/LocationSelector'
import { AlertNotification } from '@/components/monitoreo/AlertNotification'
import { FullscreenModal } from '@/components/monitoreo/FullscreenModal'

const alertasSimuladas = [
  { titulo: 'Animal caído detectado', mensaje: 'Corral Norte — Cámara CAM-001', tipo: 'critica' as const },
  { titulo: 'Comportamiento anormal', mensaje: 'Zona Alimentación — Cámara CAM-003', tipo: 'critica' as const },
  { titulo: 'Sin acceso a comedero', mensaje: 'Corral Sur — Cámara CAM-002', tipo: 'critica' as const },
  { titulo: 'Inactividad prolongada', mensaje: 'Corral Este — Cámara CAM-004', tipo: 'critica' as const },
]

export default function MonitoreoVisualPage() {
  const camaras = useMonitoreoStore((s) => s.camaras)
  const selectedLocation = useMonitoreoStore((s) => s.selectedLocation)
  const gridSize = useMonitoreoStore((s) => s.gridSize)
  const setGridSize = useMonitoreoStore((s) => s.setGridSize)
  const camarasOnline = useMonitoreoStore((s) => s.camarasOnline)
  const camarasOffline = useMonitoreoStore((s) => s.camarasOffline)
  const agregarNotificacion = useMonitoreoStore((s) => s.agregarNotificacion)

  // Simular alertas periódicas
  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      const a = alertasSimuladas[idx]
      agregarNotificacion(a.titulo, a.mensaje, a.tipo as 'critica')
      idx = (idx + 1) % alertasSimuladas.length
    }, 15000)
    return () => clearInterval(interval)
  }, [agregarNotificacion])

  // Filtrar cámaras
  const camarasFiltradas = camaras.filter((cam) => {
    if (selectedLocation === 'all') return true
    const [tipo, id] = selectedLocation.split('_')
    if (tipo === 'corral') return cam.corral_id === Number(id)
    if (tipo === 'camara') return cam.id === Number(id)
    return true
  })

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-4">
          {/* Barra superior */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoreo Visual</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <LocationSelector camaras={camaras} />

              {/* Toggle grilla */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setGridSize('2x2')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    gridSize === '2x2' ? 'bg-green-dark text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  2x2
                </button>
                <button
                  onClick={() => setGridSize('3x3')}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
                    gridSize === '3x3' ? 'bg-green-dark text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  3x3
                </button>
              </div>

              {/* Estado cámaras */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span>{camarasOnline}</span> online
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span>{camarasOffline}</span> offline
                </span>
              </div>
            </div>
          </div>

          {/* Grilla */}
          <div
            className={
              gridSize === '2x2'
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'
            }
          >
            {camarasFiltradas.map((cam) => (
              <CameraCard key={cam.id} camara={cam} />
            ))}
          </div>

          {/* Sin resultados */}
          {camarasFiltradas.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No hay cámaras disponibles</p>
              <p className="text-sm mt-1">Seleccioná otra ubicación o agregá cámaras en Gestión.</p>
            </div>
          )}

          {/* Notificaciones flotantes */}
          <AlertNotification />

          {/* Modal pantalla completa */}
          <FullscreenModal />
        </div>
      </MainLayout>
    </AuthGuard>
  )
}

