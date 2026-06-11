<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use App\Services\RulesEngineService;
use Illuminate\Http\Request;

class ConfiguracionController extends Controller
{
    /**
     * Muestra el panel de configuración con todos los parámetros de alertas.
     */
    public function index()
    {
        $configuraciones = Configuracion::all()->groupBy('grupo');
        return view('configuracion.index', compact('configuraciones'));
    }

    /**
     * Guarda los cambios en la configuración.
     */
    public function update(Request $request)
    {
        $request->validate([
            'alerta_peso_minimo_kg' => 'required|numeric|min:0',
            'alerta_temperatura_max_c' => 'required|numeric|-20|max:60',
            'alerta_ocupacion_corral_pct' => 'required|numeric|min:0|max:100',
            'nombre_establecimiento' => 'required|string|max:150',
            'notificaciones_email_activas' => 'nullable|in:0,1',
            'notificaciones_email_destino' => 'nullable|email|max:255',
        ], [
            'alerta_peso_minimo_kg.required' => 'El peso mínimo es obligatorio.',
            'alerta_peso_minimo_kg.numeric' => 'El peso mínimo debe ser un número.',
            'alerta_temperatura_max_c.required' => 'La temperatura máxima es obligatoria.',
            'alerta_ocupacion_corral_pct.required' => 'El porcentaje de ocupación es obligatorio.',
            'alerta_ocupacion_corral_pct.max' => 'El porcentaje de ocupación no puede superar el 100%.',
        ]);

        Configuracion::set('alerta_peso_minimo_kg', $request->input('alerta_peso_minimo_kg'));
        Configuracion::set('alerta_temperatura_max_c', $request->input('alerta_temperatura_max_c'));
        Configuracion::set('alerta_ocupacion_corral_pct', $request->input('alerta_ocupacion_corral_pct'));
        Configuracion::set('nombre_establecimiento', $request->input('nombre_establecimiento'));
        Configuracion::set('notificaciones_email_activas', $request->input('notificaciones_email_activas', '0'));
        Configuracion::set('notificaciones_email_destino', $request->input('notificaciones_email_destino'));

        // Disparar una evaluación global al cambiar configuraciones para actualizar alertas de inmediato
        app(RulesEngineService::class)->evaluateAll();

        return redirect()->route('configuracion')->with('success', 'Configuración actualizada y reglas re-evaluadas correctamente.');
    }

    /**
     * Ejecuta manualmente el motor de reglas de alertas.
     */
    public function runRules(RulesEngineService $rulesService, Request $request)
    {
        $resumen = $rulesService->evaluateAll();

        $creadas = $resumen['peso_alertas_creadas'] + $resumen['clima_alertas_creadas'] + $resumen['ocupacion_alertas_creadas'];
        $resueltas = $resumen['peso_alertas_resueltas'] + $resumen['clima_alertas_resueltas'] + $resumen['ocupacion_alertas_resueltas'];

        $mensaje = "Motor de reglas ejecutado exitosamente. Se crearon {$creadas} alertas y se resolvieron {$resueltas} alertas.";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $mensaje,
                'detalles' => $resumen
            ]);
        }

        return redirect()->route('configuracion')->with('success', $mensaje);
    }
}
