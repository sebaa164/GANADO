<?php

namespace App\Providers;

use App\Models\Alerta;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Inyecta el conteo de alertas pendientes en el layout principal.
        // Disponible como $alertasBadge en layouts/app.blade.php en todas las vistas.
        View::composer('layouts.app', function ($view) {
            $count = Auth::check()
                ? Alerta::where('estado', 'pendiente')->count()
                : 0;

            $view->with('alertasBadge', $count);
        });
    }
}
