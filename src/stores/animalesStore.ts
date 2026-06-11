import { create } from 'zustand'
import type { AnimalFiltersState } from '@/types/animal'

interface AnimalesStore {
  filters: AnimalFiltersState
  setSearch: (search: string) => void
  setCorralId: (corral_id: number | null) => void
  setEstado: (estado: 'todos' | 'activo' | 'baja') => void
  setPage: (page: number) => void
  resetFilters: () => void
}

const initialFilters: AnimalFiltersState = {
  search: '',
  corral_id: null,
  estado: 'todos',
  page: 1,
  per_page: 50,
}

export const useAnimalesStore = create<AnimalesStore>((set) => ({
  filters: { ...initialFilters },
  setSearch: (search) =>
    set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
  setCorralId: (corral_id) =>
    set((s) => ({ filters: { ...s.filters, corral_id, page: 1 } })),
  setEstado: (estado) =>
    set((s) => ({ filters: { ...s.filters, estado, page: 1 } })),
  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
  resetFilters: () => set({ filters: { ...initialFilters } }),
}))
