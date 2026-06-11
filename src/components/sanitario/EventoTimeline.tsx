'use client'

import { EventoIcon, eventoLabel } from './EventoIcon'
import { EstadoBadge } from './EstadoBadge'
import { Button } from '@/components/ui/Button'
import type { EventoSanitario } from './types'

interface EventoTimelineProps {
  eventos: EventoSanitario[]
  onCerrarTratamiento: (id: string) => void
}

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split('-')
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${d} ${meses[Number(m) - 1]} ${y}`
}

const TIPO_CARD: Record<string, string> = {
  vacuna:      'bg-blue-50 border-blue-100',
  tratamiento: 'bg-amber-50 border-amber-100',
  enfermedad:  'bg-red-50 border-red-100',
  muerte:      'bg-gray-100 border-gray-200',
}

export function EventoTimeline({ eventos, onCerrarTratamiento }: EventoTimelineProps) {
  if (eventos.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200">
        <p className="text-lg font-semibold text-gray-500">Sin eventos para este filtro</p>
        <p className="text-sm text-gray-400 mt-1">Registrá un nuevo evento con el botón de arriba</p>
      </div>
    )
  }

  const sorted = [...eventos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  return (
    <div className="space-y-3">
      {sorted.map((evento) => (
        <div
          key={evento.id}
          className={`flex gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md ${TIPO_CARD[evento.tipo] ?? 'bg-white border-gray-200'}`}
        >
          <div className="mt-0.5 shrink-0">
            <EventoIcon tipo={evento.tipo} size="lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-base font-bold text-gray-900">{eventoLabel(evento.tipo)}</span>
              <EstadoBadge estado={evento.estado} />
              <span className="text-xs text-gray-400 ml-auto font-medium">{formatFecha(evento.fecha)}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{evento.descripcion}</p>
            {(evento.medicamento || evento.veterinario) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {evento.medicamento && (
                  <span className="inline-flex items-center text-xs font-semibold bg-white/70 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
                    {evento.medicamento}
                  </span>
                )}
                {evento.veterinario && (
                  <span className="inline-flex items-center text-xs font-semibold bg-white/70 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
                    {evento.veterinario}
                  </span>
                )}
              </div>
            )}
            {evento.estado === 'en_tratamiento' && !evento.tratamientoCerrado && (
              <div className="pt-3 border-t border-black/5">
                <Button variant="ghost" size="sm" onClick={() => onCerrarTratamiento(evento.id)}>
                  Cerrar tratamiento
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
