import { ArrowRightLeft, LogIn, LogOut } from 'lucide-react'
import type { Movimiento } from './mock-animal'

const TIPO_CONFIG = {
  traslado: { icon: ArrowRightLeft, color: 'bg-blue-100 text-blue-600',   label: 'Traslado' },
  ingreso:  { icon: LogIn,          color: 'bg-green-100 text-green-700', label: 'Ingreso'  },
  egreso:   { icon: LogOut,         color: 'bg-red-100 text-red-600',     label: 'Egreso'   },
}

function fmt(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][Number(m)-1]} ${y}`
}

export function MovimientosTimeline({ movimientos }: { movimientos: Movimiento[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-soft p-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">Historial de movimientos</h2>
      {movimientos.length === 0
        ? <p className="text-sm text-gray-400 text-center py-8">Sin movimientos registrados</p>
        : <div className="space-y-3">
            {movimientos.map(mov => {
              const { icon: Icon, color, label } = TIPO_CONFIG[mov.tipo]
              return (
                <div key={mov.id} className="flex items-start gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-900">{label}</span>
                      <span className="text-xs text-gray-400 shrink-0">{fmt(mov.fecha)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{mov.desde ? `${mov.desde} → ${mov.hacia}` : mov.hacia}</p>
                    {mov.observacion && <p className="text-xs text-gray-400 mt-0.5">{mov.observacion}</p>}
                  </div>
                </div>
              )
            })}
          </div>
      }
    </div>
  )
}
