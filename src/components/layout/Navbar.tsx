'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
  onMenuClick: () => void
  user: {
    name: string
    role: string
  }
}

export function Navbar({ onMenuClick, user }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    // TODO: Implementar lógica de logout con zustand authStore
    console.log('Cerrando sesión...')
  }

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Botón menú móvil */}
            <button
              onClick={onMenuClick}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Logo GanadoVision */}
            <Link href="/" className="flex items-center gap-2 ml-2 md:mr-24">
              <Image 
                src="/ganado-logo.svg" 
                alt="GanadoVision Logo" 
                width={40}
                height={40}
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap" style={{ color: '#2D6A2D' }}>
                GanadoVision
              </span>
            </Link>
          </div>
          
          {/* Usuario activo y rol */}
          <div className="flex items-center" ref={menuRef}>
            <div className="flex items-center ml-3 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-sm bg-gray-100 rounded-lg p-2 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-colors"
                aria-label="Menú de usuario"
                aria-expanded={showUserMenu}
              >
                <div className="text-right mr-3 hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs font-medium" style={{ color: '#2D6A2D' }}>{user.role}</div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold"
                  style={{ backgroundColor: '#2D6A2D' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {/* Menú desplegable de usuario (perfil, logout) */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                    <p className="text-xs" style={{ color: '#2D6A2D' }}>{user.role}</p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link 
                        href="/perfil" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Perfil
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
