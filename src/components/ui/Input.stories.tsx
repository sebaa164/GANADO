import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    label: 'Nombre del animal',
    placeholder: 'Ingresa el nombre...',
  },
}

export const WithHelper: Story = {
  args: {
    label: 'Peso (kg)',
    placeholder: '0.00',
    helper: 'Ingresa el peso en kilogramos',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'correo@ejemplo.com',
    error: 'El formato del email no es válido',
    defaultValue: 'correo-invalido',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Campo deshabilitado',
    placeholder: 'No editable',
    disabled: true,
    defaultValue: 'Valor fijo',
  },
}

export const Required: Story = {
  args: {
    label: 'Campo requerido *',
    placeholder: 'Este campo es obligatorio',
    required: true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input label="Normal" placeholder="Estado normal" />
      <Input 
        label="Con ayuda" 
        placeholder="Con texto de ayuda"
        helper="Este es un texto de ayuda"
      />
      <Input 
        label="Con error" 
        placeholder="Con mensaje de error"
        error="Este campo tiene un error"
        defaultValue="valor incorrecto"
      />
      <Input 
        label="Deshabilitado" 
        placeholder="Campo deshabilitado"
        disabled
        defaultValue="No editable"
      />
    </div>
  ),
}