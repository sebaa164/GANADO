import { MainLayout } from '@/components/layout'
import { AnimalDetalleView } from '@/components/animal-detalle/AnimalDetalleView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AnimalDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <MainLayout>
      <AnimalDetalleView animalId={id} activeTab="general" />
    </MainLayout>
  )
}
