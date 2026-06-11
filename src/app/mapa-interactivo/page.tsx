'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { FiltrosMapa, PanelAnimal } from '@/components/mapa-interactivo'
import MapaDinamico from '@/components/mapa-interactivo/MapaDinamico'

export default function MapaInteractivoPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mapa interactivo</h1>
        </div>

        <FiltrosMapa />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3">
            <MapaDinamico />
          </div>
          <div className="xl:col-span-1 space-y-4">
            <PanelAnimal />

            {/* Leyenda */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-soft">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Leyenda</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-dark inline-block" />
                  Animal sano
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                  Alerta
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  Crítico
                </p>
                <hr className="my-2 border-gray-100" />
                <p className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow inline-block" />
                  Antena activa
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow inline-block" />
                  Antena offline
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow inline-block" />
                  Antena mantenimiento
                </p>
                <hr className="my-2 border-gray-100" />
                <p className="flex items-center gap-2 text-gray-400 italic">
                  Hacé clic en un animal para ver su información
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
