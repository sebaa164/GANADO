@extends('layouts.app')
@section('title', 'Alertas — GanadoVision')

@section('content')
<style>
    .page-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap; gap: 12px;
    }
    .page-title { font-size: 22px; font-weight: 700; color: #111827; }

    /* Barra de filtros */
    .filters-bar {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }
    .filter-group { display: flex; flex-direction: column; gap: 4px; }
    .filter-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; }
    .filter-select, .filter-input {
        height: 34px;
        padding: 0 10px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 13px;
        color: #374151;
        background: #f9fafb;
        font-family: 'Inter', sans-serif;
        outline: none;
        transition: border-color .15s;
        min-width: 140px;
    }
    .filter-select:focus, .filter-input:focus { border-color: #639922; background: #fff; }
    .filter-sep { width: 1px; height: 32px; background: #e5e7eb; margin: 0 4px; }
    .btn-clear {
        height: 34px; padding: 0 14px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background: #fff;
        font-size: 13px; color: #6b7280; font-weight: 500;
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: background .1s, color .1s;
    }
    .btn-clear:hover { background: #f3f4f6; color: #374151; }

    /* Chips de filtro activo */
    .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
    .chip {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px; font-weight: 500;
        background: #eef6ee; color: #3B6D11;
        border: 1px solid #c8e6c9;
    }
    .chip a { color: inherit; text-decoration: none; font-weight: 700; margin-left: 2px; }
    .chip a:hover { color: #C94A3F; }

    /* Tabla */
    .data-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 1px 4px rgba(0,0,0,.05);
        overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f9fafb; }
    th {
        padding: 12px 16px;
        text-align: left;
        font-size: 11px; font-weight: 600;
        text-transform: uppercase; letter-spacing: .06em;
        color: #9ca3af; white-space: nowrap;
    }
    td { padding: 13px 16px; font-size: 14px; color: #374151; border-top: 1px solid #f3f4f6; }
    tr:hover td { background: #fafafa; }

    .badge {
        display: inline-flex; align-items: center;
        padding: 3px 9px;
        border-radius: 999px;
        font-size: 11px; font-weight: 600;
    }

    /* Prioridad icon */
    .prio-icon {
        display: inline-flex; align-items: center; justify-content: center;
        width: 28px; height: 28px; border-radius: 8px;
        margin-right: 6px; flex-shrink: 0; vertical-align: middle;
    }
    .prio-icon svg { width: 14px; height: 14px; stroke: currentColor; fill: none; }

    .btn-resolve {
        padding: 5px 12px; border-radius: 8px;
        background: #f0fdf4; color: #2D6A2D;
        border: 1px solid #bbf7d0;
        font-size: 12px; font-weight: 600;
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: background .1s;
    }
    .btn-resolve:hover { background: #dcfce7; }
    .table-footer {
        padding: 14px 16px;
        border-top: 1px solid #f3f4f6;
        display: flex; align-items: center; justify-content: space-between;
        font-size: 13px; color: #9ca3af;
    }
    .empty-state {
        padding: 56px 20px;
        text-align: center;
        font-size: 14px;
        color: #9ca3af;
    }
    .empty-icon {
        width: 44px; height: 44px;
        margin: 0 auto 12px;
        background: #f3f4f6; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #d1d5db;
    }
    .empty-icon svg { width: 22px; height: 22px; stroke: currentColor; fill: none; }
</style>

<div class="page-header">
    <div class="page-title">Alertas</div>
    <span style="font-size:13px;color:#9ca3af">
        {{ $alertas->total() }} {{ $alertas->total() === 1 ? 'alerta' : 'alertas' }}
    </span>
</div>

{{-- Barra de filtros --}}
<form method="GET" action="{{ route('alertas.index') }}"
      x-data
      @change="$el.submit()">

    <div class="filters-bar">

        <div class="filter-group">
            <span class="filter-label">Severidad</span>
            <select name="severidad" class="filter-select">
                <option value="">Todas</option>
                <option value="alta"  {{ $severidad === 'alta'  ? 'selected' : '' }}>Critica</option>
                <option value="media" {{ $severidad === 'media' ? 'selected' : '' }}>Advertencia</option>
                <option value="baja"  {{ $severidad === 'baja'  ? 'selected' : '' }}>Normal</option>
            </select>
        </div>

        <div class="filter-group">
            <span class="filter-label">Estado</span>
            <select name="estado" class="filter-select">
                <option value="pendiente" {{ ($estado ?? 'pendiente') === 'pendiente' ? 'selected' : '' }}>Pendientes</option>
                <option value="resuelta"  {{ $estado === 'resuelta' ? 'selected' : '' }}>Resueltas</option>
                <option value="todas"     {{ $estado === 'todas'    ? 'selected' : '' }}>Todas</option>
            </select>
        </div>

        @if($tiposDisponibles->count() > 0)
        <div class="filter-group">
            <span class="filter-label">Tipo</span>
            <select name="tipo" class="filter-select">
                <option value="">Todos</option>
                @foreach($tiposDisponibles as $t)
                    <option value="{{ $t }}" {{ $tipo === $t ? 'selected' : '' }}>{{ $t }}</option>
                @endforeach
            </select>
        </div>
        @endif

        @if($severidad || ($estado && $estado !== 'pendiente') || $tipo)
            <div class="filter-sep"></div>
            <a href="{{ route('alertas.index') }}" class="btn-clear">Limpiar filtros</a>
        @endif

    </div>
</form>

{{-- Chips de filtros activos --}}
@if($severidad || ($estado && $estado !== 'pendiente') || $tipo)
<div class="filter-chips">
    @if($severidad)
        @php $label = ['alta'=>'Critica','media'=>'Advertencia','baja'=>'Normal'][$severidad] ?? $severidad; @endphp
        <span class="chip">
            Severidad: {{ $label }}
            <a href="{{ request()->fullUrlWithQuery(['severidad' => null, 'page' => null]) }}">x</a>
        </span>
    @endif
    @if($estado && $estado !== 'pendiente')
        <span class="chip">
            Estado: {{ ucfirst($estado) }}
            <a href="{{ request()->fullUrlWithQuery(['estado' => 'pendiente', 'page' => null]) }}">x</a>
        </span>
    @endif
    @if($tipo)
        <span class="chip">
            Tipo: {{ $tipo }}
            <a href="{{ request()->fullUrlWithQuery(['tipo' => null, 'page' => null]) }}">x</a>
        </span>
    @endif
</div>
@endif

{{-- Tabla --}}
<div class="data-card">
    @if($alertas->count() > 0)
    <table>
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Animal</th>
                <th>Corral</th>
                <th>Severidad</th>
                <th>Estado</th>
                <th>Generada</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach($alertas as $alerta)
            @php
                $prioConf = match($alerta->prioridad) {
                    'alta'  => ['bg' => '#fff1f0', 'text' => '#C94A3F', 'label' => 'Critica',      'iconBg' => '#fff1f0'],
                    'media' => ['bg' => '#fef8ee', 'text' => '#BA7517', 'label' => 'Advertencia',  'iconBg' => '#fef8ee'],
                    default => ['bg' => '#f0fdf4', 'text' => '#639922', 'label' => 'Normal',        'iconBg' => '#f0fdf4'],
                };
                $estadoConf = match($alerta->estado) {
                    'pendiente' => ['bg' => '#fff7ed', 'text' => '#ea580c'],
                    'resuelta'  => ['bg' => '#f0fdf4', 'text' => '#639922'],
                    default     => ['bg' => '#f3f4f6', 'text' => '#6b7280'],
                };
            @endphp
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:4px">
                        <div class="prio-icon" style="background:{{ $prioConf['iconBg'] }};color:{{ $prioConf['text'] }}">
                            @if($alerta->prioridad === 'alta')
                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            @elseif($alerta->prioridad === 'media')
                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            @else
                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            @endif
                        </div>
                        <strong style="color:#111827">{{ $alerta->tipo_anomalia }}</strong>
                    </div>
                    @if($alerta->descripcion)
                    <div style="font-size:12px;color:#9ca3af;margin-top:3px;padding-left:34px">{{ Str::limit($alerta->descripcion, 60) }}</div>
                    @endif
                </td>
                <td>{{ $alerta->animal->codigo_caravana ?? '—' }}</td>
                <td>{{ $alerta->corral->descripcion ?? '—' }}</td>
                <td>
                    <span class="badge" style="background:{{ $prioConf['bg'] }};color:{{ $prioConf['text'] }}">
                        {{ $prioConf['label'] }}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:{{ $estadoConf['bg'] }};color:{{ $estadoConf['text'] }}">
                        {{ ucfirst($alerta->estado) }}
                    </span>
                </td>
                <td style="color:#9ca3af;font-size:12px;white-space:nowrap">
                    {{ $alerta->generada_en?->diffForHumans() }}
                </td>
                <td style="text-align:right">
                    @if($alerta->estado === 'pendiente')
                    <form method="POST" action="{{ route('alertas.update', $alerta) }}" style="display:inline">
                        @csrf @method('PUT')
                        <button type="submit" class="btn-resolve">Resolver</button>
                    </form>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="table-footer">
        <span>Mostrando {{ $alertas->firstItem() }}–{{ $alertas->lastItem() }} de {{ $alertas->total() }}</span>
        {{ $alertas->links() }}
    </div>
    @else
    <div class="empty-state">
        <div class="empty-icon">
            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        No hay alertas que coincidan con los filtros seleccionados.
    </div>
    @endif
</div>

@endsection
