'use client'

import React from 'react'
import { useMonitoreoStore } from '@/stores/monitoreoStore'

export function AlertNotification() {
  const notificaciones = useMonitoreoStore((s) => s.notificaciones)
  const descartarNotificacion = useMonitoreoStore((s) => s.descartarNotificacion)

  if (notificaciones.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2 max-w-sm w-full pointer-events-none">
      {notificaciones.map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            notif.visible
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          } ${notif.tipo === 'critica' ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-500'}`}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className={`w-5 h-5 ${notif.tipo === 'critica' ? 'text-red-500' : 'text-yellow-500'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{notif.titulo}</p>
              <p className="text-xs text-gray-500 mt-0.5">{notif.mensaje}</p>
              <p className="text-[10px] text-gray-400 mt-1">{notif.hora}</p>
            </div>
            <button
              onClick={() => descartarNotificacion(notif.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
