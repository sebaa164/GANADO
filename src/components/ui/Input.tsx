import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export function Input({
  label,
  error,
  helper,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 rounded-md border text-base
          bg-white outline-none transition-colors
          ${error
            ? 'border-primary focus:ring-2 focus:ring-primary'
            : 'border-gray-300 focus:border-green-medium focus:ring-2 focus:ring-green-medium'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-primary">{error}</span>
      )}
      {helper && !error && (
        <span className="text-xs text-gray-500">{helper}</span>
      )}
    </div>
  )
}