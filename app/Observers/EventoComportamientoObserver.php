<?php

namespace App\Observers;

use App\Models\EventoComportamiento;
use App\Services\RulesEngineService;

class EventoComportamientoObserver
{
    /**
     * Handle the EventoComportamiento "created" event.
     */
    public function created(EventoComportamiento $evento): void
    {
        app(RulesEngineService::class)->evaluateBehavior($evento);
    }
}
