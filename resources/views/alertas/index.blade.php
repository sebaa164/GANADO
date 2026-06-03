@extends('layouts.app')
@section('title', 'Alertas — GanadoVision')

@section('content')
<style>
    .page-title { font-size:22px; font-weight:700; color:#111827; margin-bottom:24px; }
    .data-card  { background:#fff; border:1px solid #e5e7eb; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.05); overflow:hidden; }
    table { width:100%; border-collapse:collapse; }
    thead { background:#f9fafb; }
    th { padding:12px 16px; text-align:left; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:#9ca3af; white-space:nowrap; }
    td { padding:13px 16px; font-size:14px; color:#374151; border-top:1px solid #f3f4f6; }
    tr:hover td { background:#fafafa; }
    .badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
    .btn-resolve {
        padding:5px 12px; border-radius:8px;
        background:#f0fdf4; color:#2D6A2D;
        border:1px solid #bbf7d0;
        font-size:12px; font-weight:600;
        cursor:pointer; font-family:'Inter',sans-serif;
        transition:background .1s;
    }
    .btn-resolve:hover { background:#dcfce7; }
    .table-footer { padding:14px 16px; border-top:1px solid #f3f4f6; }
    .empty-row td { text-align:center; padding:48px; color:#9ca3af; }
</style>

<div class="page-title">Alertas</div>

<div class="data-card">
    <table>
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Animal</th>
                <th>Corral</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Generada</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @forelse($alertas as $alerta)
            <tr>
                <td><strong style="color:#111827">{{ $alerta->tipo_anomalia }}</strong></td>
                <td>{{ $alerta->animal->codigo_caravana ?? '—' }}</td>
                <td>{{ $alerta->corral->nombre ?? '—' }}</td>
                <td>
                    <span class="badge" style="{{ $alerta->prioridad === 'alta' ? 'background:#fff1f0;color:#C94A3F' : 'background:#fffbeb;color:#d97706' }}">
                        {{ ucfirst($alerta->prioridad) }}
                    </span>
                </td>
                <td>
                    <span class="badge" style="{{ $alerta->estado === 'pendiente' ? 'background:#fff7ed;color:#ea580c' : 'background:#f0fdf4;color:#2D6A2D' }}">
                        {{ ucfirst($alerta->estado) }}
                    </span>
                </td>
                <td style="color:#9ca3af; font-size:12px">{{ $alerta->generada_en?->diffForHumans() }}</td>
                <td style="text-align:right">
                    @if($alerta->estado === 'pendiente')
                    <form method="POST" action="{{ route('alertas.update', $alerta) }}" style="display:inline">
                        @csrf @method('PUT')
                        <button type="submit" class="btn-resolve">Resolver</button>
                    </form>
                    @endif
                </td>
            </tr>
            @empty
            <tr class="empty-row"><td colspan="7">No hay alertas pendientes.</td></tr>
            @endforelse
        </tbody>
    </table>
    <div class="table-footer">{{ $alertas->links() }}</div>
</div>
@endsection
