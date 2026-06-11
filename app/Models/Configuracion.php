<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    use HasFactory;

    protected $table = 'configuracion';

    protected $fillable = [
        'clave',
        'valor',
        'grupo',
        'descripcion',
        'es_publica',
    ];

    /**
     * Obtiene el valor de una configuración por su clave.
     *
     * @param string $clave
     * @param mixed $default
     * @return mixed
     */
    public static function get(string $clave, $default = null)
    {
        $config = self::where('clave', $clave)->first();
        return $config ? $config->valor : $default;
    }

    /**
     * Establece o actualiza el valor de una configuración por su clave.
     *
     * @param string $clave
     * @param mixed $valor
     * @return \App\Models\Configuracion
     */
    public static function set(string $clave, $valor)
    {
        return self::updateOrCreate(
            ['clave' => $clave],
            ['valor' => (string) $valor]
        );
    }
}
