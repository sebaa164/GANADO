import { redirect } from 'next/navigation'

// La raíz siempre redirige al dashboard
// El middleware se encargará de redirigir a /login si no está autenticado
export default function RootPage() {
  redirect('/dashboard')
}
