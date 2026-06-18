<?php

namespace App\Services;

use App\Models\Maintenance;

class MaintenanceResponseService
{

    public function loadRelations($maintenances)
    {
        // Usamos `with()` para cargar las relaciones en el Builder
        $maintenances->with([
            'maintenanceType:id,typ_main',
            'responsible:id,dni_res,nam_res,las_res,is_ext',
            'maintenanceDetails.asset.income',
            'maintenanceDetails.observations',
            'maintenanceDetails.activities',
            'maintenanceDetails.replacedComponents.component',
        ]);

        // Devuelve el mismo Builder con las relaciones cargadas
        return $maintenances;
    }

    public function transformMaintenances($maintenances)
    {
        return $maintenances->map(function ($maintenance) {
            $details = $maintenance->maintenanceDetails->map(function ($detail) {
                return [
                    "id_det_main" => $detail->id,
                    "asset" => [
                        "cod_ass" => $detail->asset->cod_ass,
                        "ser_num_ass" => $detail->asset->ser_num_ass,
                        "obs_add_ass" => $detail->asset->obs_add_ass,
                        "est_ass" => $detail->asset->est_ass,
                        "observations" => $detail->observations->map(function ($observation) {
                            return [
                                "des_obs" => $observation->des_obs,
                            ];
                        }),
                        "replaced_components" => $detail->replacedComponents->map(function ($replacedComponent) {
                            return [
                                "des_rep_com" => $replacedComponent->des_rep_com,
                                "nam_com" => $replacedComponent->component->nam_com
                            ];
                        }),
                        "activities" => $detail->activities->map(function ($activity) {
                            return [
                                "act_main" => $activity->act_main,
                            ];
                        }),
                    ],
                ];
            });

            return [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'type' => $maintenance->maintenanceType->typ_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
                'details' => $details,
            ];
        });
    }


    public function transformForSpecificAsset($maintenances, $assetId)
    {
        return $maintenances->map(function ($maintenance) use ($assetId) {
            $filteredDetails = $maintenance->maintenanceDetails->filter(function ($detail) use ($assetId) {
                return $detail->asset->id == $assetId;
            });

            return $filteredDetails->map(function ($detail) use ($maintenance) {
                return [
                    'id_maintenance' => $maintenance->id,
                    'cod_main' => $maintenance->cod_main,
                    'vis_main' => $maintenance->vis_main,
                    'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                    'type' => $maintenance->maintenanceType->typ_main,
                    'created_at' => $maintenance->created_at,
                    // 'created_at' => $maintenance->created_at->setTimezone('UTC'),
                    'ended_at' => $maintenance->ended_at,
                    'dni_res_main' => $maintenance->dni_res_main,
                    'asset' => [
                        'income' => $detail->asset->income->cod_inc,
                        'cod_ass' => $detail->asset->cod_ass,
                        'ser_num_ass' => $detail->asset->ser_num_ass,
                        'obs_add_ass' => $detail->asset->obs_add_ass,
                        'est_ass' => $detail->asset->est_ass,
                        'observations' => $detail->observations->map(function ($observation) {
                            return [
                                'des_obs' => $observation->des_obs,
                            ];
                        }),
                        'replaced_components' => $detail->replacedComponents->map(function ($replacedComponent) {
                            return [
                                'des_rep_com' => $replacedComponent->des_rep_com,
                                'nam_com' => $replacedComponent->component->nam_com,
                            ];
                        }),
                        'activities' => $detail->activities->map(function ($activity) {
                            return [
                                'act_main' => $activity->act_main,
                            ];
                        }),
                    ],
                ];
            });
        })->flatten(1); // Combina los detalles en un solo nivel de array
    }
}
