<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    public function index(Request $request)
    {
        $severidad = $request->input('severidad');
        $estado    = $request->input('estado', 'pendiente');
        $tipo      = $request->input('tipo');

        $query = Alerta::with(['animal:id,codigo_caravana', 'corral:id,descripcion'])
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

        $tiposDisponibles = Alerta::select('tipo_anomalia')
                                ->distinct()
                                ->orderBy('tipo_anomalia')
                                ->pluck('tipo_anomalia');

        $alertas = $query->paginate(20);

        return response()->json([
            'alertas'          => $alertas->items(),
            'meta'             => [
                'currentPage' => $alertas->currentPage(),
                'lastPage'    => $alertas->lastPage(),
                'perPage'     => $alertas->perPage(),
                'total'       => $alertas->total(),
                'from'        => $alertas->firstItem(),
                'to'          => $alertas->lastItem(),
            ],
            'tiposDisponibles' => $tiposDisponibles,
        ]);
    }

    public function show(Alerta $alerta)
    {
        $alerta->load(['animal', 'corral', 'evento']);
        return response()->json($alerta);
    }

    public function resolve(Alerta $alerta)
    {
        $alerta->update([
            'estado'       => 'resuelta',
            'resuelta_por' => auth()->id(),
            'resuelta_en'  => now(),
        ]);

        return response()->json($alerta);
    }
}
