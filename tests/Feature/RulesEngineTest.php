<?php

namespace Tests\Feature;

use App\Models\Alerta;
use App\Models\Animal;
use App\Models\Corral;
use App\Models\DatoClimatico;
use App\Models\EventoComportamiento;
use App\Models\Pesaje;
use App\Models\Configuracion;
use Database\Seeders\ConfiguracionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RulesEngineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ConfiguracionSeeder::class);
    }

    /**
     * Helper para crear un corral válido.
     */
    private function crearCorral(string $nombre, string $codigo, int $capacidad = 10): Corral
    {
        return Corral::create([
            'nombre' => $nombre,
            'codigo' => $codigo,
            'capacidad_maxima' => $capacidad,
            'activo' => true,
        ]);
    }

    /**
     * Helper para crear un animal válido con fecha_ingreso.
     */
    private function crearAnimal(Corral $corral, string $caravana, string $raza = 'Hereford', string $sexo = 'macho'): Animal
    {
        return Animal::create([
            'corral_id' => $corral->id,
            'codigo_caravana' => $caravana,
            'raza' => $raza,
            'sexo' => $sexo,
            'fecha_ingreso' => now()->toDateString(),
            'activo' => true,
        ]);
    }

    /**
     * Test: Alertas de peso mínimo y auto-resolución al recuperar peso.
     */
    public function test_animal_weight_creates_and_resolves_alerts(): void
    {
        Configuracion::set('alerta_peso_minimo_kg', 200);

        $corral = $this->crearCorral('Corral Test Peso', 'CTP-1');
        $animal = $this->crearAnimal($corral, 'TESTPESO123');

        // Registrar un pesaje bajo el límite (190 kg)
        Pesaje::create([
            'animal_id' => $animal->id,
            'peso_kg' => 190.00,
            'pesado_en' => now(),
        ]);

        $this->assertDatabaseHas('alertas', [
            'animal_id' => $animal->id,
            'tipo_anomalia' => 'peso_bajo',
            'estado' => 'activa',
            'prioridad' => 'alta',
        ]);

        // Registrar un pesaje sobre el límite (210 kg)
        Pesaje::create([
            'animal_id' => $animal->id,
            'peso_kg' => 210.00,
            'pesado_en' => now(),
        ]);

        $this->assertDatabaseHas('alertas', [
            'animal_id' => $animal->id,
            'tipo_anomalia' => 'peso_bajo',
            'estado' => 'resuelta',
        ]);
    }

    /**
     * Test: Alertas de estrés térmico y auto-resolución.
     */
    public function test_climate_creates_and_resolves_alerts(): void
    {
        Configuracion::set('alerta_temperatura_max_c', 35);

        // IMPORTANTE: crear el corral ANTES de registrar datos climáticos,
        // porque el observer genera alertas para cada corral activo existente.
        $corral = $this->crearCorral('Corral Clima', 'CC-1', 5);

        // Registrar temperatura extrema (37°C)
        DatoClimatico::create([
            'temperatura_c' => 37.0,
            'humedad_pct' => 60.0,
            'viento_kmh' => 10.0,
            'precipitaciones_mm' => 0.0,
            'condicion' => 'Despejado',
            'fuente' => 'Estación local',
            'registrado_en' => now(),
        ]);

        $this->assertDatabaseHas('alertas', [
            'corral_id' => $corral->id,
            'tipo_anomalia' => 'estres_termico',
            'estado' => 'activa',
            'prioridad' => 'critica',
        ]);

        // Registrar temperatura normal (25°C)
        DatoClimatico::create([
            'temperatura_c' => 25.0,
            'humedad_pct' => 60.0,
            'viento_kmh' => 10.0,
            'precipitaciones_mm' => 0.0,
            'condicion' => 'Despejado',
            'fuente' => 'Estación local',
            'registrado_en' => now(),
        ]);

        $this->assertDatabaseHas('alertas', [
            'corral_id' => $corral->id,
            'tipo_anomalia' => 'estres_termico',
            'estado' => 'resuelta',
        ]);
    }

    /**
     * Test: Alertas de sobreocupación y auto-resolución al retirar un animal.
     */
    public function test_corral_occupancy_creates_and_resolves_alerts(): void
    {
        Configuracion::set('alerta_ocupacion_corral_pct', 50);

        $corral = $this->crearCorral('Corral Ocupacion', 'CO-1', 2);

        // 1 animal de 2 = 50% → alcanza el límite
        $animal = $this->crearAnimal($corral, 'COW1', 'Angus', 'hembra');

        $this->assertDatabaseHas('alertas', [
            'corral_id' => $corral->id,
            'tipo_anomalia' => 'sobreocupacion',
            'estado' => 'activa',
            'prioridad' => 'media',
        ]);

        // Desactivar el animal (simulando retiro del corral)
        $animal->update(['activo' => false]);

        $this->assertDatabaseHas('alertas', [
            'corral_id' => $corral->id,
            'tipo_anomalia' => 'sobreocupacion',
            'estado' => 'resuelta',
        ]);
    }

    /**
     * Test: Alertas por eventos de comportamiento de IA y auto-resolución.
     */
    public function test_behavioral_anomaly_creates_and_resolves_alerts(): void
    {
        $corral = $this->crearCorral('Corral Conducta', 'CCON-1');
        $animal = $this->crearAnimal($corral, 'BEH123');

        // Registrar un evento anómalo (Permanencia en suelo / postración)
        $eventoAnomalo = EventoComportamiento::create([
            'animal_id' => $animal->id,
            'corral_id' => $corral->id,
            'tipo_evento' => 'permanencia_suelo',
            'estado_inferido' => 'enfermo',
            'confianza_ia' => 0.9500,
            'detectado_en' => now(),
        ]);

        $this->assertDatabaseHas('alertas', [
            'animal_id' => $animal->id,
            'evento_id' => $eventoAnomalo->id,
            'tipo_anomalia' => 'postracion',
            'estado' => 'activa',
            'prioridad' => 'critica',
        ]);

        // Registrar un evento normal (comportamiento normal y sano)
        EventoComportamiento::create([
            'animal_id' => $animal->id,
            'corral_id' => $corral->id,
            'tipo_evento' => 'comportamiento_normal',
            'estado_inferido' => 'sano',
            'confianza_ia' => 0.9900,
            'detectado_en' => now(),
        ]);

        $this->assertDatabaseHas('alertas', [
            'animal_id' => $animal->id,
            'tipo_anomalia' => 'postracion',
            'estado' => 'resuelta',
        ]);
    }

    /**
     * Test: Comando Artisan ejecuta el motor correctamente.
     */
    public function test_artisan_command_runs_successfully(): void
    {
        $corral = $this->crearCorral('Corral Command', 'CCMD-1');
        $animal = $this->crearAnimal($corral, 'CMD123', 'Angus');

        // El observer de Pesaje habrá generado la alerta de peso_bajo al crear el pesaje.
        // Para el test del artisan command, primero creamos el pesaje SIN observer,
        // y luego dejamos que evaluateAll() del comando genere la alerta.
        Pesaje::withoutEvents(function () use ($animal) {
            Pesaje::create([
                'animal_id' => $animal->id,
                'peso_kg' => 150.00,
                'pesado_en' => now(),
            ]);
        });

        // Verificar que aún NO hay alertas (el observer fue omitido)
        $this->assertDatabaseMissing('alertas', [
            'animal_id' => $animal->id,
            'tipo_anomalia' => 'peso_bajo',
        ]);

        // Ejecutar el comando Artisan
        $this->artisan('ganadovision:evaluate-rules')
            ->expectsOutput('Iniciando evaluación del motor de reglas de GanadoVision...')
            ->expectsOutput('Evaluación completada con éxito.')
            ->assertExitCode(0);

        // Verificar que la alerta fue creada por el comando
        $this->assertDatabaseHas('alertas', [
            'animal_id' => $animal->id,
            'tipo_anomalia' => 'peso_bajo',
            'estado' => 'activa',
        ]);
    }
}
