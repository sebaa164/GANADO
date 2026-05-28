<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Animal extends Model
{
    use HasFactory;

    protected $fillable = [
        'corral_id',
        'codigo_caravana',
        'raza',
        'sexo',
        'fecha_nacimiento',
        'fecha_ingreso',
        'fecha_egreso',
        'peso_ingreso_kg',
        'peso_egreso_kg',
        'estado_sanitario',
        'activo',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_ingreso'    => 'date',
        'fecha_egreso'     => 'date',
        'peso_ingreso_kg'  => 'decimal:2',
        'peso_egreso_kg'   => 'decimal:2',
        'activo'           => 'boolean',
    ];

    public function corral(): BelongsTo
    {
        return $this->belongsTo(Corral::class);
    }

    public function pesajes(): HasMany
    {
        return $this->hasMany(Pesaje::class);
    }

    public function eventosComportamiento(): HasMany
    {
        return $this->hasMany(EventoComportamiento::class);
    }

    public function alertas(): HasMany
    {
        return $this->hasMany(Alerta::class);
    }
}
