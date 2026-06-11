import { NextRequest, NextResponse } from 'next/server'

// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = ['/login', '/recuperar-password', '/reset-password', '/monitoreo-visual', '/mapa-interactivo']

// Rutas que deben redirigir al dashboard si ya estás autenticado
const AUTH_ROUTES = ['/login', '/recuperar-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lee el auth-storage de la cookie (Zustand persist)
  const authStorage = request.cookies.get('auth-storage')?.value

  let isAuthenticated = false
  try {
    if (authStorage) {
      const parsed = JSON.parse(decodeURIComponent(authStorage))
      isAuthenticated = parsed?.state?.isAuthenticated === true
    }
  } catch {
    isAuthenticated = false
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Si ya está autenticado y va a una ruta de auth → redirige al dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si NO está autenticado y va a una ruta protegida → redirige al login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Aplica el middleware a todas las rutas excepto API, _next y archivos estáticos
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|ganado-logo.svg).*)'],
}
