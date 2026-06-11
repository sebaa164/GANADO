'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/Button'
import { AnimalFilters } from '@/components/animales/AnimalFilters'
import { AnimalTable } from '@/components/animales/AnimalTable'
import { AnimalFormModal } from '@/components/animales/AnimalFormModal'
import type { Animal } from '@/types/animal'

export default function AnimalesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editAnimal, setEditAnimal] = useState<Animal | null>(null)

  const handleNew = () => {
    setEditAnimal(null)
    setModalOpen(true)
  }

  const handleEdit = (animal: Animal) => {
    setEditAnimal(animal)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditAnimal(null)
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Animales</h1>
            <Button variant="primary" onClick={handleNew}>
              + Nuevo animal
            </Button>
          </div>

          <AnimalFilters />
          <AnimalTable onEdit={handleEdit} onNew={handleNew} />
        </div>

        <AnimalFormModal
          isOpen={modalOpen}
          onClose={handleClose}
          editAnimal={editAnimal}
        />
      </MainLayout>
    </AuthGuard>
  )
}
