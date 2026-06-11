import { MainLayout } from '@/components/layout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { StockView } from '@/components/stock'

export default function StockPage() {
  return (
    <AuthGuard>
      <MainLayout>
        <StockView />
      </MainLayout>
    </AuthGuard>
  )
}
