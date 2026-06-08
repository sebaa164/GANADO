@extends('layouts.app')
@section('title', 'Dashboard — GanadoVision')

@section('content')
<style>
    .page-title { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 24px; }

    /* KPI grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 28px;
    }
    .stat-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        transition: box-shadow .2s, transform .2s;
    }
    .stat-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        transform: translateY(-1px);
    }
    .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .stat-label  { font-size: 13px; font-weight: 500; color: #6b7280; }
    .stat-icon   {
        width: 36px; height: 36px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .stat-icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; }
    .stat-value  { font-size: 32px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
    .stat-sub    { font-size: 12px; color: #9ca3af; }
    .stat-unit   { font-size: 16px; font-weight: 500; }

    /* Pill de tendencia */
    .stat-trend {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        margin-top: 6px;
    }
    .stat-trend svg { width: 11px; height: 11px; stroke: currentColor; fill: none; flex-shrink: 0; }

    /* Skeleton loader */
    .skeleton {
        background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
        border-radius: 6px;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* Alertas */
    .badge {
        display: inline-flex; align-items: center;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 11px; font-weight: 600;
    }
    .section-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        overflow: hidden;
    }
    .section-header {
        padding: 18px 20px;
        border-bottom: 1px solid #f3f4f6;
        display: flex; align-items: center; justify-content: space-between;
    }
    .section-title { font-size: 15px; font-weight: 600; color: #111827; }
    .alert-list { list-style: none; }
    .alert-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 20px;
        border-bottom: 1px solid #f9fafb;
        transition: background .1s;
    }
    .alert-row:last-child { border-bottom: none; }
    .alert-row:hover { background: #f9fafb; }
    .alert-name  { font-size: 14px; font-weight: 500; color: #111827; }
    .alert-desc  { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    .empty-state {
        padding: 48px 20px;
        text-align: center;
        font-size: 14px;
        color: #9ca3af;
    }
    .empty-icon {
        width: 40px; height: 40px;
        margin: 0 auto 12px;
        background: #f3f4f6;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #d1d5db;
    }
    .empty-icon svg { width: 20px; height: 20px; stroke: currentColor; fill: none; }

    @media (max-width: 768px) {
        .bottom-grid { grid-template-columns: 1fr !important; }
    }
</style>

<div class="page-title">Dashboard</div>

{{-- ══ KPI CARDS ══ --}}
<div class="stats-grid">

    {{-- Peso Promedio --}}
    <div class="stat-card"
         x-data="countUp({ target: {{ $pesoPromedio ? (float)$pesoPromedio : 0 }}, decimals: 1, duration: 1200 })"
         x-init="start()">
        <div class="stat-header">
            <span class="stat-label">Peso Promedio</span>
            <div class="stat-icon" style="background:#f2f7ec; color:#639922">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
            </div>
        </div>
        @if($pesoPromedio)
            <div class="stat-value" style="color:#3B6D11">
                <span x-text="display"></span> <span class="stat-unit">kg</span>
            </div>
            <div class="stat-sub">Promedio últimos 30 días</div>
        @else
            <div class="stat-value" style="color:#9ca3af">—</div>
            <div class="stat-sub">Sin pesajes registrados</div>
        @endif
    </div>

    {{-- Animales Activos --}}
    <div class="stat-card"
         x-data="countUp({ target: {{ $totalAnimales ?? 0 }}, decimals: 0, duration: 1000 })"
         x-init="start()">
        <div class="stat-header">
            <span class="stat-label">Animales Activos</span>
            <div class="stat-icon" style="background:#eef6ee; color:#3B6D11">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
        </div>
        <div class="stat-value" style="color:#3B6D11">
            <span x-text="display"></span>
        </div>
        @if(($totalAnimales ?? 0) > 0)
            <div class="stat-sub">Registrados y activos</div>
        @else
            <div class="stat-sub">No hay animales registrados</div>
        @endif
    </div>

    {{-- Alertas Activas --}}
    <div class="stat-card"
         x-data="countUp({ target: {{ $alertasPendientes ?? 0 }}, decimals: 0, duration: 900 })"
         x-init="start()">
        <div class="stat-header">
            <span class="stat-label">Alertas Activas</span>
            <div class="stat-icon" style="background:#fef8ee; color:#BA7517">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
        </div>
        <div class="stat-value" style="color:{{ ($alertasPendientes ?? 0) > 0 ? '#C94A3F' : '#BA7517' }}">
            <span x-text="display"></span>
        </div>
        @if(($alertasPendientes ?? 0) > 0)
            <div class="stat-sub" style="color:#C94A3F">Requieren atención</div>
        @else
            <div class="stat-sub">Sin alertas pendientes</div>
        @endif
    </div>

    {{-- Temperatura Ambiente --}}
    <div class="stat-card"
         x-data="countUp({ target: {{ $temperatura ? (float)$temperatura : 0 }}, decimals: 1, duration: 1100 })"
         x-init="start()">
        <div class="stat-header">
            <span class="stat-label">Temperatura Ambiente</span>
            <div class="stat-icon" style="background:#f5fae8; color:#639922">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
            </div>
        </div>
        @if($temperatura)
            <div class="stat-value" style="color:#3B6D11">
                <span x-text="display"></span><span class="stat-unit">°C</span>
            </div>
            <div class="stat-sub">Registro más reciente</div>
        @else
            <div class="stat-value" style="color:#9ca3af">—</div>
            <div class="stat-sub">Sin datos climáticos</div>
        @endif
    </div>

</div>

{{-- ══ ALERTAS RECIENTES ══ --}}
@if($alertasRecientes && $alertasRecientes->count() > 0)
<div class="section-card">
    <div class="section-header">
        <span class="section-title">Alertas Recientes</span>
        <a href="{{ route('alertas.index') }}" style="font-size:13px;color:#639922;text-decoration:none;font-weight:500">Ver todas</a>
    </div>
    <ul class="alert-list">
        @foreach($alertasRecientes as $alerta)
        <li class="alert-row">
            <div>
                <div class="alert-name">{{ $alerta->tipo_anomalia }}</div>
                <div class="alert-desc">{{ $alerta->descripcion }}</div>
            </div>
            @php
                $color = match($alerta->prioridad) {
                    'alta'   => ['bg' => '#fff1f0', 'text' => '#C94A3F'],
                    'media'  => ['bg' => '#fef8ee', 'text' => '#BA7517'],
                    default  => ['bg' => '#f0fdf4', 'text' => '#639922'],
                };
            @endphp
            <span class="badge" style="background:{{ $color['bg'] }};color:{{ $color['text'] }}">
                {{ ucfirst($alerta->prioridad) }}
            </span>
        </li>
        @endforeach
    </ul>
</div>
@else
<div class="section-card">
    <div class="section-header">
        <span class="section-title">Alertas Recientes</span>
    </div>
    <div class="empty-state">
        <div class="empty-icon">
            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        Sin alertas pendientes. El sistema opera con normalidad.
    </div>
</div>
@endif

{{-- ══ FILA INFERIOR: ANIMALES + CORRALES ══ --}}
<div class="bottom-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">

    {{-- Últimos animales ingresados --}}
    <div class="section-card">
        <div class="section-header">
            <span class="section-title">Últimos Ingresos</span>
            <a href="{{ route('animales.index') }}" style="font-size:13px;color:#639922;text-decoration:none;font-weight:500">Ver todos</a>
        </div>

        @if($ultimosAnimales->count() > 0)
        <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
                <thead>
                    <tr style="border-bottom:1px solid #f3f4f6">
                        <th style="padding:10px 20px;text-align:left;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.04em">Caravana</th>
                        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.04em">Raza</th>
                        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.04em">Corral</th>
                        <th style="padding:10px 20px;text-align:right;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.04em">Peso ing.</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($ultimosAnimales as $animal)
                    <tr style="border-bottom:1px solid #f9fafb;transition:background .1s" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                        <td style="padding:12px 20px">
                            <span style="font-weight:600;color:#111827">{{ $animal->codigo_caravana }}</span>
                            <div style="font-size:11px;color:#9ca3af;margin-top:1px">
                                {{ $animal->fecha_ingreso ? $animal->fecha_ingreso->format('d/m/Y') : '—' }}
                            </div>
                        </td>
                        <td style="padding:12px 12px;color:#374151">{{ $animal->raza ?? '—' }}</td>
                        <td style="padding:12px 12px;color:#374151">{{ $animal->corral?->descripcion ?? 'Sin corral' }}</td>
                        <td style="padding:12px 20px;text-align:right;font-weight:600;color:#3B6D11">
                            {{ $animal->peso_ingreso_kg ? number_format($animal->peso_ingreso_kg, 1).' kg' : '—' }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @else
        <div class="empty-state">
            <div class="empty-icon">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            No hay animales registrados.
        </div>
        @endif
    </div>

    {{-- Resumen de corrales --}}
    <div class="section-card">
        <div class="section-header">
            <span class="section-title">Ocupación de Corrales</span>
            <a href="{{ route('corrales.index') }}" style="font-size:13px;color:#639922;text-decoration:none;font-weight:500">Ver todos</a>
        </div>

        @if($corrales->count() > 0)
        <div style="padding:8px 0">
            @foreach($corrales as $corral)
            @php
                $max      = $corral->capacidad_maxima ?: 1;
                $actual   = $corral->animales_count;
                $pct      = min(100, round($actual / $max * 100));
                $barColor = $pct >= 90 ? '#C94A3F' : ($pct >= 70 ? '#BA7517' : '#639922');
            @endphp
            <div style="padding:12px 20px;border-bottom:1px solid #f9fafb">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                    <span style="font-size:13px;font-weight:600;color:#111827">
                        {{ $corral->descripcion ?: 'Corral #'.$corral->id }}
                    </span>
                    <span style="font-size:12px;color:#6b7280">
                        {{ $actual }} / {{ $corral->capacidad_maxima ?? '?' }}
                        <span style="font-weight:600;color:{{ $barColor }};margin-left:4px">{{ $pct }}%</span>
                    </span>
                </div>
                <div style="height:6px;background:#f3f4f6;border-radius:999px;overflow:hidden">
                    <div style="height:100%;width:{{ $pct }}%;background:{{ $barColor }};border-radius:999px;transition:width .4s ease"></div>
                </div>
            </div>
            @endforeach
        </div>
        @else
        <div class="empty-state">
            <div class="empty-icon">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            No hay corrales activos.
        </div>
        @endif
    </div>

</div>

{{-- ══ COUNT-UP ALPINE COMPONENT ══ --}}
<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('countUp', ({ target, decimals = 0, duration = 1000 }) => ({
        display: decimals > 0 ? (0).toFixed(decimals) : '0',
        start() {
            if (target === 0) {
                this.display = decimals > 0 ? (0).toFixed(decimals) : '0';
                return;
            }
            const startTime = performance.now();
            const step = (now) => {
                const elapsed  = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;
                this.display = decimals > 0
                    ? current.toFixed(decimals)
                    : Math.round(current).toString();
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
    }));
});
</script>
@endsection
