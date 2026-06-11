'use client'

import React from 'react'
import { WeatherWidget } from './WeatherWidget'
import { KpiCard } from './KpiCard'
import { useWeather } from '@/hooks/useWeather'
import { useDashboardWebSocket } from '@/hooks/useDashboardWebSocket'

const pesoData = [
  { fecha: '12 May', valor: 345 }, { fecha: '14 May', valor: 358 },
  { fecha: '16 May', valor: 362 }, { fecha: '19 May', valor: 370 },
  { fecha: '21 May', valor: 375 }, { fecha: '23 May', valor: 382 },
  { fecha: '26 May', valor: 390 }, { fecha: '28 May', valor: 398 },
  { fecha: '30 May', valor: 405 }, { fecha: '02 Jun', valor: 415 },
  { fecha: '04 Jun', valor: 428 }, { fecha: '07 Jun', valor: 438 },
  { fecha: '09 Jun', valor: 450 },
]

const animalesRecientes = [
  { nombre: 'Bruno',    tipo: 'Toro · Angus',    peso: '550 kg', fecha: '11/06/2026', img: '🐂' },
  { nombre: 'Luna',     tipo: 'Vaca · Holstein', peso: '480 kg', fecha: '11/06/2026', img: '🐄' },
  { nombre: 'Margarita',tipo: 'Vaca · Brahman',  peso: '450 kg', fecha: '10/06/2026', img: '🐄' },
  { nombre: 'Simba',    tipo: 'Toro · Angus',    peso: '570 kg', fecha: '10/06/2026', img: '🐂' },
  { nombre: 'Estrella', tipo: 'Vaca · Holstein', peso: '470 kg', fecha: '09/06/2026', img: '🐄' },
]

const alertasRecientes = [
  { titulo: 'Temperatura elevada en corral 2', sub: 'Corral 2',         tiempo: 'Hace 15 min' },
  { titulo: 'Animal fuera de rango de peso',   sub: 'Bruno (ID: 1023)', tiempo: 'Hace 1 h'    },
  { titulo: 'Cambio climático detectado',       sub: 'Humedad alta',    tiempo: 'Hace 3 h'    },
]

function LineChart() {
  const w = 400, h = 180, padX = 36, padY = 16
  const chartW = w - padX * 2, chartH = h - padY * 2
  const minVal = 300, maxVal = 500

  const points = pesoData.map((d, i) => ({
    x: padX + (i / (pesoData.length - 1)) * chartW,
    y: padY + chartH - ((d.valor - minVal) / (maxVal - minVal)) * chartH,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`
  const yLabels = [300, 350, 400, 450, 500]
  const xLabels = ['12 May', '19 May', '26 May', '02 Jun', '09 Jun']

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: '180px' }}>
      {yLabels.map(val => {
        const y = padY + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
        return (
          <g key={val}>
            <line x1={padX} y1={y} x2={w - padX} y2={y} stroke="#374151" strokeWidth="1" strokeOpacity="0.3" />
            <text x={padX - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{val}</text>
          </g>
        )
      })}
      {xLabels.map((label, i) => (
        <text key={label} x={padX + (i / (xLabels.length - 1)) * chartW} y={h - 2} textAnchor="middle" fontSize="9" fill="#9ca3af">{label}</text>
      ))}
      <path d={areaPath} fill="#2D6A2D" fillOpacity="0.12" />
      <path d={linePath} fill="none" stroke="#2D6A2D" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="#2D6A2D" />
      <rect x={points[points.length - 1].x - 20} y={points[points.length - 1].y - 20} width="40" height="16" rx="4" fill="#2D6A2D" />
      <text x={points[points.length - 1].x} y={points[points.length - 1].y - 9} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">450 kg</text>
    </svg>
  )
}

// Clase reutilizable para las cards
const card = 'rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'

export function DashboardContent() {
  const weather = useWeather()
  const { metrics, status: wsStatus, hasData } = useDashboardWebSocket()

  return (
    <div className="space-y-4 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bienvenido, Juan Pérez</p>
      </div>

      {/* ── Live KPI cards via WebSocket ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Peso Promedio"
          value={metrics.peso_promedio_kg}
          unit="kg"
          decimals={1}
          icon="🐄"
          color="#639922"
          hasData={hasData}
          wsStatus={wsStatus}
          trend="Últimos 30 días"
        />
        <KpiCard
          label="Animales Activos"
          value={metrics.animales_activos}
          icon="🐂"
          color="#3B6D11"
          hasData={hasData}
          wsStatus={wsStatus}
          trend="En producción"
        />
        <KpiCard
          label="Alertas Activas"
          value={metrics.alertas_activas}
          icon="🔔"
          color="#BA7517"
          hasData={hasData}
          wsStatus={wsStatus}
          trend="Requieren atención"
        />
        <KpiCard
          label="Temperatura Ambiente"
          value={metrics.temperatura_ambiente_c}
          unit="°C"
          decimals={1}
          formatNumber={false}
          icon="🌡️"
          color="#C0DD97"
          hasData={hasData}
          wsStatus={wsStatus}
          trend="Promedio del día"
        />
      </div>

      {/* Fila principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Gráfico */}
        <div className={card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Evolución del Peso Promedio</h2>
            <select className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 outline-none">
              <option>Últimos 30 días</option>
              <option>Últimos 60 días</option>
            </select>
          </div>
          <LineChart />
        </div>

        {/* Columna derecha */}
        <div className="space-y-3">

          {/* Animales recientes */}
          <div className={card}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Últimos Animales</h2>
              <a href="/animales" className="text-xs font-medium" style={{ color: '#2D6A2D' }}>Ver todos</a>
            </div>
            <ul className="space-y-2">
              {animalesRecientes.map((a) => (
                <li key={a.nombre} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-sm shrink-0">{a.img}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{a.nombre}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{a.tipo}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{a.peso}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{a.fecha}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Alertas + Clima */}
          <div className="grid grid-cols-2 gap-3">

            <div className={card}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-gray-900 dark:text-white">Alertas Recientes</h2>
                <a href="/alertas" className="text-xs text-red-500">Ver todas</a>
              </div>
              <ul className="space-y-2">
                {alertasRecientes.map((alerta) => (
                  <li key={alerta.titulo} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-snug">{alerta.titulo}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{alerta.sub} · {alerta.tiempo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <WeatherWidget />

          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-2">
        © 2026 GanadoVision. Todos los derechos reservados.
      </p>
    </div>
  )
}
