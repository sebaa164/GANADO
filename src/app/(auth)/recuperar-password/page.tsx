'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

const recoverSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Ingresa un email válido'),
})

type RecoverFormData = z.infer<typeof recoverSchema>

export default function RecuperarPasswordPage() {
  const { recoverPassword } = useAuth()
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
  })

  const onSubmit = async (data: RecoverFormData) => {
    try {
      setIsLoading(true)
      setServerError(null)
      await recoverPassword(data.email)
      setSuccess(true)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setServerError(
        error?.response?.data?.message ?? 'Ocurrió un error. Intentá de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/ganado-logo.svg"
            alt="GanadoVision Logo"
            width={64}
            height={64}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold" style={{ color: '#2D6A2D' }}>
            GanadoVision
          </h1>
          <p className="text-gray-500 mt-1">Sistema de Monitoreo Bovino</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {!success ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recuperar contraseña
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ingresá tu email y te enviaremos las instrucciones para restablecer tu contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="usuario@ganadovision.com"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors
                      ${errors.email
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-[#2D6A2D] bg-white'
                      }`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Error del servidor */}
                {serverError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {serverError}
                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#2D6A2D' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar instrucciones'
                  )}
                </button>
              </form>
            </>
          ) : (
            // Estado de éxito
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#e8f5e9' }}
              >
                <svg className="w-8 h-8" style={{ color: '#2D6A2D' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Email enviado!
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Enviamos las instrucciones a
              </p>
              <p className="text-sm font-medium text-gray-800 mb-6">
                {getValues('email')}
              </p>
              <p className="text-xs text-gray-400">
                Revisá también tu carpeta de spam
              </p>
            </div>
          )}
        </div>

        {/* Link de volver */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm inline-flex items-center gap-1 hover:underline"
            style={{ color: '#2D6A2D' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}
