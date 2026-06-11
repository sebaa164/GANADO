<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('corral_id')->constrained('corrales')->cascadeOnDelete();
            $table->foreignId('animal_id')->nullable()->constrained('animales')->nullOnDelete();
            $table->foreignId('evento_id')->nullable()->constrained('eventos_comportamiento')->nullOnDelete();
            $table->foreignId('resuelta_por')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tipo_anomalia', 150);
            $table->enum('prioridad', ['baja', 'media', 'alta', 'critica'])->default('media');
            $table->enum('estado', ['activa', 'en_revision', 'resuelta', 'descartada'])->default('activa');
            $table->text('descripcion')->nullable();
            $table->timestamp('generada_en');
            $table->timestamp('resuelta_en')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertas');
    }
};
