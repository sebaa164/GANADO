'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temp: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  city: string
}

interface WeatherState {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

function getWeatherDescription(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Despejado', icon: '☀️' }
  if (code <= 2) return { description: 'Parcialmente nublado', icon: '⛅' }
  if (code === 3) return { description: 'Nublado', icon: '☁️' }
  if (code <= 49) return { description: 'Neblina', icon: '🌫️' }
  if (code <= 59) return { description: 'Llovizna', icon: '🌦️' }
  if (code <= 69) return { description: 'Lluvia', icon: '🌧️' }
  if (code <= 79) return { description: 'Nieve', icon: '❄️' }
  if (code <= 84) return { description: 'Chubascos', icon: '🌧️' }
  if (code <= 99) return { description: 'Tormenta', icon: '⛈️' }
  return { description: 'Desconocido', icon: '🌡️' }
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ data: null, loading: false, error: 'Geolocalización no disponible' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords

          // Obtener clima y nombre de ciudad en paralelo
          const [weatherRes, geoRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`),
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`),
          ])

          if (!weatherRes.ok) throw new Error('Error al obtener clima')
          const weatherJson = await weatherRes.json()
          const current = weatherJson.current
          const { description, icon } = getWeatherDescription(current.weather_code)

          // Extraer nombre de ciudad del geocoding
          let city = 'Mi ubicación'
          if (geoRes.ok) {
            const geoJson = await geoRes.json()
            city =
              geoJson.address?.city ||
              geoJson.address?.town ||
              geoJson.address?.village ||
              geoJson.address?.county ||
              geoJson.address?.state ||
              'Mi ubicación'
          }

          setState({
            data: {
              temp: Math.round(current.temperature_2m),
              humidity: current.relative_humidity_2m,
              windSpeed: Math.round(current.wind_speed_10m),
              description,
              icon,
              city,
            },
            loading: false,
            error: null,
          })
        } catch {
          setState({ data: null, loading: false, error: 'No se pudo obtener el clima' })
        }
      },
      () => {
        setState({ data: null, loading: false, error: 'Permiso de ubicación denegado' })
      },
      { timeout: 8000 }
    )
  }, [])

  return state
}
