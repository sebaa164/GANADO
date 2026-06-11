import type { Meta, StoryObj } from '@storybook/nextjs'
import { Navbar } from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onMenuClick: { action: 'menu clicked' },
  },
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  args: {
    user: {
      name: 'Juan Pérez',
      role: 'Administrador',
    },
    onMenuClick: () => console.log('Menu clicked'),
  },
}

export const WithDifferentUser: Story = {
  args: {
    user: {
      name: 'María García',
      role: 'Veterinaria',
    },
    onMenuClick: () => console.log('Menu clicked'),
  },
}

export const WithLongName: Story = {
  args: {
    user: {
      name: 'José Antonio Rodríguez González',
      role: 'Supervisor de Campo',
    },
    onMenuClick: () => console.log('Menu clicked'),
  },
}

export const WithShortName: Story = {
  args: {
    user: {
      name: 'Ana',
      role: 'Admin',
    },
    onMenuClick: () => console.log('Menu clicked'),
  },
}
