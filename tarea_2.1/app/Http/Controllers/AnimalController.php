<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    public function index(Request $request)
    {
        $busqueda = $request->input('busqueda');
        $corralId = $request->input('corral');
        $raza     = $request->input('raza');
        $estado   = $request->input('estado', 'activos'); // default: solo activos

        $query = Animal::with('corral');

        // Filtro de estado
        if ($estado === 'activos') {
            $query->where('activo', true);
        } elseif ($estado === 'inactivos') {
            $query->where('activo', false);
        }
        // 'todos' no aplica filtro

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

        $animales = $query->orderBy('fecha_ingreso', 'desc')->paginate(20)->withQueryString();

        // Datos para los selects de filtro
        $corralesDisponibles = \App\Models\Corral::where('activo', true)
                                ->orderBy('descripcion')
                                ->get(['id', 'descripcion']);

        $razasDisponibles = Animal::select('raza')
                                ->whereNotNull('raza')
                                ->distinct()
                                ->orderBy('raza')
                                ->pluck('raza');

        return view('animales.index', compact(
            'animales', 'corralesDisponibles', 'razasDisponibles',
            'busqueda', 'corralId', 'raza', 'estado'
        ));
    }

    public function show(Animal $animal)
    {
        $animal->load(['corral', 'pesajes', 'alertas', 'eventosComportamiento']);
        return view('animales.show', compact('animal'));
    }

    public function create()
    {
        $corrales = \App\Models\Corral::where('activo', true)
                                      ->orderBy('nombre')
                                      ->get();
        return view('animales.create', compact('corrales'));
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

        Animal::create($validated + ['activo' => true]);
        return redirect()->route('animales.index')->with('success', 'Animal registrado correctamente.');
    }

    public function edit(Animal $animal)
    {
        return view('animales.edit', compact('animal'));
    }

    public function update(Request $request, Animal $animal)
    {
        $validated = $request->validate([
            'raza'            => 'nullable|string|max:100',
            'estado_sanitario'=> 'nullable|string|max:100',
            'activo'          => 'boolean',
        ]);

        $animal->update($validated);
        return redirect()->route('animales.index')->with('success', 'Animal actualizado.');
    }

    public function destroy(Animal $animal)
    {
        $animal->update(['activo' => false]);
        return redirect()->route('animales.index')->with('success', 'Animal dado de baja.');
    }
}
