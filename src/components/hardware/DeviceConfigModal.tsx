'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { HardwareDevice, RfidAntenna, IpCamera } from './types'

interface DeviceConfigModalProps {
  device: HardwareDevice | null
  isOpen: boolean
  onClose: () => void
  onSave: (updated: HardwareDevice) => Promise<void>
}

export function DeviceConfigModal({
  device,
  isOpen,
  onClose,
  onSave,
}: DeviceConfigModalProps) {
  const [form, setForm] = useState<Partial<HardwareDevice>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sincronizar formulario cuando cambia el dispositivo
  useEffect(() => {
    if (device) setForm({ ...device })
  }, [device])

  if (!device) return null

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSave(form as HardwareDevice)
      onClose()
    } catch {
      setError('No se pudo guardar la configuración. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const isRfid = device.type === 'rfid'
  const rfid = form as Partial<RfidAntenna>
  const cam = form as Partial<IpCamera>

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configurar ${isRfid ? 'Antena RFID' : 'Cámara IP'}: ${device.name}`}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos comunes */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <Input
              value={form.name ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Antena Corral A"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <Input
              value={form.location ?? ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Ej: Corral Norte"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección IP
            </label>
            <Input
              value={form.ipAddress ?? ''}
              onChange={(e) => handleChange('ipAddress', e.target.value)}
              placeholder="192.168.1.100"
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
              title="Ingrese una dirección IP válida"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puerto
            </label>
            <Input
              type="number"
              value={String(form.port ?? '')}
              onChange={(e) => handleChange('port', e.target.value)}
              placeholder="5000"
              min="1"
              max="65535"
              required
            />
          </div>
        </div>

        {/* Campos específicos por tipo */}
        {isRfid ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia
            </label>
            <Input
              value={rfid.frequency ?? ''}
              onChange={(e) => handleChange('frequency', e.target.value)}
              placeholder="902-928 MHz"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolución
              </label>
              <Input
                value={cam.resolution ?? ''}
                onChange={(e) => handleChange('resolution', e.target.value)}
                placeholder="1920x1080"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de stream (RTSP)
              </label>
              <Input
                value={cam.streamUrl ?? ''}
                onChange={(e) => handleChange('streamUrl', e.target.value)}
                placeholder="rtsp://192.168.1.100/stream"
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  )
}
