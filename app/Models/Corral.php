<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Corral extends Model
{
    use HasFactory;

    protected $table = 'corrales';

    protected $fillable = [
        'capacidad_maxima',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'capacidad_maxima' => 'integer',
    ];

    public function animales(): HasMany
    {
        return $this->hasMany(Animal::class);
    }

    public function camaras(): HasMany
    {
        return $this->hasMany(Camara::class);
    }

    public function alertas(): HasMany
    {
        return $this->hasMany(Alerta::class);
    }

    public function eventosComportamiento(): HasMany
    {
        return $this->hasMany(EventoComportamiento::class);
    }
}
