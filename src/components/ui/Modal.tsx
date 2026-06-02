import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      {/* Contenido */}
      <div
        className={`
          relative bg-white rounded-lg shadow-md
          w-full max-w-md mx-4 p-md
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}