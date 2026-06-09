import type { Meta, StoryObj } from '@storybook/nextjs'
import { Sidebar } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const DesktopOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Sidebar closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
}

export const DesktopCollapsed: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Sidebar closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  render: (args) => {
    // Simular click en el botón de colapsar
    return (
      <div>
        <p className="p-4 bg-yellow-100 text-sm">
          💡 Haz clic en el botón de flecha en el sidebar para colapsarlo
        </p>
        <Sidebar {...args} />
      </div>
    )
  },
}

export const MobileOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Sidebar closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const MobileClosed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Sidebar closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const WithActiveRoute: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Sidebar closed'),
  },
  render: (args) => (
    <div>
      <p className="p-4 bg-blue-100 text-sm">
        💡 La ruta activa se resalta en verde oscuro (#2D6A2D)
      </p>
      <Sidebar {...args} />
    </div>
  ),
}

export const MenuItems: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Elementos del Menú</h2>
      <div className="grid grid-cols-1 gap-3 max-w-md">
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Animales</span>
          </div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="font-medium">Alertas</span>
          </div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <span className="font-medium">Reportes</span>
          </div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Configuración</span>
          </div>
        </div>
      </div>
    </div>
  ),
}
