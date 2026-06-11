'use client'

import { useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import Link from 'next/link'
import { Pencil, Trash2, Eye } from 'lucide-react'
import type { Animal } from './types'

interface AnimalesTableProps {
  animales: Animal[]
  onEdit: (animal: Animal) => void
  onDelete: (id: string) => void
}

function calcEdad(fechaNacimiento: string): string {
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  const meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
  if (meses < 12) return `${meses}m`
  return `${Math.floor(meses / 12)}a ${meses % 12}m`
}

const COLUMNS = ['RFID', 'Raza', 'Edad', 'Peso', 'Corral', 'Lote', 'Estado', 'Acciones']
const COL_WIDTHS = ['15%', '13%', '9%', '9%', '9%', '14%', '10%', '13%']
const ROW_HEIGHT = 52
const TABLE_HEIGHT = 420

export function AnimalesTable({ animales, onEdit, onDelete }: AnimalesTableProps) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const animal = animales[index]
    const isEven = index % 2 === 0
    return (
      <div style={style} className={`flex items-center border-b border-gray-100 text-sm ${isEven ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}>
        <div style={{ width: COL_WIDTHS[0] }} className="px-4 font-mono font-semibold text-green-dark truncate">{animal.rfid}</div>
        <div style={{ width: COL_WIDTHS[1] }} className="px-4 text-gray-700 truncate">{animal.raza}</div>
        <div style={{ width: COL_WIDTHS[2] }} className="px-4 text-gray-600">{calcEdad(animal.fechaNacimiento)}</div>
        <div style={{ width: COL_WIDTHS[3] }} className="px-4 text-gray-700 font-medium">{animal.pesoUltimo} kg</div>
        <div style={{ width: COL_WIDTHS[4] }} className="px-4 text-gray-600">{animal.corral}</div>
        <div style={{ width: COL_WIDTHS[5] }} className="px-4 text-gray-600 truncate">{animal.lote}</div>
        <div style={{ width: COL_WIDTHS[6] }} className="px-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${animal.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {animal.estado === 'activo' ? 'Activo' : 'Baja'}
          </span>
        </div>
        <div style={{ width: COL_WIDTHS[7] }} className="px-4 flex items-center gap-2">
          <Link href={`/animales/${animal.rfid}`} className="p-1.5 rounded-lg text-gray-500 hover:text-green-dark hover:bg-green-50 transition-colors" title="Ver detalle">
            <Eye className="h-4 w-4" />
          </Link>
          <button onClick={() => onEdit(animal)} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Editar">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(animal.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }, [animales, onEdit, onDelete])

  if (animales.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-lg font-semibold text-gray-500">No se encontraron animales</p>
        <p className="text-sm text-gray-400 mt-1">Probá con otros filtros o registrá un nuevo animal</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-soft">
      <div className="flex bg-gray-100 border-b border-gray-200">
        {COLUMNS.map((col, i) => (
          <div key={col} style={{ width: COL_WIDTHS[i] }} className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">{col}</div>
        ))}
      </div>
      <List height={Math.min(TABLE_HEIGHT, animales.length * ROW_HEIGHT)} itemCount={animales.length} itemSize={ROW_HEIGHT} width="100%">
        {Row}
      </List>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        {animales.length} {animales.length === 1 ? 'animal' : 'animales'}
      </div>
    </div>
  )
}
