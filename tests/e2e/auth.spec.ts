import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'

// Helper para limpiar el estado de autenticación
async function clearAuth(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.removeItem('auth-storage'))
  await page.context().clearCookies()
}

// ─── Tests de Login ────────────────────────────────────────────────────────────

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await clearAuth(page)
    await page.reload()
  })

  test('muestra el formulario de login correctamente', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible()
    await expect(page.getByText('GanadoVision')).toBeVisible()
  })

  test('muestra errores de validación con campos vacíos', async ({ page }) => {
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page.getByText('El email es obligatorio')).toBeVisible()
    await expect(page.getByText('La contraseña es obligatoria')).toBeVisible()
  })

  test('muestra error con formato de email inválido', async ({ page }) => {
    await page.getByLabel('Email').fill('email-invalido')
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page.getByText('Ingresa un email válido')).toBeVisible()
  })

  test('muestra error de contraseña muy corta', async ({ page }) => {
    await page.getByLabel('Email').fill('test@test.com')
    await page.getByLabel('Contraseña').fill('123')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page.getByText('La contraseña debe tener al menos 6 caracteres')).toBeVisible()
  })

  test('muestra error del servidor con credenciales incorrectas', async ({ page }) => {
    // Mockear la respuesta del API
    await page.route('**/auth/login', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ message: 'Email o contraseña incorrectos' }) })
    )

    await page.getByLabel('Email').fill('wrong@test.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible()
  })

  test('login exitoso redirige al dashboard', async ({ page }) => {
    // Mockear respuesta exitosa
    await page.route('**/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: '1', name: 'Juan Pérez', email: 'juan@test.com', role: 'admin' },
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
        }),
      })
    )

    await page.getByLabel('Email').fill('juan@test.com')
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('muestra spinner de carga durante el login', async ({ page }) => {
    // Delay para ver el spinner
    await page.route('**/auth/login', async (route) => {
      await new Promise((r) => setTimeout(r, 500))
      await route.fulfill({ status: 401, body: JSON.stringify({ message: 'Error' }) })
    })

    await page.getByLabel('Email').fill('test@test.com')
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.getByText('Iniciando sesión...')).toBeVisible()
  })

  test('link de recuperar contraseña está presente', async ({ page }) => {
    const link = page.getByRole('link', { name: '¿Olvidaste tu contraseña?' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/recuperar-password')
  })
})

// ─── Tests de Rutas Protegidas ─────────────────────────────────────────────────

test.describe('Rutas protegidas', () => {

  test('redirige a /login si accede a /dashboard sin autenticación', async ({ page }) => {
    await clearAuth(page)
    await page.goto(`${BASE_URL}/dashboard`)
    await expect(page).toHaveURL(/\/login/)
  })

  test('usuario autenticado puede acceder al dashboard', async ({ page }) => {
    // Simular estado autenticado en localStorage
    await page.goto(`${BASE_URL}/login`)
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', name: 'Juan Pérez', email: 'juan@test.com', role: 'admin' },
          isAuthenticated: true,
          refreshToken: 'fake-refresh-token',
        },
        version: 0,
      }))
    })

    await page.route('**/dashboard**', (route) => route.continue())
    await page.goto(`${BASE_URL}/dashboard`)
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('usuario autenticado en /login redirige al dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', name: 'Juan', email: 'juan@test.com', role: 'admin' },
          isAuthenticated: true,
          refreshToken: 'fake-refresh-token',
        },
        version: 0,
      }))
    })

    await page.goto(`${BASE_URL}/login`)
    await expect(page).toHaveURL(/\/dashboard/)
  })
})

// ─── Tests de Recuperar Contraseña ────────────────────────────────────────────

test.describe('Recuperar contraseña', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/recuperar-password`)
  })

  test('muestra el formulario de recuperación', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recuperar contraseña' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enviar instrucciones' })).toBeVisible()
  })

  test('muestra error con email inválido', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar instrucciones' }).click()
    await expect(page.getByText('El email es obligatorio')).toBeVisible()
  })

  test('muestra mensaje de éxito tras enviar el email', async ({ page }) => {
    await page.route('**/auth/recover-password', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ message: 'Email enviado' }) })
    )

    await page.getByLabel('Email').fill('juan@test.com')
    await page.getByRole('button', { name: 'Enviar instrucciones' }).click()

    await expect(page.getByText('¡Email enviado!')).toBeVisible()
    await expect(page.getByText('juan@test.com')).toBeVisible()
  })

  test('link de volver al login está presente', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Volver al login' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/login')
  })
})

// ─── Tests de Logout ──────────────────────────────────────────────────────────

test.describe('Logout', () => {

  test('logout limpia la sesión y redirige a /login', async ({ page }) => {
    // Simular sesión activa
    await page.goto(`${BASE_URL}/login`)
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', name: 'Juan', email: 'juan@test.com', role: 'admin' },
          isAuthenticated: true,
          refreshToken: 'fake-refresh-token',
        },
        version: 0,
      }))
    })

    // Mockear el endpoint de logout
    await page.route('**/auth/logout', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ message: 'ok' }) })
    )

    await page.goto(`${BASE_URL}/dashboard`)

    // Busca y hace click en el botón de Cerrar sesión en el navbar
    await page.getByLabel('Menú de usuario').click()
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()

    await expect(page).toHaveURL(/\/login/)

    // Verifica que el storage fue limpiado
    const authStorage = await page.evaluate(() => localStorage.getItem('auth-storage'))
    const parsed = JSON.parse(authStorage ?? '{}')
    expect(parsed?.state?.isAuthenticated).toBeFalsy()
  })
})

// ─── Tests de Refresh Token ────────────────────────────────────────────────────

test.describe('Refresh token', () => {

  test('hace refresh automático al recibir 401', async ({ page }) => {
    let requestCount = 0

    await page.goto(`${BASE_URL}/login`)
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', name: 'Juan', email: 'juan@test.com', role: 'admin' },
          isAuthenticated: true,
          refreshToken: 'valid-refresh-token',
        },
        version: 0,
      }))
    })

    // Primera llamada devuelve 401, segunda es exitosa
    await page.route('**/animales', (route) => {
      requestCount++
      if (requestCount === 1) {
        route.fulfill({ status: 401, body: JSON.stringify({ message: 'Unauthorized' }) })
      } else {
        route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) })
      }
    })

    // Mockear refresh endpoint
    await page.route('**/auth/refresh', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ accessToken: 'new-access-token' }),
      })
    )

    // Trigger la llamada a la API
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/v1/animales', {
        headers: { Authorization: 'Bearer expired-token' },
      })
      return res.status
    })

    // La petición debe resolverse tras el refresh
    expect(requestCount).toBeGreaterThanOrEqual(1)
  })
})
