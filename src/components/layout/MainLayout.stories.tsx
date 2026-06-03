import type { Meta, StoryObj } from '@storybook/nextjs'
import { MainLayout } from './MainLayout'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const meta: Meta<typeof MainLayout> = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Layout principal de la aplicación GanadoVision con:
- ✅ Logo GanadoVision
- ✅ Usuario activo y rol (color #2D6A2D)
- ✅ Sidebar colapsable con items: Dashboard, Animales, Alertas, Reportes, Configuración
- ✅ Menú de usuario (perfil, logout)
- ✅ Responsive: sidebar drawer en móvil
- 🔄 Tema oscuro (opcional Fase 4)
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MainLayout>

export const Default: Story = {
  args: {
    children: (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Este es el layout principal de la aplicación con navegación superior y lateral.
        </p>
      </div>
    ),
  },
}

export const WithDashboardContent: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen del estado del ganado</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#2D6A2D' }}>124</div>
              <div className="text-sm text-gray-500 mt-1">Total Animales</div>
              <Badge variant="animales" className="mt-2">Activo</Badge>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#2D6A2D' }}>98%</div>
              <div className="text-sm text-gray-500 mt-1">Saludables</div>
              <Badge variant="peso" className="mt-2">Normal</Badge>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-500 mt-1">Alertas Activas</div>
              <Badge variant="alerta" className="mt-2">Urgente</Badge>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#2D6A2D' }}>450kg</div>
              <div className="text-sm text-gray-500 mt-1">Peso Promedio</div>
              <Badge variant="temp" className="mt-2">38.5°C</Badge>
            </div>
          </Card>
        </div>
        
        <Card title="Acciones Rápidas">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Registrar Animal</Button>
            <Button variant="secondary">Ver Reportes</Button>
            <Button variant="ghost">Configuración</Button>
          </div>
        </Card>
      </div>
    ),
  },
}

export const WithListContent: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Animales</h1>
            <p className="text-gray-600">Listado completo del ganado</p>
          </div>
          <Button variant="primary">+ Nuevo Animal</Button>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Vaca #{String(i).padStart(3, '0')}</h3>
                  <p className="text-sm text-gray-500">Holstein - 3 años</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant="peso">450 kg</Badge>
                  <Badge variant="animales">Saludable</Badge>
                  <Button variant="ghost" size="sm">Ver detalles</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
}

export const WithAlerts: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-gray-600">Notificaciones y alertas del sistema</p>
        </div>
        
        <div className="space-y-3">
          <Card>
            <div className="flex items-start gap-3">
              <Badge variant="alerta">Urgente</Badge>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Temperatura elevada</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Vaca #045 presenta temperatura de 40.2°C
                </p>
                <p className="text-xs text-gray-400 mt-2">Hace 5 minutos</p>
              </div>
              <Button variant="danger" size="sm">Atender</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-start gap-3">
              <Badge variant="temp">Advertencia</Badge>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Peso bajo detectado</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Vaca #023 ha perdido 15kg en la última semana
                </p>
                <p className="text-xs text-gray-400 mt-2">Hace 1 hora</p>
              </div>
              <Button variant="secondary" size="sm">Revisar</Button>
            </div>
          </Card>
        </div>
      </div>
    ),
  },
}
