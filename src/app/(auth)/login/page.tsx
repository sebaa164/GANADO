'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().min(1, 'El usuario es obligatorio').email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
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
      setServerError(error?.response?.data?.message ?? 'Usuario o contraseña incorrectos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Fondo: foto real de campo con ganado ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/campo-ganado.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay para mejorar legibilidad */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      />

      {/* ── Contenido ── */}
      <div className="relative z-10 w-full max-w-5xl mx-6 flex items-center justify-between gap-8">

        {/* Logo y texto izquierda */}
        <div className="hidden lg:flex flex-col gap-5 flex-1">
          <div className="flex items-center gap-5">
            {/* Logo circular con imagen */}
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.88)', border: '3px solid #2D6A2D' }}
            >
              <img src="/logo-ganado.png" alt="Logo GanadoVision" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-5xl font-bold leading-tight"
                style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>
                Monitoreo
              </h1>
              <h1 className="text-5xl font-bold leading-tight"
                style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>
                bovino
              </h1>
              <h1 className="text-5xl font-bold leading-tight"
                style={{ color: '#86efac', textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>
                inteligente
              </h1>
            </div>
          </div>
        </div>

        {/* ── Card login ── */}
        <div
          className="w-full lg:w-96 rounded-3xl p-8 flex flex-col"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {/* Ícono vaca centrado en la card */}
          <div className="flex justify-center mb-4">
            <div
              className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#f0f7f0', border: '2px solid #c8e6c0' }}
            >
              <img src="/logo-ganado.png" alt="Logo GanadoVision" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Iniciar sesión
          </h2>

          {/* Credenciales de prueba */}
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <p className="font-semibold mb-1">🔑 Credenciales de prueba:</p>
            <p>Email: <span className="font-mono font-bold">admin@ganadovision.com</span></p>
            <p>Contraseña: <span className="font-mono font-bold">Admin123!</span></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Email / Usuario */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Usuario"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all"
                  style={{
                    background: errors.email ? '#fff5f5' : '#f8f9fa',
                    border: errors.email ? '1.5px solid #fc8181' : '1.5px solid #e9ecef',
                  }}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all"
                  style={{
                    background: errors.password ? '#fff5f5' : '#f8f9fa',
                    border: errors.password ? '1.5px solid #fc8181' : '1.5px solid #e9ecef',
                  }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error servidor */}
            {serverError && (
              <div role="alert"
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 bg-red-50 border border-red-200 text-red-600">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {serverError}
              </div>
            )}

            {/* Botón ingresar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
              style={{ backgroundColor: '#2D6A2D', boxShadow: '0 4px 14px rgba(45,106,45,0.4)' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Ingresar'}
            </button>

            {/* Olvidaste contraseña */}
            <div className="text-center pt-1">
              <Link
                href="/recuperar-password"
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#2D6A2D' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
