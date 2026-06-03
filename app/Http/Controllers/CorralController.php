<?php

namespace App\Http\Controllers;

use App\Models\Corral;
use Illuminate\Http\Request;

class CorralController extends Controller
{
    public function index()
    {
        $corrales = Corral::withCount('animales')->where('activo', true)->get();
        return view('corrales.index', compact('corrales'));
    }

    public function show(Corral $corral)
    {
        $corral->load(['animales', 'camaras', 'alertas']);
        return view('corrales.show', compact('corral'));
    }

    public function create()
    {
        return view('corrales.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:100',
            'codigo'           => 'required|string|max:20|unique:corrales',
            'capacidad_maxima' => 'required|integer|min:1',
            'descripcion'      => 'nullable|string',
        ]);

        Corral::create($validated + ['activo' => true]);
        return redirect()->route('corrales.index')->with('success', 'Corral creado correctamente.');
    }

    public function edit(Corral $corral)
    {
        return view('corrales.edit', compact('corral'));
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
        return redirect()->route('corrales.index')->with('success', 'Corral actualizado.');
    }

    public function destroy(Corral $corral)
    {
        $corral->update(['activo' => false]);
        return redirect()->route('corrales.index')->with('success', 'Corral desactivado.');
    }
}
