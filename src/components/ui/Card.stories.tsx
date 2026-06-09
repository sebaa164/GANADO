import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <p>Contenido básico de la tarjeta</p>,
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Información del Animal',
    children: <p>Aquí va la información detallada del animal seleccionado.</p>,
  },
}

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Reporte Mensual',
    subtitle: 'Estadísticas de ganado - Marzo 2024',
    children: <p>Contenido del reporte con datos importantes.</p>,
  },
}

export const AnimalCard: Story = {
  render: () => (
    <Card title="Vaca #001" subtitle="Holstein - 3 años">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Estado:</span>
          <Badge variant="animales">Saludable</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Peso:</span>
          <Badge variant="peso">450 kg</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Temperatura:</span>
          <Badge variant="temp">38.5°C</Badge>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="primary" size="sm">Ver detalles</Button>
          <Button variant="ghost" size="sm">Editar</Button>
        </div>
      </div>
    </Card>
  ),
}

export const AlertCard: Story = {
  render: () => (
    <Card title="Alerta de Salud" subtitle="Requiere atención inmediata">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="alerta">Urgente</Badge>
          <span className="text-sm">Vaca #045 - Fiebre alta</span>
        </div>
        <p className="text-sm text-gray-600">
          La temperatura corporal ha superado los 40°C. Se recomienda revisión veterinaria.
        </p>
        <div className="flex gap-2 mt-4">
          <Button variant="danger" size="sm">Atender ahora</Button>
          <Button variant="secondary" size="sm">Programar cita</Button>
        </div>
      </div>
    </Card>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <Card title="Estadísticas del Rebaño">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">124</div>
          <div className="text-sm text-gray-500">Total animales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">98%</div>
          <div className="text-sm text-gray-500">Saludables</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-sm text-gray-500">En observación</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">450kg</div>
          <div className="text-sm text-gray-500">Peso promedio</div>
        </div>
      </div>
    </Card>
  ),
}