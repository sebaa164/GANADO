<x-layouts.app title="Animales — GanadoVision">
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Animales</h1>
            <a href="{{ route('animales.create') }}"
               class="px-4 py-2 bg-green-dark text-white rounded-lg text-sm font-medium hover:bg-green-base transition-colors">
                + Registrar animal
            </a>
        </div>

        <div class="bg-white rounded-lg border border-gray-100 shadow-soft overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caravana</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raza</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexo</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Corral</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th class="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($animales as $animal)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ $animal->codigo_caravana }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ $animal->raza ?? '—' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ ucfirst($animal->sexo) }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ $animal->corral->nombre ?? '—' }}</td>
                        <td class="px-4 py-3">
                            <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium {{ $animal->activo ? 'bg-green-100 text-green-dark' : 'bg-gray-100 text-gray-500' }}">
                                {{ $animal->activo ? 'Activo' : 'Inactivo' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-right">
                            <a href="{{ route('animales.show', $animal) }}" class="text-sm text-green-dark hover:underline">Ver</a>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="px-4 py-8 text-center text-gray-400 text-sm">No hay animales registrados.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
            <div class="px-4 py-3 border-t border-gray-100">
                {{ $animales->links() }}
            </div>
        </div>
    </div>
</x-layouts.app>
