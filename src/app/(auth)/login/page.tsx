'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setServerError(null)
      await login(data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setServerError(error?.response?.data?.message ?? 'Email o contraseña incorrectos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Fondo dark con gradiente verde */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0a1f0a 0%, #1a3d1a 40%, #0d2b1a 70%, #071410 100%)' }}
      />

      {/* Orbe verde izquierda */}
      <div
        className="absolute z-0 rounded-full blur-3xl opacity-30"
        style={{ width: '600px', height: '600px', top: '-150px', left: '-150px',
          background: 'radial-gradient(circle, #2D6A2D 0%, transparent 70%)' }}
      />

      {/* Orbe verde derecha */}
      <div
        className="absolute z-0 rounded-full blur-3xl opacity-20"
        style={{ width: '500px', height: '500px', bottom: '-100px', right: '-100px',
          background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)' }}
      />

      {/* Orbe centro */}
      <div
        className="absolute z-0 rounded-full blur-2xl opacity-15"
        style={{ width: '300px', height: '300px', top: '50%', left: '60%',
          background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)' }}
      />

      {/* Patrón de puntos */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Card glassmorphism */}
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-3xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'rgba(45,106,45,0.4)',
              border: '1px solid rgba(74,222,128,0.3)',
              boxShadow: '0 0 24px rgba(45,106,45,0.5)',
            }}
          >
            <Image src="/ganado-logo.svg" alt="GanadoVision" width={36} height={36} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #86efac 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GanadoVision
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Sistema de Monitoreo Bovino
          </p>
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Bienvenido</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Ingresá tus credenciales para continuar
          </p>
        </div>

        {/* Credenciales de prueba */}
        <div
          className="mb-6 p-3 rounded-xl text-xs"
          style={{
            background: 'rgba(234,179,8,0.1)',
            border: '1px solid rgba(234,179,8,0.25)',
            color: 'rgba(253,224,71,0.9)',
          }}
        >
          <p className="font-semibold mb-1">🔑 Credenciales de prueba:</p>
          <p>Email: <span className="font-mono font-bold">admin@ganadovision.com</span></p>
          <p>Contraseña: <span className="font-mono font-bold">Admin123!</span></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5"
              style={{ color: 'rgba(255,255,255,0.75)' }}>
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="usuario@ganadovision.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all text-white placeholder:text-white/25"
                style={{
                  background: errors.email ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.07)',
                  border: errors.email ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                }}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.75)' }}>
                Contraseña
              </label>
              <Link href="/recuperar-password"
                className="text-xs font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'rgba(74,222,128,0.8)' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all text-white placeholder:text-white/25"
                style={{
                  background: errors.password ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.07)',
                  border: errors.password ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                }}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error servidor */}
          {serverError && (
            <div
              role="alert"
              className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
              }}
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{
              background: 'linear-gradient(135deg, #2D6A2D 0%, #22543d 100%)',
              border: '1px solid rgba(74,222,128,0.2)',
              boxShadow: '0 0 20px rgba(45,106,45,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              'Ingresar al sistema'
            )}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} GanadoVision — Todos los derechos reservados
        </p>
      </div>
    </div>
  )
}
