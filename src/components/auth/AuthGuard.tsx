'use client'

import { useEffect } from 'react'
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
 */
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Usuario autenticado pero sin el rol necesario
      router.replace('/dashboard')
    }
  }, [isAuthenticated, user, allowedRoles, router])

  if (!isAuthenticated) return null

  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
