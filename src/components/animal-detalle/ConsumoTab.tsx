import { Utensils } from 'lucide-react'

export function ConsumoTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-soft p-6">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="h-5 w-5 text-green-dark" />
        <h2 className="text-base font-bold text-gray-900">Consumo de alimentación</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
          <p className="text-3xl font-black text-green-dark">12.4</p>
          <p className="text-xs text-gray-500 mt-1">kg/día promedio</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
          <p className="text-3xl font-black text-blue-600">87</p>
          <p className="text-xs text-gray-500 mt-1">min/día en comedero</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
          <p className="text-3xl font-black text-amber-600">+3%</p>
          <p className="text-xs text-gray-500 mt-1">vs promedio del lote</p>
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-500">Datos detallados disponibles cuando se integre el backend de consumo (BE-2.4)</p>
      </div>
    </div>
  )
}
