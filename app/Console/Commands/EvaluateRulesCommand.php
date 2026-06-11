<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RulesEngineService;

class EvaluateRulesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ganadovision:evaluate-rules';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalúa todas las reglas de negocio para generar y resolver alertas automáticas en el ganado';

    /**
     * Execute the console command.
     */
    public function handle(RulesEngineService $rulesService): int
    {
        $this->info('Iniciando evaluación del motor de reglas de GanadoVision...');

        $resumen = $rulesService->evaluateAll();

        $this->line('----------------------------------------------------');
        $this->info("Ocupación de corral -> Creadas: {$resumen['ocupacion_alertas_creadas']} | Resueltas: {$resumen['ocupacion_alertas_resueltas']}");
        $this->info("Peso mínimo         -> Creadas: {$resumen['peso_alertas_creadas']} | Resueltas: {$resumen['peso_alertas_resueltas']}");
        $this->info("Estrés térmico      -> Creadas: {$resumen['clima_alertas_creadas']} | Resueltas: {$resumen['clima_alertas_resueltas']}");
        $this->line('----------------------------------------------------');
        $this->info('Evaluación completada con éxito.');

        return Command::SUCCESS;
    }
}
