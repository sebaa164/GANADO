'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

/**
 * HOC / componente de protección de rutas del lado del cliente.
 * El middleware protege en el servidor, pero este componente
 * provee una segunda capa de protección en el cliente.
 *
 * Waits for Zustand to rehydrate from localStorage before rendering
 * or redirecting, preventing a blank flash on hard refresh.
 */
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  // Zustand persist rehydrates asynchronously. Track when it's done.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // onFinishHydration fires when localStorage has been read into the store
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    // Already hydrated if the store was used before this component mounted
    if (useAuthStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  useEffect(() => {
    if (!hydrated) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/dashboard')
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, router])

  // Still rehydrating — render nothing (middleware already handled the redirect)
  if (!hydrated) return null

  if (!isAuthenticated) return null

  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
