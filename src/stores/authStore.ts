import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'supervisor' | 'operador' | 'visualizador'
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: AuthUser) => void
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateAccessToken: (accessToken: string) => void
}

/** Writes the isAuthenticated flag into a cookie so the middleware can read it. */
function syncAuthCookie(isAuthenticated: boolean) {
  if (typeof document === 'undefined') return
  if (isAuthenticated) {
    // SameSite=Lax is enough; path=/ so all routes can read it.
    // Not HttpOnly intentionally — the client needs to write it.
    document.cookie = 'auth-storage=%7B%22state%22%3A%7B%22isAuthenticated%22%3Atrue%7D%7D; path=/; SameSite=Lax'
  } else {
    // Expire the cookie immediately
    document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => {
        syncAuthCookie(true)
        set({ user, isAuthenticated: true })
      },

      login: (user, accessToken, refreshToken) => {
        syncAuthCookie(true)
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      logout: () => {
        syncAuthCookie(false)
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      updateAccessToken: (accessToken) =>
        set({ accessToken }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir lo necesario, nunca el accessToken en localStorage
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Re-sync the cookie whenever the store is rehydrated from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) syncAuthCookie(state.isAuthenticated)
      },
    }
  )
)
