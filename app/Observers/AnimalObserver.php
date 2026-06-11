<?php

namespace App\Observers;

use App\Models\Animal;
use App\Models\Corral;
use App\Services\RulesEngineService;

class AnimalObserver
{
    /**
     * Handle the Animal "saved" event.
     */
    public function saved(Animal $animal): void
    {
        $rulesService = app(RulesEngineService::class);

        // Si cambió de corral, evaluar el corral de origen
        if ($animal->isDirty('corral_id')) {
            $oldCorralId = $animal->getOriginal('corral_id');
            if ($oldCorralId) {
                $oldCorral = Corral::find($oldCorralId);
                if ($oldCorral) {
                    $rulesService->evaluateCorralOccupancy($oldCorral);
                }
            }
        }

        // Evaluar el corral actual
        if ($animal->corral) {
            $rulesService->evaluateCorralOccupancy($animal->corral);
        }
    }

    /**
     * Handle the Animal "deleted" event.
     */
    public function deleted(Animal $animal): void
    {
        if ($animal->corral) {
            app(RulesEngineService::class)->evaluateCorralOccupancy($animal->corral);
        }
    }
}
