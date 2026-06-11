import React from 'react'
import type { DeviceStatus } from './types'

interface StatusIndicatorProps {
  status: DeviceStatus
  recentActivity?: boolean
  /** Muestra texto junto al indicador */
  showLabel?: boolean
}

const statusConfig: Record<
  DeviceStatus,
  { color: string; pulseColor: string; label: string }
> = {
  online:  { color: 'bg-green-500',  pulseColor: 'bg-green-400',  label: 'Online'   },
  offline: { color: 'bg-red-500',    pulseColor: 'bg-red-400',    label: 'Offline'  },
  testing: { color: 'bg-yellow-500', pulseColor: 'bg-yellow-400', label: 'Testeando' },
}

/**
 * Chip de estado con animación pulse cuando hay actividad reciente o está en modo testing.
 */
export function StatusIndicator({
  status,
  recentActivity = false,
  showLabel = true,
}: StatusIndicatorProps) {
  const cfg = statusConfig[status]
  const shouldPulse = recentActivity || status === 'testing'

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {shouldPulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.pulseColor} opacity-75`}
          />
        )}
        <span className={`relative inline-flex h-3 w-3 rounded-full ${cfg.color}`} />
      </span>
      {showLabel && (
        <span
          className={`text-xs font-medium ${
            status === 'online'
              ? 'text-green-700'
              : status === 'offline'
              ? 'text-red-600'
              : 'text-yellow-700'
          }`}
        >
          {cfg.label}
        </span>
      )}
    </span>
  )
}
