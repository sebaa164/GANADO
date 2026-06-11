<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Services\RulesEngineService;
use Illuminate\Http\Request;

class ConfiguracionController extends Controller
{
    public function index()
    {
        $configuraciones = Configuracion::all()->groupBy('grupo');
        return response()->json($configuraciones);
    }

    public function update(Request $request)
    {
        $request->validate([
            'alerta_peso_minimo_kg'       => 'required|numeric|min:0',
            'alerta_temperatura_max_c'    => 'required|numeric|-20|max:60',
            'alerta_ocupacion_corral_pct' => 'required|numeric|min:0|max:100',
            'nombre_establecimiento'      => 'required|string|max:150',
            'notificaciones_email_activas' => 'nullable|in:0,1',
            'notificaciones_email_destino' => 'nullable|email|max:255',
        ]);

        Configuracion::set('alerta_peso_minimo_kg', $request->input('alerta_peso_minimo_kg'));
        Configuracion::set('alerta_temperatura_max_c', $request->input('alerta_temperatura_max_c'));
        Configuracion::set('alerta_ocupacion_corral_pct', $request->input('alerta_ocupacion_corral_pct'));
        Configuracion::set('nombre_establecimiento', $request->input('nombre_establecimiento'));
        Configuracion::set('notificaciones_email_activas', $request->input('notificaciones_email_activas', '0'));
        Configuracion::set('notificaciones_email_destino', $request->input('notificaciones_email_destino'));

        app(RulesEngineService::class)->evaluateAll();

        return response()->json(['message' => 'Configuración actualizada y reglas re-evaluadas correctamente.']);
    }

    public function runRules(RulesEngineService $rulesService)
    {
        $resumen = $rulesService->evaluateAll();

        $creadas   = $resumen['peso_alertas_creadas'] + $resumen['clima_alertas_creadas'] + $resumen['ocupacion_alertas_creadas'];
        $resueltas = $resumen['peso_alertas_resueltas'] + $resumen['clima_alertas_resueltas'] + $resumen['ocupacion_alertas_resueltas'];

        return response()->json([
            'success'  => true,
            'message'  => "Motor de reglas ejecutado. Se crearon {$creadas} alertas y se resolvieron {$resueltas}.",
            'detalles' => $resumen,
        ]);
    }
}
