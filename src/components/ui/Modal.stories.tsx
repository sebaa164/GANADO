import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Badge } from './Badge'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    onClose: { action: 'closed' },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Básico',
    children: <p>Este es el contenido básico del modal.</p>,
  },
}

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-4">Contenido personalizado</h3>
        <p>Modal sin título predefinido, con contenido personalizado.</p>
      </div>
    ),
  },
}

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>
          Abrir Modal
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Interactivo"
        >
          <p className="mb-4">
            Este modal se puede abrir y cerrar. Haz clic en el botón X o en el fondo para cerrarlo.
          </p>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Aceptar
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </Modal>
      </div>
    )
  },
}

export const AnimalForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>
          Agregar Animal
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registrar Nuevo Animal"
          className="max-w-lg"
        >
          <div className="space-y-4">
            <Input
              label="Nombre/ID del animal"
              placeholder="Ej: Vaca #001"
            />
            <Input
              label="Raza"
              placeholder="Ej: Holstein"
            />
            <Input
              label="Peso (kg)"
              type="number"
              placeholder="450"
            />
            <Input
              label="Edad (años)"
              type="number"
              placeholder="3"
            />
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Estado actual
              </label>
              <div className="flex gap-2">
                <Badge variant="animales">Saludable</Badge>
                <Badge variant="temp">38.5°C</Badge>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="primary" className="flex-1">
                Guardar Animal
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  },
}

export const AlertModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Ver Alerta
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="⚠️ Alerta de Salud"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="alerta">Urgente</Badge>
              <span className="font-medium">Vaca #045</span>
            </div>
            
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Problema:</strong> Temperatura corporal elevada (40.2°C)
              </p>
              <p className="text-sm text-red-800 mt-1">
                <strong>Recomendación:</strong> Revisión veterinaria inmediata
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="danger" className="flex-1">
                Atender Ahora
              </Button>
              <Button variant="secondary" className="flex-1">
                Programar Cita
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  },
}