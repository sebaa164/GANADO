<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Rutas Web — GanadoVision
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => redirect()->route('dashboard'));

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Animales
    Route::resource('animales', \App\Http\Controllers\AnimalController::class);

    // Alertas
    Route::resource('alertas', \App\Http\Controllers\AlertaController::class);

    // Corrales
    Route::resource('corrales', \App\Http\Controllers\CorralController::class);

    // Configuración
    Route::get('/configuracion', [\App\Http\Controllers\ConfiguracionController::class, 'index'])->name('configuracion');
    Route::post('/configuracion', [\App\Http\Controllers\ConfiguracionController::class, 'update'])->name('configuracion.update');
    Route::post('/configuracion/ejecutar-reglas', [\App\Http\Controllers\ConfiguracionController::class, 'runRules'])->name('configuracion.run-rules');

});

// Auth routes (login/logout — scaffold básico)
Route::get('/login',  fn() => view('auth.login'))->name('login');
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');
