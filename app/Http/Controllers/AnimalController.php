<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    public function index()
    {
        $animales = Animal::with('corral')->where('activo', true)->paginate(20);
        return view('animales.index', compact('animales'));
    }

    public function show(Animal $animal)
    {
        $animal->load(['corral', 'pesajes', 'alertas', 'eventosComportamiento']);
        return view('animales.show', compact('animal'));
    }

    public function create()
    {
        return view('animales.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'corral_id'        => 'required|exists:corrales,id',
            'codigo_caravana'  => 'required|string|max:50|unique:animals',
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
