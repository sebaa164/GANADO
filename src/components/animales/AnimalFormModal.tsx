'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateAnimal, useUpdateAnimal } from '@/hooks/useAnimales'
import { animalSchema } from '@/types/animal'
import type { AnimalFormData, Animal } from '@/types/animal'

const defaultValues: AnimalFormData = {
  corral_id: 0 as unknown as number,
  codigo_caravana: '',
  raza: '',
  sexo: 'macho',
  fecha_nacimiento: '',
  fecha_ingreso: '',
  peso_ingreso_kg: 0 as unknown as number,
  estado_sanitario: 'sano',
}

interface AnimalFormModalProps {
  isOpen: boolean
  onClose: () => void
  editAnimal?: Animal | null
}

export function AnimalFormModal({
  isOpen,
  onClose,
  editAnimal,
}: AnimalFormModalProps) {
  const createMutation = useCreateAnimal()
  const updateMutation = useUpdateAnimal(editAnimal?.id ?? 0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isOpen) {
      if (editAnimal) {
        reset({
          corral_id: editAnimal.corral_id,
          codigo_caravana: editAnimal.codigo_caravana,
          raza: editAnimal.raza,
          sexo: editAnimal.sexo,
          fecha_nacimiento: editAnimal.fecha_nacimiento.split('T')[0],
          fecha_ingreso: editAnimal.fecha_ingreso.split('T')[0],
          peso_ingreso_kg: editAnimal.peso_ingreso_kg,
          estado_sanitario: editAnimal.estado_sanitario,
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [isOpen, editAnimal, reset])

  const onSubmit = async (data: AnimalFormData) => {
    try {
      if (editAnimal) {
        await updateMutation.mutateAsync(data)
      } else {
        await createMutation.mutateAsync(data)
      }
      onClose()
    } catch {
      /* error handled by React Query */
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAnimal ? 'Editar animal' : 'Nuevo animal'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Código de caravana / RFID"
          placeholder="Ej: AR-123456"
          error={errors.codigo_caravana?.message}
          {...register('codigo_caravana')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Raza"
            placeholder="Ej: Angus"
            error={errors.raza?.message}
            {...register('raza')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Sexo</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-base outline-none focus:border-green-medium focus:ring-2 focus:ring-green-medium"
              {...register('sexo')}
            >
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
            {errors.sexo && (
              <span className="text-xs text-primary" role="alert">
                {errors.sexo.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Fecha de nacimiento"
            type="date"
            error={errors.fecha_nacimiento?.message}
            {...register('fecha_nacimiento')}
          />
          <Input
            label="Fecha de ingreso"
            type="date"
            error={errors.fecha_ingreso?.message}
            {...register('fecha_ingreso')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Peso ingreso (kg)"
            type="number"
            step="0.01"
            error={errors.peso_ingreso_kg?.message}
            {...register('peso_ingreso_kg', { valueAsNumber: true })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Estado sanitario
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-base outline-none focus:border-green-medium focus:ring-2 focus:ring-green-medium"
              {...register('estado_sanitario')}
            >
              <option value="sano">Sano</option>
              <option value="en_observacion">En observación</option>
              <option value="enfermo">Enfermo</option>
            </select>
            {errors.estado_sanitario && (
              <span className="text-xs text-primary" role="alert">
                {errors.estado_sanitario.message}
              </span>
            )}
          </div>
        </div>

        <Input
          label="Corral ID"
          type="number"
          placeholder="ID del corral"
          error={errors.corral_id?.message}
          {...register('corral_id', { valueAsNumber: true })}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" loading={isLoading}>
            {editAnimal ? 'Guardar cambios' : 'Crear animal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
