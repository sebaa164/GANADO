'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAnimalesStore } from '@/stores/animalesStore'
import {
  fetchAnimales,
  fetchAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from '@/lib/animalesService'
import type { AnimalFormData } from '@/types/animal'

const ANIMALES_KEY = 'animales'

export function useAnimales() {
  const { filters } = useAnimalesStore()

  const activo =
    filters.estado === 'todos' ? undefined : filters.estado === 'activo'

  return useQuery({
    queryKey: [ANIMALES_KEY, filters],
    queryFn: () =>
      fetchAnimales({
        search: filters.search,
        corral_id: filters.corral_id,
        activo,
        page: filters.page,
        per_page: filters.per_page,
      }),
    placeholderData: (prev) => prev,
  })
}

export function useAnimal(id: number) {
  return useQuery({
    queryKey: [ANIMALES_KEY, id],
    queryFn: () => fetchAnimal(id),
    enabled: !!id,
  })
}

export function useCreateAnimal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AnimalFormData) => createAnimal(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ANIMALES_KEY] })
    },
  })
}

export function useUpdateAnimal(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<AnimalFormData>) => updateAnimal(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ANIMALES_KEY] })
    },
  })
}

export function useDeleteAnimal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAnimal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ANIMALES_KEY] })
    },
  })
}
