'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { animalSchema, type AnimalFormData } from './animal-schema'
import type { Animal } from './types'

interface NuevoAnimalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Animal) => void
  initialData?: Animal | null
}

export function NuevoAnimalModal({ isOpen, onClose, onSave, initialData }: NuevoAnimalModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: initialData
      ? { rfid: initialData.rfid, raza: initialData.raza, fechaNacimiento: initialData.fechaNacimiento, pesoUltimo: initialData.pesoUltimo, corral: initialData.corral, lote: initialData.lote, estado: initialData.estado }
      : { rfid: '', raza: '', fechaNacimiento: '', pesoUltimo: 0, corral: '', lote: '', estado: 'activo' },
  })

  const onSubmit = (data: AnimalFormData) => {
    onSave({ id: initialData?.id ?? crypto.randomUUID(), ...data })
    reset()
    onClose()
  }

  const handleClose = () => { reset(); onClose() }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'Editar animal' : 'Nuevo animal'} className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="RFID" placeholder="GV-001" error={errors.rfid?.message} {...register('rfid')} />
          <Input label="Raza" placeholder="Angus" error={errors.raza?.message} {...register('raza')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Fecha de nacimiento" type="date" error={errors.fechaNacimiento?.message} {...register('fechaNacimiento')} />
          <Input label="Peso último (kg)" type="number" placeholder="450" error={errors.pesoUltimo?.message} {...register('pesoUltimo', { valueAsNumber: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Corral" placeholder="A1" error={errors.corral?.message} {...register('corral')} />
          <Input label="Lote" placeholder="Lote Norte" error={errors.lote?.message} {...register('lote')} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="estado">Estado</label>
          <select id="estado" className="w-full px-3 py-2 rounded-md border border-gray-300 text-base bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500" {...register('estado')}>
            <option value="activo">Activo</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" size="sm" type="submit">{initialData ? 'Guardar cambios' : 'Crear animal'}</Button>
        </div>
      </form>
    </Modal>
  )
}
