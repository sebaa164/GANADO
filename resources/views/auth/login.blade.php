<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Iniciar sesión — GanadoVision</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-background flex items-center justify-center">

    <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-soft border border-gray-100 p-8">

            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-green-dark">🐄 GanadoVision</h1>
                <p class="text-gray-500 mt-2 text-sm">Sistema de monitoreo de ganado</p>
            </div>

            @if($errors->any())
                <div class="mb-4 p-3 bg-red-100 text-primary rounded-lg text-sm">
                    {{ $errors->first() }}
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark focus:border-transparent">
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input type="password" id="password" name="password" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-dark focus:border-transparent">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="remember" name="remember" class="mr-2">
                    <label for="remember" class="text-sm text-gray-600">Recordarme</label>
                </div>
                <button type="submit"
                        class="w-full py-2 px-4 bg-green-dark text-white rounded-lg font-medium hover:bg-green-base transition-colors">
                    Ingresar
                </button>
            </form>

        </div>
    </div>

</body>
</html>
