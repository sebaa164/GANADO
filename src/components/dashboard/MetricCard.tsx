'use client'

import { useEffect, useRef, useState } from 'react'

interface MetricCardProps {
  title: string
  subtitle: string
  value: number
  format?: 'number' | 'weight' | 'temperature'
  color: string
  badge?: string
  badgeClass?: string
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function formatValue(value: number, fmt: MetricCardProps['format']): string {
  switch (fmt) {
    case 'weight':
      return `${value.toLocaleString('es-AR')} kg`
    case 'temperature':
      return `${value}°C`
    default:
      return value.toLocaleString('es-AR')
  }
}

export function MetricCard({
  title,
  subtitle,
  value,
  format = 'number',
  color,
  badge,
  badgeClass = '',
}: MetricCardProps) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef<number>(undefined)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    if (from === to) return

    const duration = 600
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      setDisplay(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-md">
      <div className="mb-md">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-3xl font-bold tabular-nums transition-colors"
          style={{ color }}
        >
          {formatValue(display, format)}
        </span>
        {badge && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
