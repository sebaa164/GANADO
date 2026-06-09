<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Camara extends Model
{
    use HasFactory;

    protected $table = 'camaras';

    protected $fillable = [
        'corral_id',
        'nombre',
        'codigo',
        'ubicacion',
        'stream_url',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function corral(): BelongsTo
    {
        return $this->belongsTo(Corral::class);
    }

    public function eventosComportamiento(): HasMany
    {
        return $this->hasMany(EventoComportamiento::class);
    }
}
