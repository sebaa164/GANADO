'use client'

import { useState, useCallback } from 'react'
import { useWebSocket, type WsStatus } from './useWebSocket'

export interface DashboardMetrics {
  peso_promedio_kg: number
  animales_activos: number
  alertas_activas: number
  temperatura_ambiente_c: number
}

/** Seed values shown while loading */
const INITIAL_METRICS: DashboardMetrics = {
  peso_promedio_kg: 0,
  animales_activos: 0,
  alertas_activas: 0,
  temperatura_ambiente_c: 0,
}

interface UseDashboardWebSocketResult {
  metrics: DashboardMetrics
  status: WsStatus
  hasData: boolean
}

export function useDashboardWebSocket(): UseDashboardWebSocketResult {
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS)
  const [hasData, setHasData] = useState(false)

  const handleMessage = useCallback((data: DashboardMetrics) => {
    setMetrics(data)
    setHasData(true)
  }, [])

  const status = useWebSocket<DashboardMetrics>({
    path: '/ws/dashboard',
    onMessage: handleMessage,
  })

  return { metrics, status, hasData }
}
