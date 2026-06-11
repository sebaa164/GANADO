import React from 'react'
import { useCountUp } from '@/hooks/useCountUp'
import type { WsStatus } from '@/hooks/useWebSocket'

interface KpiCardProps {
  /** Card label */
  label: string
  /** Numeric value to animate towards */
  value: number
  /** Unit appended after the number, e.g. "kg", "°C" */
  unit?: string
  /** Decimal places for the displayed value. Defaults to 0. */
  decimals?: number
  /** Format large numbers with thousands separators. Defaults to true. */
  formatNumber?: boolean
  /** Lucide-style or emoji icon element */
  icon: React.ReactNode
  /** Accent colour applied to the value text and left border */
  color: string
  /** Whether initial data has arrived yet */
  hasData: boolean
  /** WebSocket connection status for the reconnecting banner */
  wsStatus: WsStatus
  /** Optional small trend label, e.g. "+2% hoy" */
  trend?: string
}

/**
 * Formats a number with locale thousands separators.
 * Avoids Intl when not needed for simplicity.
 */
function fmt(value: string, format: boolean): string {
  if (!format) return value
  const [int, dec] = value.split('.')
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return dec !== undefined ? `${intFormatted},${dec}` : intFormatted
}

export function KpiCard({
  label,
  value,
  unit = '',
  decimals = 0,
  formatNumber = true,
  icon,
  color,
  hasData,
  wsStatus,
  trend,
}: KpiCardProps) {
  const animated = useCountUp({ target: value, decimals, duration: 700 })
  const displayValue = fmt(animated, formatNumber)

  const isLoading = !hasData
  const isReconnecting = wsStatus === 'reconnecting' || wsStatus === 'closed'

  return (
    <div
      className="
        relative bg-white dark:bg-gray-800
        rounded-xl shadow-soft border border-gray-100 dark:border-gray-700
        p-5 flex flex-col gap-3 overflow-hidden
        transition-shadow hover:shadow-md
      "
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      {/* Reconnecting banner */}
      {isReconnecting && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-x-0 top-0 h-0.5 bg-yellow-400 animate-pulse"
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${color}18` }}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>

      {/* Value */}
      {isLoading ? (
        <div className="flex flex-col gap-1.5 animate-pulse" aria-busy="true" aria-label="Cargando">
          <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-3.5 w-20 rounded bg-gray-100 dark:bg-gray-600" />
        </div>
      ) : (
        <div>
          <p
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color }}
            aria-live="polite"
            aria-atomic="true"
          >
            {displayValue}
            {unit && (
              <span className="text-xl font-semibold ml-1">{unit}</span>
            )}
          </p>
          {trend && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {trend}
            </p>
          )}
        </div>
      )}

      {/* WS status indicator */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            wsStatus === 'open'
              ? 'bg-green-500'
              : wsStatus === 'reconnecting'
                ? 'bg-yellow-400 animate-pulse'
                : wsStatus === 'connecting'
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-gray-400'
          }`}
          aria-hidden="true"
        />
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {wsStatus === 'open'
            ? 'En vivo'
            : wsStatus === 'reconnecting'
              ? 'Reconectando…'
              : wsStatus === 'connecting'
                ? 'Conectando…'
                : 'Sin conexión'}
        </span>
      </div>
    </div>
  )
}
