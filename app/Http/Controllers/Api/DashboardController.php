<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Alerta;
use App\Models\Corral;
use App\Models\DatoClimatico;
use App\Models\Pesaje;

class DashboardController extends Controller
{
    public function index()
    {
        $totalAnimales     = Animal::where('activo', true)->count();
        $alertasPendientes = Alerta::where('estado', 'pendiente')->count();

        $pesoPromedio = Pesaje::whereBetween('pesado_en', [now()->subDays(30), now()])
                            ->avg('peso_kg');
        $pesoPromedio = $pesoPromedio ? round((float)$pesoPromedio, 1) : null;

        $temperatura = DatoClimatico::latest('registrado_en')
                            ->value('temperatura_c');
        $temperatura = $temperatura ? round((float)$temperatura, 1) : null;

        $alertasRecientes = Alerta::where('estado', 'pendiente')
                                ->with(['animal:id,codigo_caravana', 'corral:id,descripcion'])
                                ->latest('generada_en')
                                ->take(5)
                                ->get();

        $ultimosAnimales = Animal::with('corral:id,descripcion')
                                ->where('activo', true)
                                ->latest('fecha_ingreso')
                                ->take(5)
                                ->get();

        $corrales = Corral::withCount(['animales' => fn($q) => $q->where('activo', true)])
                        ->where('activo', true)
                        ->orderBy('id')
                        ->get();

        return response()->json([
            'totalAnimales'     => $totalAnimales,
            'alertasPendientes' => $alertasPendientes,
            'pesoPromedio'      => $pesoPromedio,
            'temperatura'       => $temperatura,
            'alertasRecientes'  => $alertasRecientes,
            'ultimosAnimales'   => $ultimosAnimales,
            'corrales'          => $corrales,
        ]);
    }
}
