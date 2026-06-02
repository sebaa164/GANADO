import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { id: string; name: string; role: string } | null
  isAuthenticated: boolean
  setUser: (user: AuthState['user']) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)