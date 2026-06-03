<x-layouts.app title="Alertas — GanadoVision">
    <div class="space-y-4">
        <h1 class="text-2xl font-bold text-gray-900">Alertas</h1>

        <div class="bg-white rounded-lg border border-gray-100 shadow-soft overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Corral</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generada</th>
                        <th class="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($alertas as $alerta)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ $alerta->tipo_anomalia }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ $alerta->animal->codigo_caravana ?? '—' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ $alerta->corral->nombre ?? '—' }}</td>
                        <td class="px-4 py-3">
                            <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                                {{ $alerta->prioridad === 'alta' ? 'bg-red-100 text-primary' : 'bg-yellow-100 text-yellow-800' }}">
                                {{ ucfirst($alerta->prioridad) }}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                                {{ $alerta->estado === 'pendiente' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-dark' }}">
                                {{ ucfirst($alerta->estado) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-500">{{ $alerta->generada_en?->diffForHumans() }}</td>
                        <td class="px-4 py-3 text-right">
                            @if($alerta->estado === 'pendiente')
                            <form method="POST" action="{{ route('alertas.update', $alerta) }}" class="inline">
                                @csrf @method('PUT')
                                <button type="submit" class="text-sm text-green-dark hover:underline">Resolver</button>
                            </form>
                            @endif
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="px-4 py-8 text-center text-gray-400 text-sm">No hay alertas pendientes.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
            <div class="px-4 py-3 border-t border-gray-100">
                {{ $alertas->links() }}
            </div>
        </div>
    </div>
</x-layouts.app>
