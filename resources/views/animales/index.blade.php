@extends('layouts.app')
@section('title', 'Animales — GanadoVision')

@section('content')
<style>
    .page-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
    }
    .page-title { font-size: 22px; font-weight: 700; color: #111827; }

    .btn-primary {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 9px 18px; border-radius: 10px;
        background: #3B6D11; color: #fff;
        font-size: 13px; font-weight: 600;
        text-decoration: none; border: none; cursor: pointer;
        font-family: 'Inter', sans-serif;
        transition: background .15s, transform .1s;
    }
    .btn-primary:hover { background: #2D6A2D; transform: translateY(-1px); }
    .btn-primary svg { width: 15px; height: 15px; stroke: white; fill: none; }

    /* Barra de filtros */
    .filters-bar {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 14px 18px;
        display: flex; align-items: flex-end; gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }
    .filter-group { display: flex; flex-direction: column; gap: 4px; }
    .filter-label {
        font-size: 11px; font-weight: 600;
        color: #9ca3af; text-transform: uppercase; letter-spacing: .04em;
    }
    .filter-select, .filter-input {
        height: 34px; padding: 0 10px;
        border: 1px solid #e5e7eb; border-radius: 8px;
        font-size: 13px; color: #374151;
        background: #f9fafb; font-family: 'Inter', sans-serif;
        outline: none; transition: border-color .15s;
    }
    .filter-input { min-width: 200px; }
    .filter-select { min-width: 140px; }
    .filter-select:focus, .filter-input:focus { border-color: #639922; background: #fff; }
    .filter-sep { width: 1px; height: 32px; background: #e5e7eb; margin: 0 4px; align-self: center; }
    .btn-clear {
        height: 34px; padding: 0 14px; border-radius: 8px;
        border: 1px solid #e5e7eb; background: #fff;
        font-size: 13px; color: #6b7280; font-weight: 500;
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: background .1s;
    }
    .btn-clear:hover { background: #f3f4f6; color: #374151; }

    /* Chips */
    .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
    .chip {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 4px 10px; border-radius: 999px;
        font-size: 12px; font-weight: 500;
        background: #eef6ee; color: #3B6D11; border: 1px solid #c8e6c9;
    }
    .chip a { color: inherit; text-decoration: none; font-weight: 700; margin-left: 2px; }
    .chip a:hover { color: #C94A3F; }

    /* Tabla */
    .data-card {
        background: #fff; border: 1px solid #e5e7eb;
        border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05);
        overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f9fafb; }
    th {
        padding: 12px 16px; text-align: left;
        font-size: 11px; font-weight: 600;
        text-transform: uppercase; letter-spacing: .06em;
        color: #9ca3af; white-space: nowrap;
    }
    td { padding: 13px 16px; font-size: 14px; color: #374151; border-top: 1px solid #f3f4f6; }
    tr:hover td { background: #fafafa; }

    .badge {
        display: inline-flex; align-items: center;
        padding: 3px 9px; border-radius: 999px;
        font-size: 11px; font-weight: 600;
    }
    .animal-avatar {
        width: 32px; height: 32px; border-radius: 8px;
        background: #eef6ee; color: #3B6D11;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; margin-right: 8px;
        flex-shrink: 0; vertical-align: middle;
    }
    .link-action { font-size: 13px; color: #639922; text-decoration: none; font-weight: 500; }
    .link-action:hover { color: #3B6D11; text-decoration: underline; }
    .table-footer {
        padding: 14px 16px; border-top: 1px solid #f3f4f6;
        display: flex; align-items: center; justify-content: space-between;
        font-size: 13px; color: #9ca3af;
    }
    .empty-state {
        padding: 56px 20px; text-align: center;
        font-size: 14px; color: #9ca3af;
    }
    .empty-icon {
        width: 44px; height: 44px; margin: 0 auto 12px;
        background: #f3f4f6; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #d1d5db;
    }
    .empty-icon svg { width: 22px; height: 22px; stroke: currentColor; fill: none; }
</style>

<div class="page-header">
    <div>
        <div class="page-title">Animales</div>
        <div style="font-size:13px;color:#9ca3af;margin-top:2px">
            {{ $animales->total() }} {{ $animales->total() === 1 ? 'animal' : 'animales' }} encontrados
        </div>
    </div>
    <a href="{{ route('animales.create') }}" class="btn-primary">
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Registrar animal
    </a>
</div>

{{-- Barra de filtros --}}
<form method="GET" action="{{ route('animales.index') }}"
      x-data
      id="filters-form">
    <div class="filters-bar">

        <div class="filter-group">
            <span class="filter-label">Buscar</span>
            <input type="text"
                   name="busqueda"
                   value="{{ $busqueda }}"
                   placeholder="Caravana o raza..."
                   class="filter-input"
                   @keydown.enter.prevent="$el.closest('form').submit()">
        </div>

        <div class="filter-group">
            <span class="filter-label">Estado</span>
            <select name="estado" class="filter-select" @change="$el.closest('form').submit()">
                <option value="activos"   {{ ($estado ?? 'activos') === 'activos'   ? 'selected' : '' }}>Activos</option>
                <option value="inactivos" {{ $estado === 'inactivos' ? 'selected' : '' }}>Inactivos</option>
                <option value="todos"     {{ $estado === 'todos'     ? 'selected' : '' }}>Todos</option>
            </select>
        </div>

        @if($corralesDisponibles->count() > 0)
        <div class="filter-group">
            <span class="filter-label">Corral</span>
            <select name="corral" class="filter-select" @change="$el.closest('form').submit()">
                <option value="">Todos</option>
                @foreach($corralesDisponibles as $c)
                    <option value="{{ $c->id }}" {{ (string)$corralId === (string)$c->id ? 'selected' : '' }}>
                        {{ $c->descripcion ?: 'Corral #'.$c->id }}
                    </option>
                @endforeach
            </select>
        </div>
        @endif

        @if($razasDisponibles->count() > 0)
        <div class="filter-group">
            <span class="filter-label">Raza</span>
            <select name="raza" class="filter-select" @change="$el.closest('form').submit()">
                <option value="">Todas</option>
                @foreach($razasDisponibles as $r)
                    <option value="{{ $r }}" {{ $raza === $r ? 'selected' : '' }}>{{ $r }}</option>
                @endforeach
            </select>
        </div>
        @endif

        <div style="display:flex;gap:8px;align-items:center;margin-top:auto">
            <button type="submit" class="btn-primary" style="height:34px;padding:0 14px">
                Buscar
            </button>

            @if($busqueda || $corralId || $raza || ($estado && $estado !== 'activos'))
            <div class="filter-sep"></div>
            <a href="{{ route('animales.index') }}" class="btn-clear">Limpiar</a>
            @endif
        </div>

    </div>
</form>

{{-- Chips de filtros activos --}}
@if($busqueda || $corralId || $raza || ($estado && $estado !== 'activos'))
<div class="filter-chips">
    @if($busqueda)
        <span class="chip">
            Busqueda: "{{ $busqueda }}"
            <a href="{{ request()->fullUrlWithQuery(['busqueda' => null, 'page' => null]) }}">x</a>
        </span>
    @endif
    @if($estado && $estado !== 'activos')
        <span class="chip">
            Estado: {{ ucfirst($estado) }}
            <a href="{{ request()->fullUrlWithQuery(['estado' => 'activos', 'page' => null]) }}">x</a>
        </span>
    @endif
    @if($corralId)
        @php $nombreCorral = $corralesDisponibles->firstWhere('id', $corralId)?->descripcion ?? 'Corral #'.$corralId; @endphp
        <span class="chip">
            Corral: {{ $nombreCorral }}
            <a href="{{ request()->fullUrlWithQuery(['corral' => null, 'page' => null]) }}">x</a>
        </span>
    @endif
    @if($raza)
        <span class="chip">
            Raza: {{ $raza }}
            <a href="{{ request()->fullUrlWithQuery(['raza' => null, 'page' => null]) }}">x</a>
        </span>
    @endif
</div>
@endif

{{-- Tabla --}}
<div class="data-card">
    @if($animales->count() > 0)
    <table>
        <thead>
            <tr>
                <th>Animal</th>
                <th>Raza</th>
                <th>Sexo</th>
                <th>Corral</th>
                <th>Peso ingreso</th>
                <th>Fecha ingreso</th>
                <th>Estado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach($animales as $animal)
            <tr>
                <td>
                    <div style="display:flex;align-items:center">
                        <div class="animal-avatar">
                            {{ strtoupper(substr($animal->codigo_caravana, 0, 2)) }}
                        </div>
                        <div>
                            <div style="font-weight:600;color:#111827">{{ $animal->codigo_caravana }}</div>
                            @if($animal->estado_sanitario)
                            <div style="font-size:11px;color:#9ca3af;margin-top:1px">{{ $animal->estado_sanitario }}</div>
                            @endif
                        </div>
                    </div>
                </td>
                <td>{{ $animal->raza ?? '—' }}</td>
                <td>
                    <span class="badge" style="{{ $animal->sexo === 'macho' ? 'background:#eff6ff;color:#2563eb' : 'background:#fdf2f8;color:#9d174d' }}">
                        {{ ucfirst($animal->sexo) }}
                    </span>
                </td>
                <td>{{ $animal->corral?->descripcion ?? '—' }}</td>
                <td style="font-weight:600;color:#3B6D11">
                    {{ $animal->peso_ingreso_kg ? number_format($animal->peso_ingreso_kg, 1).' kg' : '—' }}
                </td>
                <td style="color:#9ca3af;font-size:12px;white-space:nowrap">
                    {{ $animal->fecha_ingreso?->format('d/m/Y') ?? '—' }}
                </td>
                <td>
                    <span class="badge" style="{{ $animal->activo ? 'background:#f0fdf4;color:#639922' : 'background:#f3f4f6;color:#6b7280' }}">
                        {{ $animal->activo ? 'Activo' : 'Inactivo' }}
                    </span>
                </td>
                <td style="text-align:right">
                    <a href="{{ route('animales.show', $animal) }}" class="link-action">Ver</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="table-footer">
        <span>Mostrando {{ $animales->firstItem() }}–{{ $animales->lastItem() }} de {{ $animales->total() }}</span>
        {{ $animales->links() }}
    </div>
    @else
    <div class="empty-state">
        <div class="empty-icon">
            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        </div>
        @if($busqueda || $corralId || $raza)
            No hay animales que coincidan con los filtros seleccionados.
        @else
            No hay animales registrados.
        @endif
    </div>
    @endif
</div>

@endsection
