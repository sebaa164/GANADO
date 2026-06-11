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
    // ── MOCK temporal (quitar cuando el backend esté listo) ──────────────
    const MOCK_USERS: Record<string, LoginResponse> = {
      'admin@ganadovision.com': {
        user: { id: '1', name: 'Admin GanadoVision', email: 'admin@ganadovision.com', role: 'admin' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
      'operador@ganadovision.com': {
        user: { id: '2', name: 'Juan Pérez', email: 'operador@ganadovision.com', role: 'operador' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    }

    const mockUser = MOCK_USERS[credentials.email]
    if (mockUser && credentials.password === 'Admin123!') {
      login(mockUser.user, mockUser.accessToken, mockUser.refreshToken)
      router.push('/dashboard')
      return mockUser
    }
    // ── FIN MOCK ─────────────────────────────────────────────────────────

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
