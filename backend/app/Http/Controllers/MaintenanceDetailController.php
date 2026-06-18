<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceDetailRequest;
use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\MaintenanceDetail;
use App\Models\Observation;
use App\Models\ReplacedComponent;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MaintenanceDetailController extends Controller
{
    public function index()
    {
        $maintenanceDetails = MaintenanceDetail::with([
            'maintenance',
            'asset',
            'observations',
            'activities',
            'replacedComponents',
        ])
            ->get();

        if (!$maintenanceDetails) {
            return response()->json(["message" => "No existe el mantenimiento solicitado"], 404);
        }

        return response()->json([
            "results" => $maintenanceDetails,
        ], 200);
    }

    public function show($id)
    {
        $maintenanceDetail = MaintenanceDetail::with([
            'maintenance.responsible',
            'maintenance.maintenanceType',
            'asset',
            'observations',
            'activities',
            'replacedComponents',
        ])->find($id);

        if (!$maintenanceDetail) {
            return response()->json(["message" => "No existe el mantenimiento solicitado"], 404);
        }

        $fullName = $maintenanceDetail->maintenance->responsible->nam_res . $maintenanceDetail->maintenance->responsible->las_res ?? "Responsable no definido";

        $isExtern = $maintenanceDetail->maintenance->responsible->is_ext === "Y" ? "Externo" : "Interno";
        // Transformar los datos
        $response = [
            // Información general del mantenimiento
            "id_main_bel" => $maintenanceDetail->id_main_bel,
            "id_det_main" => $maintenanceDetail->id,

            // Datos del mantenimiento principal
            "cod_main" => $maintenanceDetail->maintenance->cod_main,
            "id_typ_main" => $maintenanceDetail->maintenance->id_typ_main,
            "typ_main" => $maintenanceDetail->maintenance->maintenanceType->typ_main,
            "dni_res_main" => $maintenanceDetail->maintenance->dni_res_main . " - " . $fullName . " (" . $isExtern . ")",
            "vis_main" => $maintenanceDetail->maintenance->vis_main,
            "ended_at" => $maintenanceDetail->maintenance->ended_at,
            "created_at" => $maintenanceDetail->maintenance->created_at,

            // Información del activo
            "assets" => [
                [
                    "id" => $maintenanceDetail->asset->id,
                    "cod_ass" => $maintenanceDetail->asset->cod_ass,
                    "ser_num_ass" => $maintenanceDetail->asset->ser_num_ass,
                    "obs_add_ass" => $maintenanceDetail->asset->obs_add_ass,
                    "est_ass" => $maintenanceDetail->asset->est_ass,

                    // Observaciones, componentes reemplazados y actividades
                    "observations" => $maintenanceDetail->observations->map(function ($observation) {
                        return [
                            "id" => $observation->id,
                            "des_obs" => $observation->des_obs,
                        ];
                    }),
                    "replaced_components" => $maintenanceDetail->replacedComponents->map(function ($component) {
                        return [
                            "id" => $component->id,
                            "id_com_bel" => $component->id_com_bel,
                            "des_rep_com" => $component->des_rep_com,
                        ];
                    }),
                    "activities" => $maintenanceDetail->activities->map(function ($activity) {
                        return [
                            "id" => $activity->id,
                            "act_main" => $activity->act_main,
                        ];
                    }),
                ],
            ],
        ];

        return response()->json([
            "results" => $response,
        ], 200);
    }

    public function store(MaintenanceDetailRequest $request)
    {
        $validatedData = $request->validated();

        DB::beginTransaction();

        try {
            // Crear el mantenimiento principal
            $maintenance = Maintenance::create([
                'cod_main' => $validatedData['cod_main'],
                'id_typ_main' => $validatedData['id_typ_main'],
                'dni_res_main' => $validatedData['dni_res_main'],
                'vis_main' => $validatedData['vis_main'] ?? 'V',
                'ended_at' => $validatedData['ended_at'] ?? null,
                'created_at' => $validatedData['created_at'],
            ]);

            foreach ($validatedData['assets'] as $asset) {
                $maintenanceDetail = new MaintenanceDetail();
                $maintenanceDetail->id_main_bel = $maintenance->id;
                $maintenanceDetail->id_ass_bel = $asset['id'];
                $maintenanceDetail->save();

                if (!$maintenanceDetail->id) {
                    throw new Exception("Error al crear el detalle de mantenimiento para un asset.");
                }

                if (!empty($asset['observations'])) {
                    $observations = array_map(function ($observation) use ($maintenanceDetail) {
                        return [
                            'id_det_main_obs' => $maintenanceDetail->id,
                            'des_obs' => $observation['des_obs'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }, $asset['observations']);
                    Observation::insert($observations);
                }

                if (!empty($asset['replaced_components'])) {
                    $components = array_map(function ($component) use ($maintenanceDetail) {
                        return [
                            'id_det_main_bel' => $maintenanceDetail->id,
                            'id_com_bel' => $component['id_com_bel'],
                            'des_rep_com' => $component['des_rep_com'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }, $asset['replaced_components']);
                    ReplacedComponent::insert($components);
                }

                if (!empty($asset['activities'])) {
                    $activities = array_map(function ($activityId) use ($maintenanceDetail) {
                        return [
                            'id_main' => $maintenanceDetail->id,
                            'id_act' => $activityId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }, $asset['activities']);
                    DB::table('activity_maintenance_details')->insert($activities);
                }
            }

            DB::commit();
            $formattedData = [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
                'responsable_Data' => $maintenance->responsible,
                'type_data' => $maintenance->maintenanceType,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'type' => $maintenance->maintenanceType->typ_main,
            ];

            return response()->json([
                'message' => 'Mantenimiento creado exitosamente.',
                'results' => $formattedData,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el mantenimiento.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(MaintenanceDetailRequest $request, $id)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            // Cargar la relación 'responsible' con 'with'
            $maintenance = Maintenance::with('responsible', 'maintenanceType')->findOrFail($id);

            // Actualizar el mantenimiento
            $maintenance->update([
                'cod_main' => $validatedData['cod_main'],
                'id_typ_main' => $validatedData['id_typ_main'],
                'dni_res_main' => $validatedData['dni_res_main'],
                'vis_main' => $validatedData['vis_main'] ?? 'V',
                'ended_at' => $validatedData['ended_at'] ?? null,
                'created_at' => $validatedData['created_at'] ?? null,
            ]);

            // Borrar los detalles antiguos
            MaintenanceDetail::where('id_main_bel', $maintenance->id)->each(function ($maintenanceDetail) {
                $this->deleteOldRecords($maintenanceDetail->id);
                $maintenanceDetail->delete();
            });

            // Crear los nuevos detalles
            foreach ($validatedData['assets'] as $asset) {
                $maintenanceDetail = new MaintenanceDetail();
                $maintenanceDetail->id_main_bel = $maintenance->id;
                $maintenanceDetail->id_ass_bel = $asset['id'];
                $maintenanceDetail->save();

                if (!$maintenanceDetail->id) {
                    throw new Exception("Error al crear el detalle de mantenimiento para un activo.");
                }

                // Crear registros relacionados con el detalle
                $this->createNewRecords($maintenanceDetail->id, [$asset]);
            }

            DB::commit();

            // Sobrescribir 'responsible' con el nombre completo
            $formattedData = [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
                'responsable_data' => $maintenance->responsible,
                'type_data' => $maintenance->maintenanceType,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'type' => $maintenance->maintenanceType->typ_main,
            ];
            return response()->json([
                'message' => 'Mantenimiento actualizado exitosamente.',
                'results' => $formattedData,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar el mantenimiento.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    protected function deleteOldRecords($maintenanceDetailId)
    {
        Observation::where('id_det_main_obs', $maintenanceDetailId)->delete();
        ReplacedComponent::where('id_det_main_bel', $maintenanceDetailId)->delete();
        DB::table('activity_maintenance_details')
            ->where('id_main', $maintenanceDetailId)
            ->delete();
    }

    protected function createNewRecords($maintenanceDetailId, $assets)
    {
        foreach ($assets as $asset) {
            // Insertar nuevas observaciones
            if (!empty($asset['observations'])) {
                $observations = array_map(function ($observation) use ($maintenanceDetailId) {
                    return [
                        'id_det_main_obs' => $maintenanceDetailId,
                        'des_obs' => $observation['des_obs'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $asset['observations']);
                Observation::insert($observations);
            }

            // Insertar nuevos componentes reemplazados
            if (!empty($asset['replaced_components'])) {
                $components = array_map(function ($component) use ($maintenanceDetailId) {
                    return [
                        'id_det_main_bel' => $maintenanceDetailId,
                        'id_com_bel' => $component['id_com_bel'],
                        'des_rep_com' => $component['des_rep_com'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $asset['replaced_components']);
                ReplacedComponent::insert($components);
            }

            // Insertar nuevas actividades
            if (!empty($asset['activities'])) {
                $activities = array_map(function ($activityId) use ($maintenanceDetailId) {
                    return [
                        'id_main' => $maintenanceDetailId,
                        'id_act' => $activityId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $asset['activities']);
                DB::table('activity_maintenance_details')->insert($activities);
            }
        }
    }
}
