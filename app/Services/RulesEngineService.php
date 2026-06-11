<?php

namespace App\Services;

use App\Models\Alerta;
use App\Models\Animal;
use App\Models\Corral;
use App\Models\DatoClimatico;
use App\Models\EventoComportamiento;
use App\Models\Configuracion;
use Illuminate\Support\Facades\Log;

class RulesEngineService
{
    /**
     * Evalúa todas las reglas del sistema de forma global.
     *
     * @return array Resumen de alertas creadas y resueltas.
     */
    public function evaluateAll(): array
    {
        $resumen = [
            'peso_alertas_creadas' => 0,
            'peso_alertas_resueltas' => 0,
            'clima_alertas_creadas' => 0,
            'clima_alertas_resueltas' => 0,
            'ocupacion_alertas_creadas' => 0,
            'ocupacion_alertas_resueltas' => 0,
        ];

        // 1. Evaluar Ocupación de Corrales
        $corrales = Corral::where('activo', true)->get();
        foreach ($corrales as $corral) {
            $resultado = $this->evaluateCorralOccupancy($corral);
            if ($resultado === 'creada') {
                $resumen['ocupacion_alertas_creadas']++;
            } elseif ($resultado === 'resuelta') {
                $resumen['ocupacion_alertas_resueltas']++;
            }
        }

        // 2. Evaluar Peso Mínimo de Animales
        $animales = Animal::where('activo', true)->get();
        foreach ($animales as $animal) {
            $resultado = $this->evaluateWeight($animal);
            if ($resultado === 'creada') {
                $resumen['peso_alertas_creadas']++;
            } elseif ($resultado === 'resuelta') {
                $resumen['peso_alertas_resueltas']++;
            }
        }

        // 3. Evaluar Clima
        $ultimoClima = DatoClimatico::latest('registrado_en')->first();
        if ($ultimoClima) {
            $resultado = $this->evaluateClimate($ultimoClima);
            $resumen['clima_alertas_creadas'] += $resultado['creadas'];
            $resumen['clima_alertas_resueltas'] += $resultado['resueltas'];
        }

        return $resumen;
    }

    /**
     * Evalúa el peso de un animal contra el límite configurado.
     *
     * @param Animal $animal
     * @return string|null 'creada', 'resuelta' o null.
     */
    public function evaluateWeight(Animal $animal): ?string
    {
        if (!$animal->activo) {
            return null;
        }

        $minimo = (float) Configuracion::get('alerta_peso_minimo_kg', 180);
        $ultimoPesaje = $animal->pesajes()->latest('pesado_en')->first();

        if (!$ultimoPesaje) {
            return null;
        }

        $peso = (float) $ultimoPesaje->peso_kg;

        if ($peso < $minimo) {
            // Verificar si ya existe una alerta activa de peso_bajo para este animal
            $alertaActiva = Alerta::where('animal_id', $animal->id)
                ->where('tipo_anomalia', 'peso_bajo')
                ->whereIn('estado', ['activa', 'en_revision'])
                ->exists();

            if (!$alertaActiva) {
                Alerta::create([
                    'corral_id' => $animal->corral_id,
                    'animal_id' => $animal->id,
                    'tipo_anomalia' => 'peso_bajo',
                    'prioridad' => 'alta',
                    'estado' => 'activa',
                    'descripcion' => "El animal caravana #{$animal->codigo_caravana} registra un peso de {$peso} kg, menor al mínimo establecido de {$minimo} kg.",
                    'generada_en' => now(),
                ]);
                return 'creada';
            }
        } else {
            // Si el peso es normal, auto-resolver alertas activas de peso_bajo
            $alertasAResolver = Alerta::where('animal_id', $animal->id)
                ->where('tipo_anomalia', 'peso_bajo')
                ->whereIn('estado', ['activa', 'en_revision'])
                ->get();

            if ($alertasAResolver->isNotEmpty()) {
                foreach ($alertasAResolver as $alerta) {
                    $alerta->update([
                        'estado' => 'resuelta',
                        'resuelta_en' => now(),
                        'descripcion' => $alerta->descripcion . " [Auto-resuelta: el peso actual de {$peso} kg superó el mínimo de {$minimo} kg]."
                    ]);
                }
                return 'resuelta';
            }
        }

        return null;
    }

