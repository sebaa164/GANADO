import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// Extiende el config para agregar la flag de reintento
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ─── Request interceptor ─────────────────────────────────────────────────────
// Adjunta el accessToken desde el store de Zustand (en memoria, no localStorage)
api.interceptors.request.use((config) => {
  // Importación dinámica para evitar problemas de SSR
  if (typeof window !== 'undefined') {
    try {
      const raw = JSON.parse(localStorage.getItem('auth-storage') ?? '{}')
      const accessToken: string | undefined = raw?.state?.accessToken
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    } catch {
      // Si el storage no está disponible continuamos sin token
    }
  }
  return config
})

// ─── Response interceptor ────────────────────────────────────────────────────
// Si el server responde 401, intenta refrescar el token de forma transparente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetryConfig

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const raw = JSON.parse(localStorage.getItem('auth-storage') ?? '{}')
        const refreshToken: string | undefined = raw?.state?.refreshToken

        if (!refreshToken) throw new Error('No refresh token available')

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/auth/refresh`,
          { refreshToken }
        )

        // Actualiza el accessToken en el store y en el storage
        const currentRaw = JSON.parse(localStorage.getItem('auth-storage') ?? '{}')
        if (currentRaw?.state) {
          currentRaw.state.accessToken = data.accessToken
          localStorage.setItem('auth-storage', JSON.stringify(currentRaw))
        }

        // Reintenta la petición original con el nuevo token
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        // Refresh falló → limpia store y redirige al login
        localStorage.removeItem('auth-storage')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
