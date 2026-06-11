<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\Alerta;
use App\Models\Corral;
use App\Models\DatoClimatico;
use App\Models\Pesaje;

class DashboardController extends Controller
{
    public function index()
    {
        // KPI cards
        $totalAnimales     = Animal::where('activo', true)->count();
        $alertasPendientes = Alerta::where('estado', 'pendiente')->count();

        $pesoPromedio = Pesaje::whereBetween('pesado_en', [now()->subDays(30), now()])
                            ->avg('peso_kg');
        $pesoPromedio = $pesoPromedio ? number_format($pesoPromedio, 1) : null;

        $temperatura = DatoClimatico::latest('registrado_en')
                            ->value('temperatura_c');
        $temperatura = $temperatura ? number_format($temperatura, 1) : null;

        // Alertas recientes (panel inferior)
        $alertasRecientes = Alerta::where('estado', 'pendiente')
                                ->with(['animal', 'corral'])
                                ->latest('generada_en')
                                ->take(5)
                                ->get();

        // Últimos 5 animales ingresados
        $ultimosAnimales = Animal::with('corral')
                                ->where('activo', true)
                                ->latest('fecha_ingreso')
                                ->take(5)
                                ->get();

        // Resumen de corrales activos con ocupación
        $corrales = Corral::withCount(['animales' => fn($q) => $q->where('activo', true)])
                        ->where('activo', true)
                        ->orderBy('id')
                        ->get();

        return view('dashboard.index', compact(
            'totalAnimales',
            'alertasPendientes',
            'alertasRecientes',
            'pesoPromedio',
            'temperatura',
            'ultimosAnimales',
            'corrales'
        ));
    }
}
