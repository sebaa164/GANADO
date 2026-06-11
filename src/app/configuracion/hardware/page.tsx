import { AuthGuard } from '@/components/auth/AuthGuard'
import { MainLayout } from '@/components/layout'
import { HardwareView } from '@/components/hardware'

export const metadata = {
  title: 'Hardware — Ganado Vision',
  description: 'Administración de antenas RFID y cámaras IP',
}

export default function HardwarePage() {
  return (
    <AuthGuard>
      <MainLayout>
        <HardwareView />
      </MainLayout>
    </AuthGuard>
  )
}
