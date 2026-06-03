<x-layouts.app title="Dashboard — GanadoVision">

    <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

        {{-- Cards de resumen --}}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {{-- Peso promedio --}}
            <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-soft">
                <h3 class="text-sm font-medium text-gray-500">Peso Promedio</h3>
                <p class="text-xs text-gray-400 mb-3">Últimos 30 días</p>
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-green-dark">{{ $pesoPromedio ?? '—' }} kg</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-dark">
                        +5%
                    </span>
                </div>
            </div>

            {{-- Total animales --}}
            <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-soft">
                <h3 class="text-sm font-medium text-gray-500">Total Animales</h3>
                <p class="text-xs text-gray-400 mb-3">Registrados</p>
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-green-dark">{{ $totalAnimales ?? 0 }}</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Activos
                    </span>
                </div>
            </div>

            {{-- Alertas pendientes --}}
            <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-soft">
                <h3 class="text-sm font-medium text-gray-500">Alertas</h3>
                <p class="text-xs text-gray-400 mb-3">Pendientes</p>
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-primary">{{ $alertasPendientes ?? 0 }}</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-primary">
                        Urgente
                    </span>
                </div>
            </div>

            {{-- Temperatura --}}
            <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-soft">
                <h3 class="text-sm font-medium text-gray-500">Temperatura</h3>
                <p class="text-xs text-gray-400 mb-3">Promedio hoy</p>
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-yellow-600">{{ $temperatura ?? '—' }}°C</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Normal
                    </span>
                </div>
            </div>

        </div>

        {{-- Alertas recientes --}}
        @if($alertasRecientes && $alertasRecientes->count() > 0)
        <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-soft">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Alertas Recientes</h2>
            <ul class="divide-y divide-gray-100">
                @foreach($alertasRecientes as $alerta)
                <li class="py-3 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-900">{{ $alerta->tipo_anomalia }}</p>
                        <p class="text-xs text-gray-500">{{ $alerta->descripcion }}</p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        {{ $alerta->prioridad === 'alta' ? 'bg-red-100 text-primary' : 'bg-yellow-100 text-yellow-800' }}">
                        {{ ucfirst($alerta->prioridad) }}
                    </span>
                </li>
                @endforeach
            </ul>
        </div>
        @endif

    </div>

</x-layouts.app>
