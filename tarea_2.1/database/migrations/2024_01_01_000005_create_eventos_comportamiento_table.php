<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eventos_comportamiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->nullable()->constrained('animales')->nullOnDelete();
            $table->foreignId('corral_id')->constrained('corrales')->cascadeOnDelete();
            $table->foreignId('camara_id')->nullable()->constrained('camaras')->nullOnDelete();
            // Tipo de comportamiento detectado por la IA
            $table->enum('tipo_evento', [
                'aislamiento',
                'inactividad_prolongada',
                'cambio_movilidad',
                'permanencia_suelo',
                'sin_acceso_comedero',
                'comportamiento_normal',
                'otro',
            ]);
            $table->enum('estado_inferido', ['sano', 'en_observacion', 'enfermo'])->default('sano');
            $table->decimal('confianza_ia', 5, 4)->nullable(); // 0.0000 a 1.0000
            $table->string('imagen_referencia', 500)->nullable(); // path o URL de la imagen
            $table->json('metadata_ia')->nullable(); // datos extra del modelo YOLO
            $table->timestamp('detectado_en');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos_comportamiento');
    }
};
