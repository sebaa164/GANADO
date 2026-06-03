<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'GanadoVision' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 antialiased" x-data="{ sidebarOpen: false, sidebarCollapsed: false, userMenuOpen: false }">

    {{-- NAVBAR --}}
    <nav class="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">

                {{-- Logo + botón móvil --}}
                <div class="flex items-center">
                    <button @click="sidebarOpen = !sidebarOpen"
                            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-label="Abrir menú">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-2 ml-2 md:mr-24">
                        <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-green-dark">
                            🐄 GanadoVision
                        </span>
                    </a>
                </div>

                {{-- Usuario --}}
                <div class="relative" x-data @click.outside="userMenuOpen = false">
                    <button @click="userMenuOpen = !userMenuOpen"
                            class="flex items-center text-sm bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors"
                            aria-label="Menú de usuario">
                        <div class="text-right mr-3 hidden md:block">
                            <div class="text-sm font-medium text-gray-900">{{ auth()->user()->name ?? 'Usuario' }}</div>
                            <div class="text-xs font-medium text-green-dark">{{ auth()->user()->role ?? 'Administrador' }}</div>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-green-dark text-white flex items-center justify-center font-semibold">
                            {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 1)) }}
                        </div>
                    </button>

                    <div x-show="userMenuOpen" x-cloak
                         class="absolute right-0 top-12 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                        <div class="px-4 py-3 border-b border-gray-200">
                            <p class="text-sm font-medium text-gray-900">{{ auth()->user()->name ?? 'Usuario' }}</p>
                            <p class="text-xs text-green-dark">{{ auth()->user()->role ?? 'Administrador' }}</p>
                        </div>
                        <ul class="py-1">
                            <li>
                                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                                    </svg>
                                    Perfil
                                </a>
                            </li>
                            <li>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full flex items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/>
                                        </svg>
                                        Cerrar sesión
                                    </button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </nav>

    {{-- OVERLAY MÓVIL --}}
    <div x-show="sidebarOpen" x-cloak
         @click="sidebarOpen = false"
         class="fixed inset-0 z-20 bg-black/50 lg:hidden"
         aria-hidden="true">
    </div>

    {{-- SIDEBAR --}}
    <aside :class="{
                '-translate-x-full': !sidebarOpen,
                'translate-x-0': sidebarOpen,
                'w-16': sidebarCollapsed,
                'w-64': !sidebarCollapsed
            }"
           class="fixed top-0 left-0 z-40 h-screen pt-20 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:translate-x-0"
           aria-label="Sidebar">

        <div class="h-full px-3 pb-4 overflow-y-auto">

            {{-- Botón colapsar (desktop) --}}
            <button @click="sidebarCollapsed = !sidebarCollapsed"
                    class="hidden lg:flex items-center justify-center w-full p-2 mb-4 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    :aria-label="sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'">
                <svg :class="{ 'rotate-180': sidebarCollapsed }"
                     class="w-5 h-5 transition-transform duration-300"
                     fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
            </button>

            <nav aria-label="Menú principal">
                <ul class="space-y-2 font-medium">
                    @php
                        $menuItems = [
                            ['name' => 'Dashboard',     'route' => 'dashboard',     'icon' => 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'],
                            ['name' => 'Animales',      'route' => 'animales.index', 'icon' => 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'],
                            ['name' => 'Alertas',       'route' => 'alertas.index',  'icon' => 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'],
                            ['name' => 'Corrales',      'route' => 'corrales.index', 'icon' => 'M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'],
                            ['name' => 'Configuración', 'route' => 'configuracion',  'icon' => 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'],
                        ];
                    @endphp

                    @foreach($menuItems as $item)
                        @php $isActive = request()->routeIs($item['route']); @endphp
                        <li>
                            <a href="{{ route($item['route']) }}"
                               class="flex items-center p-2 rounded-lg transition-colors {{ $isActive ? 'bg-green-dark text-white' : 'text-gray-900 hover:bg-gray-100' }}"
                               :class="{ 'justify-center': sidebarCollapsed }"
                               aria-current="{{ $isActive ? 'page' : 'false' }}">
                                <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="{{ $item['icon'] }}"/>
                                </svg>
                                <span x-show="!sidebarCollapsed" class="ml-3">{{ $item['name'] }}</span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </nav>
        </div>
    </aside>

    {{-- CONTENIDO PRINCIPAL --}}
    <main :class="{ 'lg:pl-16': sidebarCollapsed, 'lg:pl-64': !sidebarCollapsed }"
          class="pt-20 transition-all duration-300">
        <div class="p-4 lg:p-6">
            @if(session('success'))
                <div class="mb-4 p-4 bg-green-100 text-green-dark rounded-lg border border-green-200">
                    {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-4 p-4 bg-red-100 text-primary rounded-lg border border-red-200">
                    {{ session('error') }}
                </div>
            @endif
            {{ $slot }}
        </div>
    </main>

</body>
</html>
