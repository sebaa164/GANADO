'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { StatusIndicator } from './StatusIndicator'
import type { HardwareDevice } from './types'

interface HardwareTableProps {
  devices: HardwareDevice[]
  testingIds: Set<string>
  onTest: (id: string) => void
  onConfigure: (device: HardwareDevice) => void
}

/** Formatea timestamp ISO a hora legible, o '—' si es null */
function formatLastPing(iso: string | null): string {
  if (!iso) return '—'
  try {
    const date = new Date(iso)
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(date)
  } catch {
    return iso
  }
}

export function HardwareTable({
  devices,
  testingIds,
  onTest,
  onConfigure,
}: HardwareTableProps) {
  if (devices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg
          className="mx-auto mb-3 w-10 h-10 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">No hay dispositivos registrados</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-900">
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Ubicación</th>
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">IP / Puerto</th>
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Último ping</th>
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {devices.map((device) => {
            const isTesting = testingIds.has(device.id) || device.status === 'testing'
            return (
              <tr
                key={device.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Nombre con badge de tipo */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {device.name}
                    </span>
                    <span
                      className={`
                        inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
                        ${device.type === 'rfid'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'}
                      `}
                    >
                      {device.type === 'rfid' ? 'RFID' : 'CAM'}
                    </span>
                  </div>
                </td>

                {/* Ubicación */}
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{device.location}</td>

                {/* IP y puerto */}
                <td className="px-4 py-3">
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {device.ipAddress}
                    <span className="text-gray-400">:{device.port}</span>
                  </span>
                </td>

                {/* Último ping */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {formatLastPing(device.lastPing)}
                </td>

                {/* Estado con pulse cuando hay actividad */}
                <td className="px-4 py-3">
                  <StatusIndicator
                    status={isTesting ? 'testing' : device.status}
                    recentActivity={device.recentActivity}
                  />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={isTesting}
                      onClick={() => onTest(device.id)}
                      aria-label={`Testear conexión de ${device.name}`}
                      title="Testear conexión"
                    >
                      {isTesting ? 'Testeando…' : 'Test'}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onConfigure(device)}
                      aria-label={`Configurar ${device.name}`}
                      title="Configurar dispositivo"
                    >
                      Configurar
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

