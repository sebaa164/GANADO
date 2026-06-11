<?php

namespace App\Observers;

use App\Models\Pesaje;
use App\Services\RulesEngineService;

class PesajeObserver
{
    /**
     * Handle the Pesaje "saved" event.
     */
    public function saved(Pesaje $pesaje): void
    {
        if ($pesaje->animal) {
            app(RulesEngineService::class)->evaluateWeight($pesaje->animal);
        }
    }
}
