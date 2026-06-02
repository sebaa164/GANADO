import { MainLayout } from '@/components/layout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Peso Promedio" subtitle="Últimos 30 días">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-dark">450 kg</span>
              <Badge variant="peso">+5%</Badge>
            </div>
          </Card>
          
          <Card title="Total Animales" subtitle="Registrados">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-dark">150</span>
              <Badge variant="animales">Activos</Badge>
            </div>
          </Card>
          
          <Card title="Alertas" subtitle="Pendientes">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">3</span>
              <Badge variant="alerta">Urgente</Badge>
            </div>
          </Card>
          
          <Card title="Temperatura" subtitle="Promedio hoy">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-600">25°C</span>
              <Badge variant="temp">Normal</Badge>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
