<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabla de configuración del sistema.
 *
 * Almacena pares clave/valor para parámetros globales de GanadoVision.
 * Cada clave es única. El campo "grupo" permite agrupar parámetros
 * en secciones (general, alertas, notificaciones, etc.).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracion', function (Blueprint $table) {
            $table->id();
            $table->string('clave', 100)->unique();
            $table->text('valor')->nullable();
            $table->string('grupo', 50)->default('general');
            $table->string('descripcion', 255)->nullable();
            $table->boolean('es_publica')->default(false); // si puede verse sin auth
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracion');
    }
};
