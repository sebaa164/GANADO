import type { EventoEstado } from './types'

const CONFIG: Record<EventoEstado, { label: string; className: string }> = {
  activo:         { label: 'Activo',         className: 'bg-orange-100 text-orange-700' },
  en_tratamiento: { label: 'En tratamiento', className: 'bg-yellow-100 text-yellow-700' },
  recuperado:     { label: 'Recuperado',     className: 'bg-green-100 text-green-700' },
  muerto:         { label: 'Muerto',         className: 'bg-gray-200 text-gray-600' },
}

export function EstadoBadge({ estado }: { estado: EventoEstado }) {
  const { label, className } = CONFIG[estado]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
