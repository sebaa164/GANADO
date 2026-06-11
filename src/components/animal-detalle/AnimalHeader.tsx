'use client'

import { Pencil, MapPin, Tag, Weight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { AnimalDetalle } from './mock-animal'

function calcEdad(f: string): string {
  const hoy = new Date(), nac = new Date(f)
  const m = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
  return m < 12 ? `${m} meses` : `${Math.floor(m / 12)}a ${m % 12}m`
}

export function AnimalHeader({ animal, onEdit }: { animal: AnimalDetalle; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-soft p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center shrink-0 border-2 border-green-dark/20">
            <span className="text-3xl font-black text-green-dark">{animal.rfid.slice(-3)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-gray-900">{animal.rfid}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${animal.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {animal.estado === 'activo' ? 'Activo' : 'Baja'}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{animal.raza}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" />Editar</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        {[
          { icon: Weight,   color: 'bg-green-50 text-green-dark', value: `${animal.pesoActual} kg`, label: 'Peso actual' },
          { icon: Calendar, color: 'bg-blue-50 text-blue-600',    value: calcEdad(animal.fechaNacimiento), label: 'Edad' },
          { icon: MapPin,   color: 'bg-amber-50 text-amber-600',  value: animal.corral, label: 'Corral' },
          { icon: Tag,      color: 'bg-purple-50 text-purple-600',value: animal.lote,   label: 'Lote' },
        ].map(({ icon: Icon, color, value, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color.split(' ')[0]}`}>
              <Icon className={`h-4 w-4 ${color.split(' ')[1]}`} />
            </div>
            <div>
              <p className={`text-lg font-black truncate ${color.split(' ')[1]}`}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
