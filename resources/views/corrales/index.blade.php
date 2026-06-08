@extends('layouts.app')
@section('title', 'Corrales — GanadoVision')

@section('content')
<style>
    .page-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
    }
    .page-title { font-size: 22px; font-weight: 700; color: #111827; }

    .btn-primary {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 9px 18px; border-radius: 10px;
        background: #3B6D11; color: #fff;
        font-size: 13px; font-weight: 600;
        text-decoration: none; transition: background .15s, transform .1s;
    }
    .btn-primary:hover { background: #2D6A2D; transform: translateY(-1px); }
    .btn-primary svg { width: 15px; height: 15px; stroke: white; fill: none; }

    /* Grid de cards */
    .corrales-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 16px;
    }

    .corral-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 1px 4px rgba(0,0,0,.05);
        transition: box-shadow .2s, transform .2s;
        display: flex; flex-direction: column; gap: 14px;
    }
    .corral-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-2px); }

    /* Cabecera de la card */
    .corral-head {
        display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
    }
    .corral-icon {
        width: 40px; height: 40px; border-radius: 11px;
        background: #eef6ee; color: #3B6D11;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .corral-icon svg { width: 20px; height: 20px; stroke: currentColor; fill: none; }
    .corral-name { font-size: 15px; font-weight: 700; color: #111827; line-height: 1.3; }
    .corral-sub  { font-size: 12px; color: #9ca3af; margin-top: 2px; }

    .badge {
        display: inline-flex; align-items: center;
        padding: 3px 9px; border-radius: 999px;
        font-size: 11px; font-weight: 600; white-space: nowrap;
    }

    /* Barra de ocupación */
    .occ-row {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 6px;
    }
    .occ-label { font-size: 12px; font-weight: 500; color: #6b7280; }
    .occ-value { font-size: 12px; font-weight: 600; }
    .cap-bar-track {
        height: 7px; background: #f3f4f6;
        border-radius: 999px; overflow: hidden;
    }
    .cap-bar-fill {
        height: 100%; border-radius: 999px;
        transition: width .5s ease;
    }

    /* Stats row */
    .corral-stats {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
    .stat-item {
        background: #f9fafb; border-radius: 10px;
        padding: 10px 12px;
    }
    .stat-item-label { font-size: 11px; color: #9ca3af; margin-bottom: 3px; }
    .stat-item-value { font-size: 18px; font-weight: 700; line-height: 1; }

    /* Acciones */
    .corral-actions {
        display: flex; align-items: center; justify-content: space-between;
        padding-top: 4px; border-top: 1px solid #f3f4f6;
    }
    .link-action { font-size: 13px; color: #639922; text-decoration: none; font-weight: 500; }
    .link-action:hover { color: #3B6D11; text-decoration: underline; }
    .link-secondary { font-size: 13px; color: #9ca3af; text-decoration: none; }
    .link-secondary:hover { color: #374151; }

    /* Estado vacío */
    .empty-state {
        grid-column: 1 / -1;
        text-align: center; padding: 64px 20px;
        font-size: 14px; color: #9ca3af;
    }
    .empty-icon {
        width: 48px; height: 48px; margin: 0 auto 14px;
        background: #f3f4f6; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #d1d5db;
    }
    .empty-icon svg { width: 24px; height: 24px; stroke: currentColor; fill: none; }
</style>

<div class="page-header">
    <div>
        <div class="page-title">Corrales</div>
        <div style="font-size:13px;color:#9ca3af;margin-top:2px">
            {{ $corrales->count() }} {{ $corrales->count() === 1 ? 'corral activo' : 'corrales activos' }}
        </div>
    </div>
    <a href="{{ route('corrales.create') }}" class="btn-primary">
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Nuevo corral
    </a>
</div>

<div class="corrales-grid">
    @forelse($corrales as $corral)
    @php
        $max      = $corral->capacidad_maxima > 0 ? $corral->capacidad_maxima : 1;
        $actual   = $corral->animales_count ?? 0;
        $alertas  = $corral->alertas_pendientes_count ?? 0;
        $pct      = min(100, round($actual / $max * 100));
        $barColor = $pct >= 90 ? '#C94A3F' : ($pct >= 70 ? '#BA7517' : '#639922');
        $pctLabel = $pct >= 90 ? '#C94A3F' : ($pct >= 70 ? '#BA7517' : '#3B6D11');
    @endphp
    <div class="corral-card">

        {{-- Cabecera --}}
        <div class="corral-head">
            <div style="display:flex;align-items:center;gap:12px">
                <div class="corral-icon">
                    <svg viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                </div>
                <div>
                    <div class="corral-name">
                        {{ $corral->descripcion ?: 'Corral #'.$corral->id }}
                    </div>
                    <div class="corral-sub">Cap. máx. {{ $corral->capacidad_maxima ?? '—' }} animales</div>
                </div>
            </div>
            @if($alertas > 0)
                <span class="badge" style="background:#fff1f0;color:#C94A3F">
                    {{ $alertas }} {{ $alertas === 1 ? 'alerta' : 'alertas' }}
                </span>
            @else
                <span class="badge" style="background:#f0fdf4;color:#639922">Sin alertas</span>
            @endif
        </div>

        {{-- Barra de ocupación --}}
        <div>
            <div class="occ-row">
                <span class="occ-label">Ocupacion</span>
                <span class="occ-value" style="color:{{ $pctLabel }}">{{ $actual }} / {{ $corral->capacidad_maxima ?? '?' }} ({{ $pct }}%)</span>
            </div>
            <div class="cap-bar-track">
                <div class="cap-bar-fill" style="width:{{ $pct }}%;background:{{ $barColor }}"></div>
            </div>
        </div>

        {{-- Stats --}}
        <div class="corral-stats">
            <div class="stat-item">
                <div class="stat-item-label">Animales activos</div>
                <div class="stat-item-value" style="color:#3B6D11">{{ $actual }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-item-label">Lugares libres</div>
                <div class="stat-item-value" style="color:{{ max(0, $max - $actual) > 0 ? '#6b7280' : '#C94A3F' }}">
                    {{ max(0, ($corral->capacidad_maxima ?? 0) - $actual) }}
                </div>
            </div>
        </div>

        {{-- Acciones --}}
        <div class="corral-actions">
            <a href="{{ route('corrales.show', $corral) }}" class="link-action">Ver detalle</a>
            <a href="{{ route('corrales.edit', $corral) }}" class="link-secondary">Editar</a>
        </div>

    </div>
    @empty
    <div class="empty-state">
        <div class="empty-icon">
            <svg viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
        </div>
        No hay corrales registrados.
    </div>
    @endforelse
</div>

@endsection
