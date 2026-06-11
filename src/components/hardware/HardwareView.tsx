'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { HardwareTable } from './HardwareTable'
import { DeviceConfigModal } from './DeviceConfigModal'
import { useHardwareWebSocket } from '@/hooks/useHardwareWebSocket'
import type { HardwareDevice, TestResult } from './types'
import type { HardwareStatusUpdate } from '@/hooks/useHardwareWebSocket'
import api from '@/lib/axios'

// ─── Mock data para desarrollo ───────────────────────────────────────────────
const MOCK_DEVICES: HardwareDevice[] = [
  {
    id: 'rfid-001',
    type: 'rfid',
    name: 'Antena Principal',
    location: 'Entrada Corral A',
    ipAddress: '192.168.1.101',
    port: 5000,
    frequency: '902-928 MHz',
    lastPing: new Date(Date.now() - 45_000).toISOString(),
    status: 'online',
    recentActivity: true,
  },
  {
    id: 'rfid-002',
    type: 'rfid',
    name: 'Antena Salida',
    location: 'Salida Corral A',
    ipAddress: '192.168.1.102',
    port: 5000,
    frequency: '902-928 MHz',
    lastPing: new Date(Date.now() - 600_000).toISOString(),
    status: 'offline',
    recentActivity: false,
  },
  {
    id: 'rfid-003',
    type: 'rfid',
    name: 'Antena Corral B',
    location: 'Corral B Norte',
    ipAddress: '192.168.1.103',
    port: 5000,
    frequency: '865-868 MHz',
    lastPing: new Date(Date.now() - 120_000).toISOString(),
    status: 'online',
    recentActivity: false,
  },
  {
    id: 'cam-001',
    type: 'camera',
    name: 'Cámara Corral A',
    location: 'Corral A — Vista general',
    ipAddress: '192.168.1.201',
    port: 554,
    resolution: '1920x1080',
    streamUrl: 'rtsp://192.168.1.201/stream1',
    lastPing: new Date(Date.now() - 30_000).toISOString(),
    status: 'online',
    recentActivity: true,
  },
  {
    id: 'cam-002',
    type: 'camera',
    name: 'Cámara Pesaje',
    location: 'Báscula principal',
    ipAddress: '192.168.1.202',
    port: 554,
    resolution: '1280x720',
    streamUrl: 'rtsp://192.168.1.202/stream1',
    lastPing: new Date(Date.now() - 3_600_000).toISOString(),
    status: 'offline',
    recentActivity: false,
  },
]

type TabId = 'rfid' | 'cameras'

interface TabDef {
  id: TabId
  label: string
  icon: React.ReactNode
}

const TABS: TabDef[] = [
  {
    id: 'rfid',
    label: 'Antenas RFID',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 00.808 9.636c3.71-3.71 9.744-3.71 13.454 0a1 1 0 001.414-1.414l.102-.102zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 101.414 1.414 5 5 0 017.072 0 1 1 0 101.414-1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 101.414 1.414 1 1 0 011.414 0 1 1 0 101.414-1.414zM11 17a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'cameras',
    label: 'Cámaras IP',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    ),
  },
]

