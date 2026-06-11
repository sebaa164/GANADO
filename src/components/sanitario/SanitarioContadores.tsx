import { HeartPulse, Pill, TrendingDown } from 'lucide-react'
import type { EventoSanitario } from './types'

interface SanitarioContadoresProps {
  eventos: EventoSanitario[]
}

export function SanitarioContadores({ eventos }: SanitarioContadoresProps) {
  const totalEnfermos = eventos.filter(
    e => e.tipo === 'enfermedad' && e.estado !== 'recuperado' && e.estado !== 'muerto'
  ).length

  const tratamientosActivos = eventos.filter(
    e => e.estado === 'en_tratamiento' && !e.tratamientoCerrado
  ).length

  const mesActual = new Date().toISOString().slice(0, 7)
  const muertesEsteMes = eventos.filter(
    e => e.tipo === 'muerte' && e.fecha.startsWith(mesActual)
  ).length

  const stats = [
    {
      label: 'Total enfermos',
      value: totalEnfermos,
      Icon: HeartPulse,
      bg: 'bg-red-500',
      iconBg: 'bg-red-400',
    },
    {
      label: 'Tratamientos activos',
      value: tratamientosActivos,
      Icon: Pill,
      bg: 'bg-amber-400',
      iconBg: 'bg-amber-300',
    },
    {
      label: 'Muertes este mes',
      value: muertesEsteMes,
      Icon: TrendingDown,
      bg: 'bg-slate-500',
      iconBg: 'bg-slate-400',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map(({ label, value, Icon, bg, iconBg }) => (
        <div key={label} className={`rounded-xl p-5 flex items-center gap-4 text-white shadow-md ${bg}`}>
          <div className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 ${iconBg}`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-5xl font-black leading-none">{value}</p>
            <p className="text-sm font-medium mt-1 text-white/80 leading-tight">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
