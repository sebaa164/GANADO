<?php

namespace App\Http\Controllers;

use App\Models\Alerta;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    public function index()
    {
        $alertas = Alerta::with(['animal', 'corral'])
                        ->orderByRaw("CASE prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END")
                        ->latest('generada_en')
                        ->paginate(20);
        return view('alertas.index', compact('alertas'));
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
