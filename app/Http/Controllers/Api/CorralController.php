<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Corral;
use Illuminate\Http\Request;

class CorralController extends Controller
{
    public function index()
    {
        $corrales = Corral::withCount([
                        'animales as animales_count'          => fn($q) => $q->where('activo', true),
                        'alertas as alertas_pendientes_count' => fn($q) => $q->where('estado', 'pendiente'),
                    ])
                    ->where('activo', true)
                    ->orderBy('descripcion')
                    ->get();

        return response()->json($corrales);
    }

    public function show(Corral $corral)
    {
        $corral->load(['animales', 'camaras', 'alertas']);
        return response()->json($corral);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:100',
            'codigo'           => 'required|string|max:20|unique:corrales',
            'capacidad_maxima' => 'required|integer|min:1',
            'descripcion'      => 'nullable|string',
        ]);

        $corral = Corral::create($validated + ['activo' => true]);

        return response()->json($corral, 201);
    }

    public function update(Request $request, Corral $corral)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:100',
            'capacidad_maxima' => 'required|integer|min:1',
            'descripcion'      => 'nullable|string',
            'activo'           => 'boolean',
        ]);

        $corral->update($validated);

        return response()->json($corral);
    }

    public function destroy(Corral $corral)
    {
        $corral->update(['activo' => false]);
        return response()->json(['message' => 'Corral desactivado.']);
    }
}
