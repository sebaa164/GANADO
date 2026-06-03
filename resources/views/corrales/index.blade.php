<x-layouts.app title="Corrales — GanadoVision">
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Corrales</h1>
            <a href="{{ route('corrales.create') }}"
               class="px-4 py-2 bg-green-dark text-white rounded-lg text-sm font-medium hover:bg-green-base transition-colors">
                + Nuevo corral
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @forelse($corrales as $corral)
            <div class="bg-white rounded-lg border border-gray-100 shadow-soft p-4">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h3 class="font-semibold text-gray-900">{{ $corral->nombre }}</h3>
                        <p class="text-xs text-gray-500">Código: {{ $corral->codigo }}</p>
                    </div>
                    <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-dark">
                        Activo
                    </span>
                </div>
                <p class="text-sm text-gray-600">
                    {{ $corral->animales_count }} / {{ $corral->capacidad_maxima }} animales
                </p>
                <div class="mt-3 flex gap-2">
                    <a href="{{ route('corrales.show', $corral) }}" class="text-xs text-green-dark hover:underline">Ver detalle</a>
                    <a href="{{ route('corrales.edit', $corral) }}" class="text-xs text-gray-500 hover:underline">Editar</a>
                </div>
            </div>
            @empty
            <div class="col-span-3 text-center py-8 text-gray-400 text-sm">No hay corrales registrados.</div>
            @endforelse
        </div>
    </div>
</x-layouts.app>
