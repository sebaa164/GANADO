'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { EventoTipo, EventoEstado, NuevoEventoForm } from './types'

interface NuevoEventoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: NuevoEventoForm) => void
}

const TIPOS: { value: EventoTipo; label: string }[] = [
  { value: 'enfermedad',  label: 'Enfermedad' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'vacuna',      label: 'Vacuna' },
  { value: 'muerte',      label: 'Muerte' },
]

const ESTADOS: { value: EventoEstado; label: string }[] = [
  { value: 'activo',          label: 'Activo' },
  { value: 'en_tratamiento',  label: 'En tratamiento' },
  { value: 'recuperado',      label: 'Recuperado' },
  { value: 'muerto',          label: 'Muerto' },
]

const INITIAL: NuevoEventoForm = {
  tipo: 'enfermedad',
  fecha: new Date().toISOString().split('T')[0],
  descripcion: '',
  estado: 'activo',
  medicamento: '',
  veterinario: '',
}

export function NuevoEventoModal({ isOpen, onClose, onSave }: NuevoEventoModalProps) {
  const [form, setForm] = useState<NuevoEventoForm>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof NuevoEventoForm, string>>>({})

  const set = (field: keyof NuevoEventoForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!form.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria.'
    if (!form.fecha) newErrors.fecha = 'La fecha es obligatoria.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form)
    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar evento sanitario" className="max-w-lg">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="evento-tipo">Tipo de evento</label>
          <select
            id="evento-tipo"
            value={form.tipo}
            onChange={e => set('tipo', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-base bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
          >
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <Input
          label="Fecha"
          type="date"
          id="evento-fecha"
          value={form.fecha}
          onChange={e => set('fecha', e.target.value)}
          error={errors.fecha}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="evento-desc">Descripción</label>
          <textarea
            id="evento-desc"
            rows={3}
            value={form.descripcion}
            onChange={e => set('descripcion', e.target.value)}
            placeholder="Describí el evento sanitario..."
            className={`w-full px-3 py-2 rounded-md border text-base bg-white outline-none resize-none transition-colors
              ${errors.descripcion ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'}`}
          />
          {errors.descripcion && <span className="text-xs text-red-500">{errors.descripcion}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="evento-estado">Estado</label>
          <select
            id="evento-estado"
            value={form.estado}
            onChange={e => set('estado', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-base bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
          >
            {ESTADOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <Input
          label="Medicamento (opcional)"
          id="evento-medicamento"
          value={form.medicamento ?? ''}
          onChange={e => set('medicamento', e.target.value)}
          placeholder="Nombre y dosis"
        />

        <Input
          label="Veterinario (opcional)"
          id="evento-veterinario"
          value={form.veterinario ?? ''}
          onChange={e => set('veterinario', e.target.value)}
          placeholder="Nombre del profesional"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>Guardar evento</Button>
        </div>
      </div>
    </Modal>
  )
}

