'use client'

import dynamic from 'next/dynamic'

const MapaBase = dynamic(
  () => import('@/components/mapa-interactivo/MapaBase').then((m) => ({ default: m.MapaBase })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400" style={{ minHeight: '600px' }}>
        <div className="text-center">
          <svg className="w-10 h-10 mx-auto mb-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-sm">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
)

export default MapaBase
