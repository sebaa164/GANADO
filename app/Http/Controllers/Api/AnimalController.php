<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Corral;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    public function index(Request $request)
    {
        $busqueda = $request->input('busqueda');
        $corralId = $request->input('corral');
        $raza     = $request->input('raza');
        $estado   = $request->input('estado', 'activos');

        $query = Animal::with('corral:id,descripcion');

        if ($estado === 'activos') {
            $query->where('activo', true);
        } elseif ($estado === 'inactivos') {
            $query->where('activo', false);
        }

        if ($busqueda) {
            $query->where(function ($q) use ($busqueda) {
                $q->where('codigo_caravana', 'ilike', '%'.$busqueda.'%')
                  ->orWhere('raza', 'ilike', '%'.$busqueda.'%');
            });
        }

        if ($corralId) {
            $query->where('corral_id', $corralId);
        }

        if ($raza) {
            $query->where('raza', $raza);
        }

        $animales = $query->orderBy('fecha_ingreso', 'desc')->paginate(20);

        $corralesDisponibles = Corral::where('activo', true)
                                ->orderBy('descripcion')
                                ->get(['id', 'descripcion']);

        $razasDisponibles = Animal::select('raza')
                                ->whereNotNull('raza')
                                ->distinct()
                                ->orderBy('raza')
                                ->pluck('raza');

        return response()->json([
            'animales'            => $animales->items(),
            'meta'                => [
                'currentPage' => $animales->currentPage(),
                'lastPage'    => $animales->lastPage(),
                'perPage'     => $animales->perPage(),
                'total'       => $animales->total(),
                'from'        => $animales->firstItem(),
                'to'          => $animales->lastItem(),
            ],
            'corralesDisponibles' => $corralesDisponibles,
            'razasDisponibles'    => $razasDisponibles,
        ]);
    }

    public function show(Animal $animal)
    {
        $animal->load(['corral:id,descripcion', 'pesajes', 'alertas', 'eventosComportamiento']);
        return response()->json($animal);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'corral_id'        => 'required|exists:corrales,id',
            'codigo_caravana'  => 'required|string|max:50|unique:animales,codigo_caravana',
            'raza'             => 'nullable|string|max:100',
            'sexo'             => 'required|in:macho,hembra',
            'fecha_nacimiento' => 'nullable|date',
            'fecha_ingreso'    => 'required|date',
            'peso_ingreso_kg'  => 'nullable|numeric|min:0',
        ]);

        $animal = Animal::create($validated + ['activo' => true]);

        return response()->json($animal, 201);
    }

    public function update(Request $request, Animal $animal)
    {
        $validated = $request->validate([
            'raza'             => 'nullable|string|max:100',
            'estado_sanitario' => 'nullable|string|max:100',
            'activo'           => 'boolean',
        ]);

        $animal->update($validated);

        return response()->json($animal);
    }

    public function destroy(Animal $animal)
    {
        $animal->update(['activo' => false]);
        return response()->json(['message' => 'Animal dado de baja.']);
    }
}
