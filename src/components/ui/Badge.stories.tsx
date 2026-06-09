import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['peso', 'animales', 'alerta', 'temp'],
    },
    children: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Peso: Story = {
  args: {
    variant: 'peso',
    children: '450 kg',
  },
}

export const Animales: Story = {
  args: {
    variant: 'animales',
    children: 'Saludable',
  },
}

export const Alerta: Story = {
  args: {
    variant: 'alerta',
    children: 'Urgente',
  },
}

export const Temperatura: Story = {
  args: {
    variant: 'temp',
    children: '38.5°C',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="peso">450 kg</Badge>
      <Badge variant="animales">Saludable</Badge>
      <Badge variant="alerta">Urgente</Badge>
      <Badge variant="temp">38.5°C</Badge>
    </div>
  ),
}

export const DashboardStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Estados de Peso</h4>
        <div className="flex gap-2">
          <Badge variant="peso">Normal</Badge>
          <Badge variant="peso">450 kg</Badge>
          <Badge variant="peso">Bajo peso</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Estados de Animales</h4>
        <div className="flex gap-2">
          <Badge variant="animales">Saludable</Badge>
          <Badge variant="animales">En tratamiento</Badge>
          <Badge variant="animales">Vacunado</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Alertas</h4>
        <div className="flex gap-2">
          <Badge variant="alerta">Urgente</Badge>
          <Badge variant="alerta">Fiebre</Badge>
          <Badge variant="alerta">Revisión</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Temperatura</h4>
        <div className="flex gap-2">
          <Badge variant="temp">38.5°C</Badge>
          <Badge variant="temp">Normal</Badge>
          <Badge variant="temp">Alta</Badge>
        </div>
      </div>
    </div>
  ),
}