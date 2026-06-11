'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { RegistroPeso } from './mock-animal'

export function PesoChart({ historial }: { historial: RegistroPeso[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-soft p-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">Evolución de peso</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={historial} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={v => `${v}kg`} />
          <Tooltip formatter={(v: number) => [`${v} kg`, 'Peso']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }} />
          <Line type="monotone" dataKey="peso" stroke="#2D6A2D" strokeWidth={2.5} dot={{ fill: '#2D6A2D', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
