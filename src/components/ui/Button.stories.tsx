import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Guardar animal' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancelar' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ver detalles' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Eliminar registro' },
}

export const Small: Story = {
  args: { variant: 'primary', size: 'sm', children: 'Pequeño' },
}

export const Large: Story = {
  args: { variant: 'primary', size: 'lg', children: 'Grande' },
}

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Guardando...' },
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'No disponible' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}