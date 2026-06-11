<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatoClimatico extends Model
{
    use HasFactory;

    protected $table = 'datos_climaticos';

    protected $fillable = [
        'temperatura_c',
        'humedad_pct',
        'viento_kmh',
        'precipitaciones_mm',
        'condicion',
        'fuente',
        'registrado_en',
    ];

    protected $casts = [
        'temperatura_c'      => 'decimal:2',
        'humedad_pct'        => 'decimal:2',
        'viento_kmh'         => 'decimal:2',
        'precipitaciones_mm' => 'decimal:2',
        'registrado_en'      => 'datetime',
    ];
}
