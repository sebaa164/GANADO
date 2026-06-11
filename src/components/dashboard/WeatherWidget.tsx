'use client'

import React from 'react'
import { useWeather } from '@/hooks/useWeather'

const card = 'rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'

export function WeatherWidget() {
  const { data, loading, error } = useWeather()

  if (loading) {
    return (
      <div className={card}>
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">Clima Actual</h2>
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="space-y-1">
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-600 rounded" />
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Obteniendo ubicación...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={card}>
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Clima Actual</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500">{error ?? 'Sin datos'}</p>
      </div>
    )
  }

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white">Clima Actual</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">📍 {data.city}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{data.icon}</span>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{data.temp}°C</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{data.description}</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">💧 Humedad</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">{data.humidity}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">💨 Viento</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">{data.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}