    /**
     * Evalúa el clima contra la temperatura máxima configurada.
     *
     * @param DatoClimatico $clima
     * @return array Cantidad de alertas creadas y resueltas.
     */
    public function evaluateClimate(DatoClimatico $clima): array
    {
        $maxTemp = (float) Configuracion::get('alerta_temperatura_max_c', 38);
        $temp = (float) $clima->temperatura_c;

        $creadas = 0;
        $resueltas = 0;

        if ($temp > $maxTemp) {
            // Generar alerta de estrés térmico para todos los corrales activos
            $corrales = Corral::where('activo', true)->get();
            foreach ($corrales as $corral) {
                $alertaActiva = Alerta::where('corral_id', $corral->id)
                    ->where('tipo_anomalia', 'estres_termico')
                    ->whereIn('estado', ['activa', 'en_revision'])
                    ->exists();

                if (!$alertaActiva) {
                    Alerta::create([
                        'corral_id' => $corral->id,
                        'tipo_anomalia' => 'estres_termico',
                        'prioridad' => 'critica',
                        'estado' => 'activa',
                        'descripcion' => "Temperatura ambiente extrema detectada: {$temp}°C (Límite máximo: {$maxTemp}°C). Riesgo de estrés térmico en corral {$corral->nombre}.",
                        'generada_en' => now(),
                    ]);
                    $creadas++;
                }
            }
        } else {
            // Auto-resolver todas las alertas de estrés térmico activas
            $alertasAResolver = Alerta::where('tipo_anomalia', 'estres_termico')
                ->whereIn('estado', ['activa', 'en_revision'])
                ->get();

            if ($alertasAResolver->isNotEmpty()) {
                foreach ($alertasAResolver as $alerta) {
                    $alerta->update([
                        'estado' => 'resuelta',
                        'resuelta_en' => now(),
                        'descripcion' => $alerta->descripcion . " [Auto-resuelta: la temperatura descendió a {$temp}°C]."
                    ]);
                    $resueltas++;
                }
            }
        }

        return compact('creadas', 'resueltas');
    }

    /**
     * Evalúa el porcentaje de ocupación de un corral contra el límite configurado.
     *
     * @param Corral $corral
     * @return string|null 'creada', 'resuelta' o null.
     */
    public function evaluateCorralOccupancy(Corral $corral): ?string
    {
        if (!$corral->activo || $corral->capacidad_maxima <= 0) {
            return null;
        }

        $threshold = (float) Configuracion::get('alerta_ocupacion_corral_pct', 90);
        $cantidadActivos = $corral->animales()->where('activo', true)->count();
        $ocupacion = ($cantidadActivos / $corral->capacidad_maxima) * 100;

        if ($ocupacion >= $threshold) {
            $alertaActiva = Alerta::where('corral_id', $corral->id)
                ->whereNull('animal_id') // Alertas de corral no tienen animal asociado
                ->where('tipo_anomalia', 'sobreocupacion')
                ->whereIn('estado', ['activa', 'en_revision'])
                ->exists();

            if (!$alertaActiva) {
                Alerta::create([
                    'corral_id' => $corral->id,
                    'tipo_anomalia' => 'sobreocupacion',
                    'prioridad' => 'media',
                    'estado' => 'activa',
                    'descripcion' => "El corral {$corral->nombre} supera el límite de ocupación. Ocupación actual: " . round($ocupacion, 1) . "% ({$cantidadActivos} de {$corral->capacidad_maxima} animales, límite: {$threshold}%).",
                    'generada_en' => now(),
                ]);
                return 'creada';
            }
        } else {
            // Auto-resolver si la ocupación descendió
            $alertasAResolver = Alerta::where('corral_id', $corral->id)
                ->whereNull('animal_id')
                ->where('tipo_anomalia', 'sobreocupacion')
                ->whereIn('estado', ['activa', 'en_revision'])
                ->get();

            if ($alertasAResolver->isNotEmpty()) {
                foreach ($alertasAResolver as $alerta) {
                    $alerta->update([
                        'estado' => 'resuelta',
                        'resuelta_en' => now(),
                        'descripcion' => $alerta->descripcion . " [Auto-resuelta: ocupación actual descendió a " . round($ocupacion, 1) . "%]."
                    ]);
                }
                return 'resuelta';
            }
        }

        return null;
    }

