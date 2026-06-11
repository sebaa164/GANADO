<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\CorralController;
use App\Http\Controllers\Api\AlertaController;
use App\Http\Controllers\Api\ConfiguracionController;

/*
|--------------------------------------------------------------------------
| API Routes — GanadoVision
|--------------------------------------------------------------------------
*/

// Auth pública
Route::post('/auth/login', [AuthController::class, 'login']);

// Auth protegida
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user',    [AuthController::class, 'user']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/animales',       [AnimalController::class, 'index']);
    Route::get('/animales/{animal}', [AnimalController::class, 'show']);
    Route::post('/animales',       [AnimalController::class, 'store']);
    Route::put('/animales/{animal}',  [AnimalController::class, 'update']);
    Route::delete('/animales/{animal}', [AnimalController::class, 'destroy']);

    Route::get('/corrales',         [CorralController::class, 'index']);
    Route::get('/corrales/{corral}',  [CorralController::class, 'show']);
    Route::post('/corrales',         [CorralController::class, 'store']);
    Route::put('/corrales/{corral}',  [CorralController::class, 'update']);
    Route::delete('/corrales/{corral}', [CorralController::class, 'destroy']);

    Route::get('/alertas',          [AlertaController::class, 'index']);
    Route::get('/alertas/{alerta}',   [AlertaController::class, 'show']);
    Route::put('/alertas/{alerta}/resolver', [AlertaController::class, 'resolve']);

    Route::get('/configuracion',                  [ConfiguracionController::class, 'index']);
    Route::put('/configuracion',                    [ConfiguracionController::class, 'update']);
    Route::post('/configuracion/ejecutar-reglas',   [ConfiguracionController::class, 'runRules']);
});
