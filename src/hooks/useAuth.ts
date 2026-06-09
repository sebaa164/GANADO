import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/axios'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'supervisor' | 'operador' | 'visualizador'
  }
  accessToken: string
  refreshToken: string
}

export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, accessToken, login, logout: storeLogout } = useAuthStore()

  const loginFn = async (credentials: LoginCredentials) => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    login(data.user, data.accessToken, data.refreshToken)
    router.push('/dashboard')
    return data
  }

  const logoutFn = async () => {
    try {
      // Invalida el token en el backend
      await api.post('/auth/logout')
    } catch {
      // Si falla, igual hacemos logout local
    } finally {
      storeLogout()
      router.push('/login')
    }
  }

  const recoverPassword = async (email: string) => {
    await api.post('/auth/recover-password', { email })
  }

  const resetPassword = async (token: string, password: string) => {
    await api.post('/auth/reset-password', { token, password })
  }

  return {
    user,
    isAuthenticated,
    accessToken,
    login: loginFn,
    logout: logoutFn,
    recoverPassword,
    resetPassword,
  }
}
