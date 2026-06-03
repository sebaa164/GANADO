@extends('layouts.app')
@section('title', 'Animales — GanadoVision')

@section('content')
<style>
    .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
    .page-title  { font-size:22px; font-weight:700; color:#111827; }
    .btn-primary {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 18px; border-radius:10px;
        background:#2D6A2D; color:#fff;
        font-size:13px; font-weight:600;
        text-decoration:none; border:none; cursor:pointer;
        font-family:'Inter',sans-serif;
        transition:background .15s, transform .1s;
    }
    .btn-primary:hover { background:#246024; transform:translateY(-1px); }
    .btn-primary svg { width:15px; height:15px; stroke:white; fill:none; }

    .data-card {
        background:#fff; border:1px solid #e5e7eb;
        border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.05);
        overflow:hidden;
    }
    table { width:100%; border-collapse:collapse; }
    thead { background:#f9fafb; }
    th {
        padding:12px 16px; text-align:left;
        font-size:11px; font-weight:600;
        text-transform:uppercase; letter-spacing:.06em;
        color:#9ca3af; white-space:nowrap;
    }
    td { padding:13px 16px; font-size:14px; color:#374151; border-top:1px solid #f3f4f6; }
    tr:hover td { background:#fafafa; }
    .badge {
        display:inline-flex; align-items:center;
        padding:3px 9px; border-radius:999px;
        font-size:11px; font-weight:600;
    }
    .link-action { font-size:13px; color:#2D6A2D; text-decoration:none; font-weight:500; }
    .link-action:hover { text-decoration:underline; }
    .table-footer { padding:14px 16px; border-top:1px solid #f3f4f6; }
    .empty-row td { text-align:center; padding:48px; color:#9ca3af; }
</style>

<div class="page-header">
    <div class="page-title">Animales</div>
    <a href="{{ route('animales.create') }}" class="btn-primary">
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Registrar animal
    </a>
</div>

<div class="data-card">
    <table>
        <thead>
            <tr>
                <th>Caravana</th>
                <th>Raza</th>
                <th>Sexo</th>
                <th>Corral</th>
                <th>Estado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @forelse($animales as $animal)
            <tr>
                <td><strong style="color:#111827">{{ $animal->codigo_caravana }}</strong></td>
                <td>{{ $animal->raza ?? '—' }}</td>
                <td>{{ ucfirst($animal->sexo) }}</td>
                <td>{{ $animal->corral->nombre ?? '—' }}</td>
                <td>
                    <span class="badge" style="{{ $animal->activo ? 'background:#f0fdf4;color:#2D6A2D' : 'background:#f3f4f6;color:#6b7280' }}">
                        {{ $animal->activo ? 'Activo' : 'Inactivo' }}
                    </span>
                </td>
                <td style="text-align:right">
                    <a href="{{ route('animales.show', $animal) }}" class="link-action">Ver →</a>
                </td>
            </tr>
            @empty
            <tr class="empty-row"><td colspan="6">No hay animales registrados.</td></tr>
            @endforelse
        </tbody>
    </table>
    <div class="table-footer">{{ $animales->links() }}</div>
</div>
@endsection
