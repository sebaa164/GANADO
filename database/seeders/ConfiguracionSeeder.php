<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seed de valores por defecto para la tabla de configuración.
 *
 * Usa insertOrIgnore para no sobreescribir valores ya personalizados
 * si el seeder se vuelve a ejecutar.
 */
class ConfiguracionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $defaults = [
            // --- General ---
            [
                'clave'       => 'nombre_establecimiento',
                'valor'       => 'GanadoVision',
                'grupo'       => 'general',
                'descripcion' => 'Nombre del establecimiento / feedlot',
                'es_publica'  => true,
            ],
            [
                'clave'       => 'zona_horaria',
                'valor'       => 'America/Argentina/Buenos_Aires',
                'grupo'       => 'general',
                'descripcion' => 'Zona horaria del sistema (PHP timezone)',
                'es_publica'  => false,
            ],
            [
                'clave'       => 'moneda',
                'valor'       => 'ARS',
                'grupo'       => 'general',
                'descripcion' => 'Moneda por defecto (código ISO 4217)',
                'es_publica'  => false,
            ],

            // --- Alertas ---
            [
                'clave'       => 'alerta_peso_minimo_kg',
                'valor'       => '180',
                'grupo'       => 'alertas',
                'descripcion' => 'Peso mínimo (kg) bajo el cual se genera una alerta automática',
                'es_publica'  => false,
            ],
            [
                'clave'       => 'alerta_temperatura_max_c',
                'valor'       => '38',
                'grupo'       => 'alertas',
                'descripcion' => 'Temperatura ambiente máxima (°C) para alerta',
                'es_publica'  => false,
            ],
            [
                'clave'       => 'alerta_ocupacion_corral_pct',
                'valor'       => '90',
                'grupo'       => 'alertas',
                'descripcion' => 'Porcentaje de ocupación de corral para generar alerta',
                'es_publica'  => false,
            ],

            // --- Notificaciones ---
            [
                'clave'       => 'notificaciones_email_activas',
                'valor'       => '0',
                'grupo'       => 'notificaciones',
                'descripcion' => 'Activar envío de emails para alertas críticas (1 = activo)',
                'es_publica'  => false,
            ],
            [
                'clave'       => 'notificaciones_email_destino',
                'valor'       => null,
                'grupo'       => 'notificaciones',
                'descripcion' => 'Email de destino para notificaciones de alertas críticas',
                'es_publica'  => false,
            ],

            // --- Integración Python / IA ---
            [
                'clave'       => 'ai_service_url',
                'valor'       => 'http://localhost:8002',
                'grupo'       => 'integracion',
                'descripcion' => 'URL base del microservicio de visión artificial (ai-service)',
                'es_publica'  => false,
            ],
            [
                'clave'       => 'backend_api_url',
                'valor'       => 'http://localhost:8001',
                'grupo'       => 'integracion',
                'descripcion' => 'URL base del backend FastAPI (api_gateway)',
                'es_publica'  => false,
            ],
        ];

        foreach ($defaults as $item) {
            DB::table('configuracion')->insertOrIgnore(
                array_merge($item, [
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ])
            );
        }
    }
}
