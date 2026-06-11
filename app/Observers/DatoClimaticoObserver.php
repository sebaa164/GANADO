<?php

namespace App\Observers;

use App\Models\DatoClimatico;
use App\Services\RulesEngineService;

class DatoClimaticoObserver
{
    /**
     * Handle the DatoClimatico "saved" event.
     */
    public function saved(DatoClimatico $clima): void
    {
        app(RulesEngineService::class)->evaluateClimate($clima);
    }
}
