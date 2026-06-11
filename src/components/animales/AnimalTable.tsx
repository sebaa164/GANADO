'use client'

import { useState, useCallback } from 'react'
import { List, useListRef } from 'react-window'
import type { RowComponentProps } from 'react-window'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAnimales } from '@/hooks/useAnimales'
import { useAnimalesStore } from '@/stores/animalesStore'
import type { Animal } from '@/types/animal'

const ROW_HEIGHT = 56
const COLUMNS = [
  { label: 'RFID / Caravana', width: 160 },
  { label: 'Raza', width: 130 },
  { label: 'Edad', width: 90 },
  { label: 'Último peso', width: 110 },
  { label: 'Corral', width: 120 },
  { label: 'Estado', width: 100 },
  { label: 'Acciones', width: 140 },
]

const estadoBadge: Record<string, string> = {
  sano: 'bg-green-100 text-green-dark',
  en_observacion: 'bg-yellow-100 text-yellow-800',
  enfermo: 'bg-red-100 text-primary',
}

function calcularEdad(fechaNac: string): string {
  const diff = Date.now() - new Date(fechaNac).getTime()
  const meses = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
  if (meses < 12) return `${meses} meses`
  const años = Math.floor(meses / 12)
  return `${años}a ${meses % 12}m`
}

interface RowProps {
  index: number
  style: React.CSSProperties
  data: {
    animales: Animal[]
    onEdit: (a: Animal) => void
    onView: (id: number) => void
  }
}

function AnimalRow({ index, style, data }: RowProps) {
  const animal = data.animales[index]
  if (!animal) return null

  return (
    <div
      style={style}
      className="flex items-center border-b border-gray-100 hover:bg-gray-50 text-sm"
    >
      <div className="px-3 truncate" style={{ width: COLUMNS[0].width }}>
        <span className="font-medium text-gray-900">
          {animal.codigo_caravana}
        </span>
      </div>
      <div className="px-3 truncate" style={{ width: COLUMNS[1].width }}>
        {animal.raza}
      </div>
      <div className="px-3 truncate" style={{ width: COLUMNS[2].width }}>
        {calcularEdad(animal.fecha_nacimiento)}
      </div>
      <div className="px-3 truncate" style={{ width: COLUMNS[3].width }}>
        {animal.ultimo_peso
          ? `${animal.ultimo_peso.peso_kg} kg`
          : `${animal.peso_ingreso_kg} kg`}
      </div>
      <div className="px-3 truncate" style={{ width: COLUMNS[4].width }}>
        {animal.corral?.nombre ?? `#${animal.corral_id}`}
      </div>
      <div className="px-3" style={{ width: COLUMNS[5].width }}>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
            estadoBadge[animal.estado_sanitario] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {animal.estado_sanitario.replace('_', ' ')}
        </span>
      </div>
      <div
        className="px-3 flex gap-1 items-center"
        style={{ width: COLUMNS[6].width }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => data.onView(animal.id)}
        >
          Ver
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => data.onEdit(animal)}
        >
          Editar
        </Button>
      </div>
    </div>
  )
}

interface AnimalTableProps {
  onEdit: (animal: Animal) => void
  onNew: () => void
}

export function AnimalTable({ onEdit, onNew }: AnimalTableProps) {
  const { data, isLoading, isError, error } = useAnimales()
  const { filters, setPage } = useAnimalesStore()
  const listRef = useListRef(null)
  const [rowHovered, setRowHovered] = useState<number | null>(null)

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12 text-gray-500">
          Cargando animales...
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <div className="flex flex-col items-center py-12 gap-3">
          <p className="text-red-600 font-medium">
            Error al cargar animales
          </p>
          <p className="text-sm text-gray-500">
            {(error as { message?: string })?.message ?? 'Intentalo de nuevo'}
          </p>
        </div>
      </Card>
    )
  }

  const animales = data?.data ?? []
  const total = data?.total ?? 0
  const lastPage = data?.last_page ?? 1

  if (animales.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center py-12 gap-3">
          <p className="text-gray-500">No se encontraron animales</p>
          <Button variant="primary" size="sm" onClick={onNew}>
            + Nuevo animal
          </Button>
        </div>
      </Card>
    )
  }

  const rowComponent = useCallback(
    ({ index, style, animales: listAnimales, onEdit: editFn }: RowComponentProps<{ animales: Animal[]; onEdit: (a: Animal) => void }>) => {
      const animal = listAnimales[index]
      if (!animal) return null

      return (
        <div
          style={style}
          className={`flex items-center border-b border-gray-100 text-sm ${
            rowHovered === index ? 'bg-gray-50' : ''
          }`}
          onMouseEnter={() => setRowHovered(index)}
          onMouseLeave={() => setRowHovered(null)}
        >
          <div className="px-3 truncate" style={{ width: COLUMNS[0].width }}>
            <span className="font-medium text-gray-900">
              {animal.codigo_caravana}
            </span>
          </div>
          <div className="px-3 truncate" style={{ width: COLUMNS[1].width }}>
            {animal.raza}
          </div>
          <div className="px-3 truncate" style={{ width: COLUMNS[2].width }}>
            {calcularEdad(animal.fecha_nacimiento)}
          </div>
          <div className="px-3 truncate" style={{ width: COLUMNS[3].width }}>
            {animal.ultimo_peso
              ? `${animal.ultimo_peso.peso_kg} kg`
              : `${animal.peso_ingreso_kg} kg`}
          </div>
          <div className="px-3 truncate" style={{ width: COLUMNS[4].width }}>
            {animal.corral?.nombre ?? `#${animal.corral_id}`}
          </div>
          <div className="px-3" style={{ width: COLUMNS[5].width }}>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                estadoBadge[animal.estado_sanitario] ??
                'bg-gray-100 text-gray-600'
              }`}
            >
              {animal.estado_sanitario.replace('_', ' ')}
            </span>
          </div>
          <div
            className="px-3 flex gap-1 items-center"
            style={{ width: COLUMNS[6].width }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(`/animales/${animal.id}`, '_self')
              }
            >
              Ver
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => editFn(animal)}
            >
              Editar
            </Button>
          </div>
        </div>
      )
    },
    [rowHovered]
  )

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {COLUMNS.map((col) => (
          <div
            key={col.label}
            className="px-3 py-3 truncate"
            style={{ width: col.width }}
          >
            {col.label}
          </div>
        ))}
      </div>

      <div style={{ height: Math.min(animales.length * ROW_HEIGHT, 560) }}>
        <List
          listRef={listRef}
          rowCount={animales.length}
          rowHeight={ROW_HEIGHT}
          rowComponent={rowComponent}
          rowProps={{ animales, onEdit }}
          overscanCount={5}
          tagName="div"
        />
      </div>

      <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
        <span>
          {total} animal{total !== 1 ? 'es' : ''} — Pág. {filters.page} de{' '}
          {lastPage}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => setPage(filters.page - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={filters.page >= lastPage}
            onClick={() => setPage(filters.page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Card>
  )
}
