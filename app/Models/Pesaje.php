<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pesaje extends Model
{
    use HasFactory;

    protected $fillable = [
        'animal_id',
        'registrado_por',
        'peso_kg',
        'tipo',
        'pesado_en',
        'observaciones',
    ];

    protected $casts = [
        'peso_kg'   => 'decimal:2',
        'pesado_en' => 'datetime',
    ];

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    public function registradoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registrado_por');
    }
}
