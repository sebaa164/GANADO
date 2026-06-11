import { MainLayout } from '@/components/layout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card } from '@/components/ui/Card'

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Animal #{id}</h1>
          <Card title="Vista detallada">
            <p className="text-gray-500">
              Esta sección se completará en la Fase 3.
              Aquí se mostrará la información completa del animal,
              historial de pesajes, eventos de comportamiento y alertas.
            </p>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
