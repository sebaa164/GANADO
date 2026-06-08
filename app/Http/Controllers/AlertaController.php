<?php

namespace App\Http\Controllers;

use App\Models\Alerta;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    public function index(Request $request)
    {
        $severidad = $request->input('severidad');
        $estado    = $request->input('estado', 'pendiente'); // por defecto solo pendientes
        $tipo      = $request->input('tipo');

        $query = Alerta::with(['animal', 'corral'])
                    ->orderByRaw("CASE prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END")
                    ->latest('generada_en');

        if ($severidad) {
            $query->where('prioridad', $severidad);
        }

        if ($estado && $estado !== 'todas') {
            $query->where('estado', $estado);
        }

        if ($tipo) {
            $query->where('tipo_anomalia', 'like', '%'.$tipo.'%');
        }

        // Tipos únicos para el select de filtro
        $tiposDisponibles = Alerta::select('tipo_anomalia')
                                ->distinct()
                                ->orderBy('tipo_anomalia')
                                ->pluck('tipo_anomalia');

        $alertas = $query->paginate(20)->withQueryString();

        return view('alertas.index', compact('alertas', 'tiposDisponibles', 'severidad', 'estado', 'tipo'));
    }

    public function show(Alerta $alerta)
    {
        $alerta->load(['animal', 'corral', 'evento']);
        return view('alertas.show', compact('alerta'));
    }

    public function update(Request $request, Alerta $alerta)
    {
        $alerta->update([
            'estado'       => 'resuelta',
            'resuelta_por' => auth()->id(),
            'resuelta_en'  => now(),
        ]);
        return redirect()->route('alertas.index')->with('success', 'Alerta marcada como resuelta.');
    }

    // Stub para completar la interfaz del resource
    public function create() { abort(404); }
    public function store(Request $request) { abort(404); }
    public function edit(Alerta $alerta) { abort(404); }
    public function destroy(Alerta $alerta) { abort(404); }
}
