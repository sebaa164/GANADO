<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EventoComportamiento extends Model
{
    use HasFactory;

    protected $table = 'eventos_comportamiento';

    protected $fillable = [
        'animal_id',
        'corral_id',
        'camara_id',
        'tipo_evento',
        'estado_inferido',
        'confianza_ia',
        'imagen_referencia',
        'metadata_ia',
        'detectado_en',
    ];

    protected $casts = [
        'confianza_ia'  => 'decimal:4',
        'metadata_ia'   => 'array',
        'detectado_en'  => 'datetime',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    public function corral(): BelongsTo
    {
        return $this->belongsTo(Corral::class);
    }

    public function camara(): BelongsTo
    {
        return $this->belongsTo(Camara::class);
    }

    public function alerta(): HasOne
    {
        return $this->hasOne(Alerta::class, 'evento_id');
    }
}