    /**
     * Evalúa un evento de comportamiento detectado por visión artificial.
     *
     * @param EventoComportamiento $evento
     * @return string|null 'creada', 'resuelta' o null.
     */
    public function evaluateBehavior(EventoComportamiento $evento): ?string
    {
        $tipo = $evento->tipo_evento;
        $estadoInferido = $evento->estado_inferido;
        $confianza = $evento->confianza_ia;
        $animalId = $evento->animal_id;

        if (!$animalId) {
            return null;
        }

        // Si el evento es normal y el animal está sano, auto-resolvemos alertas conductuales activas
        if ($tipo === 'comportamiento_normal' && $estadoInferido === 'sano') {
            $tiposComportamiento = [
                'aislamiento_animal',
                'inactividad_prolongada',
                'problema_movilidad',
                'postracion',
                'bloqueo_alimentacion',
                'anomalia_comportamiento'
            ];

            $alertasAResolver = Alerta::where('animal_id', $animalId)
                ->whereIn('tipo_anomalia', $tiposComportamiento)
                ->whereIn('estado', ['activa', 'en_revision'])
                ->get();

            if ($alertasAResolver->isNotEmpty()) {
                foreach ($alertasAResolver as $alerta) {
                    $alerta->update([
                        'estado' => 'resuelta',
                        'resuelta_en' => now(),
                        'descripcion' => $alerta->descripcion . " [Auto-resuelta: se detectó comportamiento normal sano]."
                    ]);
                }
                return 'resuelta';
            }
            return null;
        }

        // Si no es comportamiento normal y el estado indica observación o enfermo, evaluar si requiere alerta
        if ($tipo !== 'comportamiento_normal' && in_array($estadoInferido, ['en_observacion', 'enfermo'])) {
            // Mapear tipo_evento de IA a tipo_anomalia del sistema
            $map = [
                'aislamiento' => ['tipo' => 'aislamiento_animal', 'prioridad' => 'media'],
                'inactividad_prolongada' => ['tipo' => 'inactividad_prolongada', 'prioridad' => 'alta'],
                'cambio_movilidad' => ['tipo' => 'problema_movilidad', 'prioridad' => 'media'],
                'permanencia_suelo' => ['tipo' => 'postracion', 'prioridad' => 'critica'],
                'sin_acceso_comedero' => ['tipo' => 'bloqueo_alimentacion', 'prioridad' => 'media'],
            ];

            $mapping = $map[$tipo] ?? ['tipo' => 'anomalia_comportamiento', 'prioridad' => 'media'];
            $tipoAnomalia = $mapping['tipo'];
            $prioridad = $mapping['prioridad'];

            // Evitar duplicar alertas del mismo tipo que ya estén activas para este animal
            $alertaActiva = Alerta::where('animal_id', $animalId)
                ->where('tipo_anomalia', $tipoAnomalia)
                ->whereIn('estado', ['activa', 'en_revision'])
                ->exists();

            if (!$alertaActiva) {
                Alerta::create([
                    'corral_id' => $evento->corral_id,
                    'animal_id' => $animalId,
                    'evento_id' => $evento->id,
                    'tipo_anomalia' => $tipoAnomalia,
                    'prioridad' => $prioridad,
                    'estado' => 'activa',
                    'descripcion' => "Comportamiento anómalo detectado por visión artificial: '{$tipo}'. Estado inferido: '{$estadoInferido}' con confianza del " . round($confianza * 100, 1) . "%.",
                    'generada_en' => now(),
                ]);
                return 'creada';
            }
        }

        return null;
    }
}
