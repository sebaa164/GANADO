<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('animales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('corral_id')->constrained('corrales')->restrictOnDelete();
            $table->string('codigo_caravana', 100)->unique()->nullable(); // identificación física
            $table->string('raza', 100)->nullable();
            $table->enum('sexo', ['macho', 'hembra'])->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->date('fecha_ingreso');
            $table->date('fecha_egreso')->nullable();
            $table->decimal('peso_ingreso_kg', 8, 2)->nullable();
            $table->decimal('peso_egreso_kg', 8, 2)->nullable();
            // Estado sanitario actual
            $table->enum('estado_sanitario', ['sano', 'en_observacion', 'enfermo'])->default('sano');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('animales');
    }
};
