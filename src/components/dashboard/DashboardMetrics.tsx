'use client'

import { useState, useRef, useCallback } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { MetricCard } from './MetricCard'

interface DashboardData {
  peso_promedio: number
  animales_activos: number
  alertas_activas: number
  temperatura: number
}

const STARTING: DashboardData = {
  peso_promedio: 380,
  animales_activos: 1240,
  alertas_activas: 7,
  temperatura: 28,
}

export function DashboardMetrics() {
  const [data, setData] = useState<DashboardData>({ ...STARTING })
  const hasReceivedData = useRef(false)

  const handleMessage = useCallback((msg: unknown) => {
    if (typeof msg === 'object' && msg !== null) {
      hasReceivedData.current = true
      setData(msg as DashboardData)
    }
  }, [])

  const { status: wsStatus } = useWebSocket({
    url: `${process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001'}/ws/dashboard`,
    onMessage: handleMessage,
  })

  const isConnecting = wsStatus === 'connecting'
  const isConnected = wsStatus === 'connected'

  if (isConnecting && !hasReceivedData.current) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-soft border border-gray-100 p-md animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!isConnected && hasReceivedData.current && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Reconectando...
        </div>
      )}

      {!isConnected && !hasReceivedData.current && (
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
          Sin conexión al servidor — mostrando datos de ejemplo
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Peso Promedio"
          subtitle="Últimos 30 días"
          value={data.peso_promedio}
          format="weight"
          color="#639922"
        />

        <MetricCard
          title="Animales Activos"
          subtitle="Registrados"
          value={data.animales_activos}
          format="number"
          color="#3B6D11"
        />

        <MetricCard
          title="Alertas Activas"
          subtitle="Pendientes"
          value={data.alertas_activas}
          format="number"
          color="#BA7517"
        />

        <MetricCard
          title="Temperatura Ambiente"
          subtitle="Promedio hoy"
          value={data.temperatura}
          format="temperature"
          color="#C0DD97"
        />
      </div>
    </div>
  )
}
