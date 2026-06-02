'use client'

import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Datos de usuario de ejemplo (en producción vendrían del authStore/useAuth)
  // TODO: Integrar con src/hooks/useAuth.ts y src/stores/authStore.ts
  const user = {
    name: 'Juan Pérez',
    role: 'Administrador',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar con logo GanadoVision, usuario activo y rol */}
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        user={user}
      />
      
      {/* Sidebar colapsable con items: Dashboard, Animales, Alertas, Reportes, Configuración */}
      {/* Responsive: sidebar drawer en móvil */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Contenido principal */}
      <main className="pt-20 lg:pl-64 transition-all duration-300">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
