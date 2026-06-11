import { Syringe, Pill, Activity, Skull } from 'lucide-react'
import type { EventoTipo } from './types'

const CONFIG: Record<EventoTipo, {
  icon: React.ComponentType<{ className?: string }>
  color: string
  label: string
}> = {
  vacuna:      { icon: Syringe,  color: 'bg-blue-100 text-blue-600',   label: 'Vacuna' },
  tratamiento: { icon: Pill,     color: 'bg-amber-100 text-amber-600', label: 'Tratamiento' },
  enfermedad:  { icon: Activity, color: 'bg-red-100 text-red-600',     label: 'Enfermedad' },
  muerte:      { icon: Skull,    color: 'bg-gray-200 text-gray-500',   label: 'Muerte' },
}

const SIZES = {
  sm: { container: 'h-8 w-8',   icon: 'h-4 w-4' },
  md: { container: 'h-10 w-10', icon: 'h-5 w-5' },
  lg: { container: 'h-12 w-12', icon: 'h-6 w-6' },
}

interface EventoIconProps {
  tipo: EventoTipo
  size?: 'sm' | 'md' | 'lg'
}

export function EventoIcon({ tipo, size = 'md' }: EventoIconProps) {
  const { icon: Icon, color, label } = CONFIG[tipo]
  const { container, icon } = SIZES[size]
  return (
    <span
      className={`flex items-center justify-center rounded-full ${container} ${color} shrink-0`}
      aria-label={label}
    >
      <Icon className={icon} />
    </span>
  )
}

export function eventoLabel(tipo: EventoTipo): string {
  return CONFIG[tipo].label
}
