import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import type { AlertaAnimal } from './mock-animal'

const SEV = {
  normal:      { icon: CheckCircle,   bg: 'bg-green-50 border-green-100', text: 'text-green-700' },
  advertencia: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700' },
  critico:     { icon: AlertCircle,   bg: 'bg-red-50 border-red-100',     text: 'text-red-700'   },
}

function fmt(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][Number(m)-1]} ${y}`
}

export function AlertasAnimal({ alertas }: { alertas: AlertaAnimal[] }) {
  const activas = alertas.filter(a => !a.resuelta)
  const todas = [...activas, ...alertas.filter(a => a.resuelta)]
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Alertas asociadas</h2>
        {activas.length > 0 && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{activas.length} activa{activas.length > 1 ? 's' : ''}</span>}
      </div>
      {todas.length === 0
        ? <p className="text-sm text-gray-400 text-center py-8">Sin alertas registradas</p>
        : <div className="space-y-3">
            {todas.map(a => {
              const { icon: Icon, bg, text } = SEV[a.severidad]
              return (
                <div key={a.id} className={`flex items-start gap-3 rounded-lg border p-3 ${bg} ${a.resuelta ? 'opacity-50' : ''}`}>
                  <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${text}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${text}`}>{a.tipo}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">{fmt(a.fecha)}</span>
                        {a.resuelta && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Resuelta</span>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{a.descripcion}</p>
                  </div>
                </div>
              )
            })}
          </div>
      }
    </div>
  )
}
