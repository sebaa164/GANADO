import api from './axios'
import type { Animal, AnimalFormData, PaginatedResponse } from '@/types/animal'

export interface FetchAnimalesParams {
  search?: string
  corral_id?: number | null
  activo?: boolean
  page?: number
  per_page?: number
}

export async function fetchAnimales(
  params: FetchAnimalesParams = {}
): Promise<PaginatedResponse<Animal>> {
  const { data } = await api.get<PaginatedResponse<Animal>>('/animales', {
    params: {
      search: params.search || undefined,
      corral_id: params.corral_id || undefined,
      activo: params.activo,
      page: params.page || 1,
      per_page: params.per_page || 50,
    },
  })
  return data
}

export async function fetchAnimal(id: number): Promise<Animal> {
  const { data } = await api.get<Animal>(`/animales/${id}`)
  return data
}

export async function createAnimal(
  payload: AnimalFormData
): Promise<Animal> {
  const { data } = await api.post<Animal>('/animales', payload)
  return data
}

export async function updateAnimal(
  id: number,
  payload: Partial<AnimalFormData>
): Promise<Animal> {
  const { data } = await api.put<Animal>(`/animales/${id}`, payload)
  return data
}

export async function deleteAnimal(id: number): Promise<void> {
  await api.delete(`/animales/${id}`)
}
