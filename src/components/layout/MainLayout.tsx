'use client'

import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = { name: 'Juan Pérez', role: 'Administrador' }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} user={user} />
      <main className="pt-16 lg:pl-56 transition-all duration-300 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
