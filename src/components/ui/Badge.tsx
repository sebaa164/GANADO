import React from 'react'

type BadgeVariant = 'peso' | 'animales' | 'alerta' | 'temp'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  peso:     'bg-green-100 text-green-dark',
  animales: 'bg-blue-100 text-blue-800',
  alerta:   'bg-red-100 text-primary',
  temp:     'bg-yellow-100 text-yellow-800',
}

export function Badge({ variant = 'animales', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}