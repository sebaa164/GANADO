'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAnimalesStore } from '@/stores/animalesStore'

export function AnimalFilters() {
  const { filters, setSearch, setEstado, resetFilters } = useAnimalesStore()

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1">
        <Input
          placeholder="Buscar por RFID o raza..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={filters.estado}
        onChange={(e) =>
          setEstado(e.target.value as 'todos' | 'activo' | 'baja')
        }
        className="h-[42px] px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-green-medium focus:ring-2 focus:ring-green-medium outline-none"
      >
        <option value="todos">Todos</option>
        <option value="activo">Activos</option>
        <option value="baja">De baja</option>
      </select>

      <Button variant="ghost" size="sm" onClick={resetFilters}>
        Limpiar
      </Button>
    </div>
  )
}