export function HardwareView() {
  const [activeTab, setActiveTab] = useState<TabId>('rfid')
  const [devices, setDevices] = useState<HardwareDevice[]>(MOCK_DEVICES)
  const [testingIds, setTestingIds] = useState<Set<string>>(new Set())
  const [configDevice, setConfigDevice] = useState<HardwareDevice | null>(null)
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [wsConnected, setWsConnected] = useState(false)

  // ─── WebSocket live updates ─────────────────────────────────────────────
  const handleStatusUpdate = useCallback((update: HardwareStatusUpdate) => {
    setWsConnected(true)
    setDevices((prev) =>
      prev.map((d) =>
        d.id === update.id
          ? {
              ...d,
              status: update.status,
              lastPing: update.lastPing,
              recentActivity: true,
            }
          : d
      )
    )

    // Limpiar recentActivity después de 10 s para que el pulse cese
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === update.id ? { ...d, recentActivity: false } : d
        )
      )
    }, 10_000)
  }, [])

  useHardwareWebSocket({ onStatusUpdate: handleStatusUpdate })

  // ─── Test de conexión ───────────────────────────────────────────────────
  const handleTest = useCallback(async (id: string) => {
    setTestingIds((prev) => new Set(prev).add(id))
    // Activar estado visual testing
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'testing' } : d))
    )

    try {
      const response = await api.post<TestResult>(`/hardware/${id}/test`)
      const result = response.data
      setTestResults((prev) => ({ ...prev, [id]: result }))
      setDevices((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: result.success ? 'online' : 'offline',
                lastPing: result.testedAt,
                recentActivity: result.success,
              }
            : d
        )
      )
    } catch {
      // Si la API no está disponible, simular resultado offline
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'offline' } : d))
      )
    } finally {
      setTestingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [])

  // ─── Guardar configuración ──────────────────────────────────────────────
  const handleSaveConfig = useCallback(async (updated: HardwareDevice) => {
    await api.put(`/hardware/${updated.id}`, updated)
    setDevices((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    )
  }, [])

  // Filtrar por tab activo
  const visibleDevices = devices.filter((d) =>
    activeTab === 'rfid' ? d.type === 'rfid' : d.type === 'camera'
  )

  const onlineCount = visibleDevices.filter((d) => d.status === 'online').length
  const totalCount = visibleDevices.length

  return (
    <div className="space-y-6">
      {/* Cabecera de página */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Administración de Hardware
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitoreo en tiempo real de antenas RFID y cámaras IP
          </p>
        </div>

        {/* Indicador de conexión WebSocket */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <span className="relative flex h-2 w-2">
            {wsConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                wsConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </span>
          {wsConnected ? 'Live updates activos' : 'Conectando…'}
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-0 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const count = devices.filter((d) =>
              tab.id === 'rfid' ? d.type === 'rfid' : d.type === 'camera'
            ).length
            const onlineInTab = devices.filter((d) =>
              (tab.id === 'rfid' ? d.type === 'rfid' : d.type === 'camera') &&
              d.status === 'online'
            ).length

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium
                  border-b-2 transition-colors
                  ${isActive
                    ? 'border-green-dark text-green-dark bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
                style={isActive ? { borderBottomColor: '#2D6A2D', color: '#2D6A2D' } : undefined}
                aria-selected={isActive}
                role="tab"
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`
                    ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs
                    ${isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {onlineInTab}/{count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Resumen rápido */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span>
            <strong className="text-green-700 font-semibold">{onlineCount}</strong>{' '}
            online de{' '}
            <strong className="text-gray-700 font-semibold">{totalCount}</strong>{' '}
            dispositivos
          </span>
          {totalCount - onlineCount > 0 && (
            <span className="text-red-600">
              <strong>{totalCount - onlineCount}</strong> offline
            </span>
          )}
        </div>

        {/* Tabla */}
        <div className="p-0">
          <HardwareTable
            devices={visibleDevices}
            testingIds={testingIds}
            onTest={handleTest}
            onConfigure={setConfigDevice}
          />
        </div>
      </Card>

      {/* Últimos resultados de test */}
      {Object.keys(testResults).length > 0 && (
        <Card title="Resultados de pruebas recientes">
          <div className="space-y-2">
            {Object.entries(testResults).map(([id, result]) => {
              const device = devices.find((d) => d.id === id)
              return (
                <div
                  key={id}
                  className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm ${
                    result.success
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{result.success ? '✓' : '✗'}</span>
                    <span className="font-medium">{device?.name ?? id}</span>
                    <span className="text-xs opacity-75">— {result.message}</span>
                  </div>
                  {result.latencyMs !== null && (
                    <span className="text-xs font-mono">
                      {result.latencyMs} ms
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Modal de configuración */}
      <DeviceConfigModal
        device={configDevice}
        isOpen={configDevice !== null}
        onClose={() => setConfigDevice(null)}
        onSave={handleSaveConfig}
      />
    </div>
  )
}

