@extends('layouts.app')
@section('title', 'Corrales — GanadoVision')

@section('content')
<style>
    .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
    .page-title  { font-size:22px; font-weight:700; color:#111827; }
    .btn-primary {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 18px; border-radius:10px;
        background:#2D6A2D; color:#fff;
        font-size:13px; font-weight:600;
        text-decoration:none; transition:background .15s, transform .1s;
    }
    .btn-primary:hover { background:#246024; transform:translateY(-1px); }
    .btn-primary svg { width:15px; height:15px; stroke:white; fill:none; }

    .corrales-grid {
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap:16px;
    }
    .corral-card {
        background:#fff; border:1px solid #e5e7eb;
        border-radius:16px; padding:20px;
        box-shadow:0 1px 4px rgba(0,0,0,.05);
        transition:box-shadow .2s, transform .2s;
    }
    .corral-card:hover { box-shadow:0 6px 20px rgba(0,0,0,.08); transform:translateY(-2px); }
    .corral-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
    .corral-name { font-size:16px; font-weight:700; color:#111827; }
    .corral-code { font-size:12px; color:#9ca3af; margin-top:2px; }
    .badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }

    .corral-cap {
        display:flex; align-items:center; gap:8px;
        margin-bottom:16px;
    }
    .cap-bar-track {
        flex:1; height:6px; background:#f3f4f6;
        border-radius:999px; overflow:hidden;
    }
    .cap-bar-fill {
        height:100%; border-radius:999px;
        background:#2D6A2D; transition:width .4s;
    }
    .cap-text { font-size:12px; color:#6b7280; white-space:nowrap; }

    .corral-actions { display:flex; gap:10px; }
    .link-action { font-size:13px; color:#2D6A2D; text-decoration:none; font-weight:500; }
    .link-action:hover { text-decoration:underline; }
    .link-secondary { font-size:13px; color:#6b7280; text-decoration:none; }
    .link-secondary:hover { color:#374151; text-decoration:underline; }
    .empty-state { grid-column:1/-1; text-align:center; padding:48px; color:#9ca3af; font-size:14px; }
</style>

<div class="page-header">
    <div class="page-title">Corrales</div>
    <a href="{{ route('corrales.create') }}" class="btn-primary">
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Nuevo corral
    </a>
</div>

<div class="corrales-grid">
    @forelse($corrales as $corral)
    <div class="corral-card">
        <div class="corral-head">
            <div>
                <div class="corral-name">{{ $corral->nombre }}</div>
                <div class="corral-code">Código: {{ $corral->codigo }}</div>
            </div>
            <span class="badge" style="background:#f0fdf4;color:#2D6A2D">Activo</span>
        </div>

        @php $pct = $corral->capacidad_maxima > 0 ? min(100, round($corral->animales_count / $corral->capacidad_maxima * 100)) : 0; @endphp
        <div class="corral-cap">
            <div class="cap-bar-track">
                <div class="cap-bar-fill" style="width:{{ $pct }}%"></div>
            </div>
            <span class="cap-text">{{ $corral->animales_count }} / {{ $corral->capacidad_maxima }}</span>
        </div>

        <div class="corral-actions">
            <a href="{{ route('corrales.show', $corral) }}" class="link-action">Ver detalle →</a>
            <a href="{{ route('corrales.edit', $corral) }}" class="link-secondary">Editar</a>
        </div>
    </div>
    @empty
    <div class="empty-state">No hay corrales registrados.</div>
    @endforelse
</div>
@endsection
