<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('camaras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('corral_id')->constrained('corrales')->cascadeOnDelete();
            $table->string('nombre', 100);
            $table->string('codigo', 50)->unique();
            $table->string('ubicacion', 255)->nullable(); // ej: "comedero norte", "vista general"
            $table->string('stream_url', 500)->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('camaras');
    }
};
