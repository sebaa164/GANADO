@extends('layouts.app')
@section('title', 'Dashboard — GanadoVision')

@section('content')
<style>
    .page-title { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 24px; }

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
        transition: box-shadow .2s;
    }
    .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
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
</style>

<div class="page-title">Dashboard</div>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-header">
            <span class="stat-label">Peso Promedio</span>
            <div class="stat-icon" style="background:#f0fdf4; color:#2D6A2D">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
            </div>
        </div>
        <div class="stat-value" style="color:#2D6A2D">{{ $pesoPromedio ?? '—' }} <small style="font-size:16px;font-weight:500">kg</small></div>
        <div class="stat-sub">Últimos 30 días</div>
    </div>

    <div class="stat-card">
        <div class="stat-header">
            <span class="stat-label">Total Animales</span>
            <div class="stat-icon" style="background:#eff6ff; color:#2563eb">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
        </div>
        <div class="stat-value" style="color:#2563eb">{{ $totalAnimales ?? 0 }}</div>
        <div class="stat-sub">Registrados activos</div>
    </div>

    <div class="stat-card">
        <div class="stat-header">
            <span class="stat-label">Alertas Pendientes</span>
            <div class="stat-icon" style="background:#fff1f0; color:#C94A3F">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
        </div>
        <div class="stat-value" style="color:#C94A3F">{{ $alertasPendientes ?? 0 }}</div>
        <div class="stat-sub">Requieren atención</div>
    </div>

    <div class="stat-card">
        <div class="stat-header">
            <span class="stat-label">Temperatura</span>
            <div class="stat-icon" style="background:#fffbeb; color:#d97706">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
            </div>
        </div>
        <div class="stat-value" style="color:#d97706">{{ $temperatura ?? '—' }}<small style="font-size:16px;font-weight:500">°C</small></div>
        <div class="stat-sub">Registro más reciente</div>
    </div>
</div>

@if($alertasRecientes && $alertasRecientes->count() > 0)
<div class="section-card">
    <div class="section-header">
        <span class="section-title">Alertas Recientes</span>
        <a href="{{ route('alertas.index') }}" style="font-size:13px;color:#2D6A2D;text-decoration:none;font-weight:500">Ver todas →</a>
    </div>
    <ul class="alert-list">
        @foreach($alertasRecientes as $alerta)
        <li class="alert-row">
            <div>
                <div class="alert-name">{{ $alerta->tipo_anomalia }}</div>
                <div class="alert-desc">{{ $alerta->descripcion }}</div>
            </div>
            <span class="badge" style="{{ $alerta->prioridad === 'alta' ? 'background:#fff1f0;color:#C94A3F' : 'background:#fffbeb;color:#d97706' }}">
                {{ ucfirst($alerta->prioridad) }}
            </span>
        </li>
        @endforeach
    </ul>
</div>
@else
<div class="section-card">
    <div class="section-header"><span class="section-title">Alertas Recientes</span></div>
    <div class="empty-state">No hay alertas pendientes.</div>
</div>
@endif
@endsection
