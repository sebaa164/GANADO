<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alerta extends Model
{
    use HasFactory;

    protected $table = 'alertas';

    protected $fillable = [
        'corral_id',
        'animal_id',
        'evento_id',
        'resuelta_por',
        'tipo_anomalia',
        'prioridad',
        'estado',
        'descripcion',
        'generada_en',
        'resuelta_en',
    ];

    protected $casts = [
        'generada_en' => 'datetime',
        'resuelta_en' => 'datetime',
    ];

    public function corral(): BelongsTo
    {
        return $this->belongsTo(Corral::class);
    }

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(EventoComportamiento::class, 'evento_id');
    }

    public function resueltaPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resuelta_por');
    }
}
