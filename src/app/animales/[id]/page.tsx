import Link from 'next/link'
import { MainLayout } from '@/components/layout'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AnimalDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <MainLayout>
      <div className="w-full">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-gray-900">Animal {id}</h1>
          <p className="text-sm text-gray-500">Ficha del animal</p>
        </div>

        <nav aria-label="Secciones del animal" className="flex gap-1 border-b border-gray-200 mb-6">
          <Link
            href={`/animales/${id}`}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-dark border-b-2 border-transparent hover:border-green-dark transition-colors"
          >
            General
          </Link>
          <Link
            href={`/animales/${id}/sanitario`}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-dark border-b-2 border-transparent hover:border-green-dark transition-colors"
          >
            Sanitario
          </Link>
        </nav>

        <p className="text-sm text-gray-500">
          Vista general del animal. Seleccioná{' '}
          <Link href={`/animales/${id}/sanitario`} className="text-green-dark underline font-medium">
            Sanitario
          </Link>{' '}
          para ver el historial médico.
        </p>
      </div>
    </MainLayout>
  )
}
