<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('datos_climaticos', function (Blueprint $table) {
            $table->id();
            $table->decimal('temperatura_c', 5, 2)->nullable();
            $table->decimal('humedad_pct', 5, 2)->nullable();
            $table->decimal('viento_kmh', 6, 2)->nullable();
            $table->decimal('precipitaciones_mm', 6, 2)->nullable();
            $table->string('condicion', 100)->nullable(); // ej: "despejado", "lluvioso"
            $table->string('fuente', 100)->nullable(); // ej: "openweathermap"
            $table->timestamp('registrado_en');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('datos_climaticos');
    }
};
