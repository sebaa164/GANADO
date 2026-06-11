@extends('layouts.app')
@section('title', 'Configuración — GanadoVision')

@section('content')
@php
    $getConfig = function($clave, $default = '') use ($configuraciones) {
        foreach ($configuraciones as $group => $items) {
            foreach ($items as $item) {
                if ($item->clave === $clave) {
                    return $item->valor;
                }
            }
        }
        return $default;
    };
@endphp

<style>
    .page-header {
        margin-bottom: 24px;
    }
    .page-title { font-size: 24px; font-weight: 700; color: #111827; }
    .page-subtitle { font-size: 14px; color: #6b7280; margin-top: 4px; }

    .grid-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
    }
    @media (min-width: 1024px) {
        .grid-container {
            grid-template-columns: 3fr 2fr;
        }
    }

    .config-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 1px 4px rgba(0,0,0,.05);
        padding: 24px;
        margin-bottom: 24px;
        transition: box-shadow 0.2s;
    }
    .config-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,.08);
    }
    .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 10px;
    }
    .card-title svg {
        width: 18px;
        height: 18px;
        stroke: #2D6A2D;
    }

    .form-group {
        margin-bottom: 16px;
    }
    .form-label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 6px;
    }
    .form-desc {
        font-size: 11px;
        color: #9ca3af;
        margin-top: 4px;
    }
    .form-control {
        width: 100%;
        height: 38px;
        padding: 0 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        color: #374151;
        background: #fff;
        font-family: 'Inter', sans-serif;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-control:focus {
        border-color: #2D6A2D;
        box-shadow: 0 0 0 3px rgba(45, 106, 45, 0.1);
    }
    .form-checkbox {
        width: 16px;
        height: 16px;
        accent-color: #2D6A2D;
        border-radius: 4px;
    }

    .btn-primary {
        background: #2D6A2D;
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        transition: background-color 0.15s, transform 0.1s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .btn-primary:hover {
        background: #224f22;
    }
    .btn-primary:active {
        transform: scale(0.98);
    }

    .btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #e5e7eb;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        transition: background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .btn-secondary:hover {
        background: #e5e7eb;
    }

    /* Estilo del panel del motor de reglas */
    .engine-panel {
        background: #eef6ee;
        border: 1px dashed #b7d8b7;
        border-radius: 12px;
        padding: 18px;
        margin-top: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .engine-title {
        font-size: 14px;
        font-weight: 600;
        color: #2D6A2D;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .engine-title svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
    }

    .result-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
    }
    .badge-created { background: #fee2e2; color: #991b1b; }
    .badge-resolved { background: #dcfce7; color: #166534; }

    .validation-errors {
        background: #fff1f0;
        border: 1px solid #fecaca;
        border-radius: 12px;
        padding: 14px 18px;
        margin-bottom: 24px;
        color: #991b1b;
        font-size: 13px;
    }
    .validation-errors ul {
        margin-left: 20px;
        margin-top: 6px;
        list-style-type: disc;
    }

    /* Spinner */
    .spinner {
        animation: spin 1s linear infinite;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        display: inline-block;
    }
    .spinner-dark {
        border-top-color: #374151;
        border-left-color: #374151;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<div class="page-header">
    <h1 class="page-title">Configuración del Sistema</h1>
    <p class="page-subtitle">Gestiona parámetros de alertas, correos e integración con visión artificial.</p>
</div>

@if ($errors->any())
    <div class="validation-errors">
        <strong>Por favor corrige los siguientes errores:</strong>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="grid-container">
    {{-- Columna izquierda: Formularios de configuración --}}
    <div>
        <form method="POST" action="{{ route('configuracion.update') }}">
            @csrf

            <!-- CARD 1: Límites del Motor de Alertas -->
            <div class="config-card">
                <div class="card-title">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    Límites de Alertas Automáticas
                </div>

                <div class="form-group">
                    <label class="form-label" for="alerta_peso_minimo_kg">Peso Mínimo del Animal (kg)</label>
                    <input type="number" step="0.1" name="alerta_peso_minimo_kg" id="alerta_peso_minimo_kg" class="form-control" 
                           value="{{ old('alerta_peso_minimo_kg', $getConfig('alerta_peso_minimo_kg', 180)) }}">
                    <p class="form-desc">Si un animal activo registra un peso menor a este valor, se disparará una alerta de prioridad alta.</p>
                </div>

                <div class="form-group">
                    <label class="form-label" for="alerta_temperatura_max_c">Temperatura Ambiente Máxima (°C)</label>
                    <input type="number" step="0.5" name="alerta_temperatura_max_c" id="alerta_temperatura_max_c" class="form-control" 
                           value="{{ old('alerta_temperatura_max_c', $getConfig('alerta_temperatura_max_c', 38)) }}">
                    <p class="form-desc">Límite a partir del cual se generarán alertas críticas de estrés térmico en todos los corrales.</p>
                </div>

                <div class="form-group">
                    <label class="form-label" for="alerta_ocupacion_corral_pct">Capacidad de Ocupación de Corral (%)</label>
                    <input type="number" step="1" name="alerta_ocupacion_corral_pct" id="alerta_ocupacion_corral_pct" class="form-control" 
                           value="{{ old('alerta_ocupacion_corral_pct', $getConfig('alerta_ocupacion_corral_pct', 90)) }}">
                    <p class="form-desc">Genera alerta de sobreocupación (prioridad media) cuando la cantidad de animales supere este porcentaje.</p>
                </div>
            </div>

            <!-- CARD 2: Datos Generales e Emails -->
            <div class="config-card">
                <div class="card-title">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    General y Notificaciones
                </div>

                <div class="form-group">
                    <label class="form-label" for="nombre_establecimiento">Nombre del Establecimiento / Feedlot</label>
                    <input type="text" name="nombre_establecimiento" id="nombre_establecimiento" class="form-control" 
                           value="{{ old('nombre_establecimiento', $getConfig('nombre_establecimiento', 'GanadoVision')) }}">
                </div>

                <div class="form-group" style="display:flex;align-items:center;gap:8px;margin-top:20px;margin-bottom:20px">
                    <input type="hidden" name="notificaciones_email_activas" value="0">
                    <input type="checkbox" name="notificaciones_email_activas" id="notificaciones_email_activas" value="1" class="form-checkbox"
                           {{ old('notificaciones_email_activas', $getConfig('notificaciones_email_activas', '0')) == '1' ? 'checked' : '' }}>
                    <label class="form-label" for="notificaciones_email_activas" style="margin-bottom:0;cursor:pointer">Activar envío de correo electrónico para alertas críticas</label>
                </div>

                <div class="form-group">
                    <label class="form-label" for="notificaciones_email_destino">Correo de Destino de Notificaciones</label>
                    <input type="email" name="notificaciones_email_destino" id="notificaciones_email_destino" class="form-control" 
                           value="{{ old('notificaciones_email_destino', $getConfig('notificaciones_email_destino', '')) }}">
                    <p class="form-desc">Los correos con detalles de alertas críticas se enviarán a esta dirección.</p>
                </div>
            </div>

            <div style="margin-bottom:30px">
                <button type="submit" class="btn-primary">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Guardar Configuración
                </button>
            </div>
        </form>
    </div>

    {{-- Columna derecha: Consola de ejecución manual --}}
    <div>
        <div class="config-card" 
             x-data="{
                loading: false,
                result: null,
                error: null,
                async runEngine() {
                    this.loading = true;
                    this.result = null;
                    this.error = null;
                    try {
                        let response = await fetch('{{ route('configuracion.run-rules') }}', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-CSR-Token': '{{ csrf_token() }}'
                            }
                        });
                        let data = await response.json();
                        if (data.success) {
                            this.result = data;
                        } else {
                            this.error = data.message || 'Error al ejecutar el motor de reglas.';
                        }
                    } catch (e) {
                        this.error = 'Ocurrió un error de conexión al procesar la solicitud.';
                    } finally {
                        this.loading = false;
                    }
                }
             }">
            <div class="card-title">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                Motor de Reglas en Vivo
            </div>

            <p style="font-size:13px;color:#4b5563;line-height:1.5">
                El motor de reglas evalúa las caravanas de animales, el clima actual y la ocupación de cada corral para disparar nuevas alertas o resolverlas de forma automática.
            </p>

            <div class="engine-panel">
                <div class="engine-title">
                    <svg fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    Ejecución Programada
                </div>
                <p style="font-size:12px;color:#6b7280">
                    Se ejecuta en segundo plano de manera continua ante eventos y cada hora como salvaguarda mediante el planificador.
                </p>
            </div>

            <div style="margin-top:20px">
                <button type="button" @click="runEngine()" :disabled="loading" class="btn-secondary w-full" style="width:100%">
                    <template x-if="loading">
                        <span class="spinner spinner-dark" style="margin-right:6px"></span>
                    </template>
                    <template x-if="!loading">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:4px"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </template>
                    <span x-text="loading ? 'Procesando...' : 'Ejecutar Motor de Reglas Ahora'"></span>
                </button>
            </div>

            <!-- Div de Resultados interactivos -->
            <div x-show="result" style="margin-top:20px;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px" x-cloak>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px">
                    <svg fill="none" viewBox="0 0 24 24" stroke="#166534" stroke-width="2.5" style="width:18px;height:18px"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span style="font-size:13px;font-weight:600;color:#166534" x-text="result.message"></span>
                </div>

                <div style="font-size:12px;color:#4b5563;display:grid;grid-template-columns:1fr 1fr;gap:8px;border-top:1px solid #e5e7eb;padding-top:12px">
                    <div><strong>Categoría de Regla</strong></div>
                    <div style="text-align:right"><strong>Estado de Alertas</strong></div>

                    <div>Pesaje de Animales</div>
                    <div style="text-align:right">
                        <span class="result-badge badge-created" x-text="'+' + result.detalles.peso_alertas_creadas"></span>
                        <span class="result-badge badge-resolved" x-text="'✓' + result.detalles.peso_alertas_resueltas"></span>
                    </div>

                    <div>Ocupación de Corrales</div>
                    <div style="text-align:right">
                        <span class="result-badge badge-created" x-text="'+' + result.detalles.ocupacion_alertas_creadas"></span>
                        <span class="result-badge badge-resolved" x-text="'✓' + result.detalles.ocupacion_alertas_resueltas"></span>
                    </div>

                    <div>Estrés Térmico (Clima)</div>
                    <div style="text-align:right">
                        <span class="result-badge badge-created" x-text="'+' + result.detalles.clima_alertas_creadas"></span>
                        <span class="result-badge badge-resolved" x-text="'✓' + result.detalles.clima_alertas_resueltas"></span>
                    </div>
                </div>
            </div>

            <!-- Div de Error -->
            <div x-show="error" style="margin-top:20px;padding:12px;background:#fff1f0;border:1px solid #fecaca;border-radius:10px;color:#991b1b;font-size:13px" x-cloak>
                <div style="display:flex;align-items:center;gap:6px">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span x-text="error"></span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
