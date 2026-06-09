'use client'

import { useEffect, useRef, useCallback } from 'react'

export type HardwareStatus = 'online' | 'offline' | 'testing'

export interface HardwareStatusUpdate {
  id: string
  status: HardwareStatus
  lastPing: string // ISO timestamp
  signalStrength?: number
}

interface UseHardwareWebSocketOptions {
  onStatusUpdate: (update: HardwareStatusUpdate) => void
  enabled?: boolean
}

/**
 * Conecta al WebSocket /ws/hardware-status y notifica cambios de estado
 * en tiempo real. Maneja reconexión automática con back-off exponencial.
 */
export function useHardwareWebSocket({
  onStatusUpdate,
  enabled = true,
}: UseHardwareWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const MAX_RETRIES = 5
  const BASE_DELAY_MS = 2000

  const connect = useCallback(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const wsUrl =
      (process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001') +
      '/ws/hardware-status'

    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        retryCountRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string) as HardwareStatusUpdate
          onStatusUpdate(data)
        } catch {
          // Mensaje malformado — ignorar
        }
      }

      ws.onclose = () => {
        wsRef.current = null
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, retryCountRef.current)
          retryCountRef.current += 1
          reconnectTimeoutRef.current = setTimeout(connect, delay)
        }
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch {
      // WebSocket no disponible en este entorno
    }
  }, [enabled, onStatusUpdate])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [connect])
}
