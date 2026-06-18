<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaintenanceRequest;
use App\Models\Maintenance;
use App\Models\MaintenanceDetail;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class MaintenanceController extends Controller
{
    public function index()
    {
        //$user = JWTAuth::parseToken()->authenticate();
        // Obtener datos adicionales del payload si es necesario
        $payload = JWTAuth::parseToken()->getPayload();
        $role = $payload->get('role');

        // Inicializar la consulta base
        $query = Maintenance::with(['maintenanceType:id,typ_main', 'responsible:id,dni_res,nam_res,las_res']);

        if ($role === "user") {
            $query->where('vis_main', 'V');
        }

        $maintenances = $query->get()->map(function ($maintenance) {
            return [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'responsable_data' => $maintenance->responsible,
                'type_data' => $maintenance->maintenanceType,
                'type' => $maintenance->maintenanceType->typ_main,
                'assets' => $maintenance->maintenanceDetails->map(function ($detail) {
                    return $detail->id_ass_bel;
                })
            ];
        });

        return response()->json([
            "results" => $maintenances
        ], 200);
    }

    public function filteringMaintenances(Request $request)
    {
        $maintenances = Maintenance::query();

        $payload = JWTAuth::parseToken()->getPayload();
        $role = $payload->get('role');
        if ($role === "user") {
            $maintenances->where('vis_main', 'V');
        }

        // Filtro por código de mantenimiento
        if ($request->has('cod_main') && count($request->input('cod_main')) > 0) {
            $maintenances->whereIn('cod_main', $request->input('cod_main'));
        }

        // Filtro por tipos de mantenimiento
        if ($request->has('types') && count($request->input('types')) > 0) {
            $maintenances->whereIn('id_typ_main', $request->input('types'));
        }

        // Filtro por responsables
        if ($request->has('responsibles') && count($request->input('responsibles')) > 0) {
            $maintenances->whereIn('dni_res_main', $request->input('responsibles'));
        }

        // Filtro por activos involucrados
        if ($request->has('assets') && count($request->input('assets')) > 0) {
            $maintenances->whereHas('maintenanceDetails.asset', function ($query) use ($request) {
                $query->whereIn('id', $request->input('assets'));
            });
        }
        // Cargar relaciones necesarias
        $maintenances = $maintenances->with([
            'maintenanceType:id,typ_main',
            'responsible:id,dni_res,nam_res,las_res,is_ext',
            'maintenanceDetails.asset',
            'maintenanceDetails.observations',
            'maintenanceDetails.replacedComponents',
            'maintenanceDetails.activities'
        ])->get();

        // Transformar los resultados para la respuesta
        $transformedMaintenances = $maintenances->map(function ($maintenance) {
            return [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'type' => $maintenance->maintenanceType->typ_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
            ];
        });

        // Retornar respuesta estructurada
        return response()->json([
            'results' => $transformedMaintenances
        ], 200);
    }

    public function maintenancesByTime(Request $request)
    {
        $maintenances = Maintenance::query();

        $payload = JWTAuth::parseToken()->getPayload();
        $role = $payload->get('role');
        if ($role === "user") {
            $maintenances->where('vis_main', 'V');
        }

        $creation_timestamp_exist = $request->has('created_at') && count($request->input('created_at')) > 0;
        $ended_timestamp_exist = $request->has('ended_at') && count($request->input('ended_at')) > 0;

        if ($creation_timestamp_exist && $ended_timestamp_exist) {
            $created_at = $request->input('created_at')[0];
            $ended_at = $request->input('ended_at')[0];

            if (strtotime($created_at) > strtotime($ended_at)) {
                return response()->json([
                    'error' => 'La fecha de creación no puede ser posterior a la fecha de finalización.'
                ], 400);
            }

            // Normaliza las fechas al inicio y fin del día
            $created_at_start = Carbon::parse($created_at)->startOfDay();
            $ended_at_end = Carbon::parse($ended_at)->endOfDay();

            // Aplica ambas condiciones combinadas
            $maintenances->where(function ($query) use ($created_at_start, $ended_at_end) {
                $query->whereBetween('created_at', [$created_at_start, $ended_at_end])
                    ->whereBetween('ended_at', [$created_at_start, $ended_at_end]);
            });
        } else {
            if ($creation_timestamp_exist) {
                $created_at = $request->input('created_at')[0];
                $created_at_start = Carbon::parse($created_at)->startOfDay();
                $created_at_end = Carbon::parse($created_at)->endOfDay();

                // Filtrar por día exacto
                $maintenances->whereBetween('created_at', [$created_at_start, $created_at_end]);
            }

            if ($ended_timestamp_exist) {
                $ended_at = $request->input('ended_at')[0];
                $ended_at_start = Carbon::parse($ended_at)->startOfDay();
                $ended_at_end = Carbon::parse($ended_at)->endOfDay();

                $maintenances->whereBetween('ended_at', [$ended_at_start, $ended_at_end]);
            }
        }

        // Cargar relaciones necesarias
        $maintenances = $maintenances->with([
            'maintenanceType:id,typ_main',
            'responsible:id,dni_res,nam_res,las_res,is_ext',
            'maintenanceDetails.asset',
            'maintenanceDetails.observations',
            'maintenanceDetails.replacedComponents',
            'maintenanceDetails.activities'
        ])->get();

        // Transformar los resultados para la respuesta
        $transformedMaintenances = $maintenances->map(function ($maintenance) {
            return [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'type' => $maintenance->maintenanceType->typ_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
            ];
        });

        return response()->json([
            'results' => $transformedMaintenances
        ], 200);
    }

    public function show($id)
    {
        $maintenance = Maintenance::with([
            'responsible',
            'maintenanceType',
            'maintenanceDetails.asset',
            'maintenanceDetails.observations',
            'maintenanceDetails.activities',
            'maintenanceDetails.replacedComponents.component',
        ])->find($id);

        if (!$maintenance) {
            return response()->json(["message" => "No existe el mantenimiento solicitado"], 404);
        }

        // Obtener datos del responsable
        $responsibleFullName = $maintenance->responsible
            ? $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res
            : "Responsable no definido";
        $isExtern = $maintenance->responsible->is_ext === "Y" ? "Externo" : "Interno";
        // Obtener datos del tipo de mantenimiento
        $maintenanceTypeName = $maintenance->maintenanceType->typ_main ?? "Tipo de mantenimiento no definido";

        // Transformar los detalles del mantenimiento
        $details = $maintenance->maintenanceDetails->map(function ($detail) {
            return [
                "id_det_main" => $detail->id,
                "asset" => [
                    "id" => $detail->asset->id,
                    "cod_ass" => $detail->asset->cod_ass,
                    "ser_num_ass" => $detail->asset->ser_num_ass,
                    "obs_add_ass" => $detail->asset->obs_add_ass,
                    "est_ass" => $detail->asset->est_ass,
                    "observations" => $detail->observations->map(function ($observation) {
                        return [
                            "id" => $observation->id,
                            "des_obs" => $observation->des_obs,
                        ];
                    }),
                    "replaced_components" => $detail->replacedComponents->map(function ($replacedComponent) {
                        return [
                            "id" => $replacedComponent->id,
                            "id_com_bel" => $replacedComponent->id_com_bel,
                            "des_rep_com" => $replacedComponent->des_rep_com,
                            "nam_com" => $replacedComponent->component->nam_com
                        ];
                    }),
                    "activities" => $detail->activities->map(function ($activity) {
                        return [
                            "id" => $activity->id,
                            "act_main" => $activity->act_main,
                        ];
                    }),
                ],
            ];
        });

        $response = [
            "id_main" => $maintenance->id,
            "cod_main" => $maintenance->cod_main,
            "id_typ_main" => $maintenance->id_typ_main,
            "typ_main_name" => $maintenanceTypeName,
            "dni_res_main" => $maintenance->dni_res_main,
            "responsible_name" => $responsibleFullName,
            "is_ext" => $isExtern,
            "vis_main" => $maintenance->vis_main,
            "ended_at" => $maintenance->ended_at,
            "created_at" => $maintenance->created_at,
            "details" => $details,
        ];

        return response()->json([
            "results" => $response,
        ], 200);
    }

    public function store(MaintenanceRequest $request)
    {
        try {
            $maintenance = Maintenance::create($request->validated());
            $maintenanceDetail = new MaintenanceDetail();
            $maintenanceDetail->id_main_bel = $maintenance->id;
            $maintenanceDetail->id_ass_bel = null;
            $maintenanceDetail->save();

            return response()->json([
                "results" => $maintenance,
                "detaiul" => $maintenanceDetail
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Ocurrió un error al guardar el mantenimiento",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function update(MaintenanceRequest $request, $id)
    {
        try {
            $maintenance = Maintenance::findOrFail($id);
            $validatedData = $request->validated();

            // $maintenance->update([
            //     "dni_res_main" => $validatedData['dni_res_main'],
            //     "cod_main" => $validatedData['cod_main'],
            //     "typ_main" => $validatedData['typ_main'],
            //     "created_at" => $validatedData['created_at'],
            //     "ended_at" => $validatedData['ended_at'],
            // ]);
            $maintenance->update($validatedData);

            return response()->json([
                "message" => "Mantenimiento actualizado"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "message" => "Mantenimiento no encontrado",
                // "error"=>;
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Ocurrió un error al actualizar el mantenimiento",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function hide($id)
    { // archivar 
        try {
            $maintenance = Maintenance::findOrFail($id);

            // Alterna el estado de vis_main
            $maintenance->vis_main = $maintenance->vis_main === "V" ? "H" : "V";
            $maintenance->save();

            $message = $maintenance->vis_main === "V"
                ? "Mantenimiento ahora está visible"
                : "Mantenimiento archivado";

            return response()->json([
                "message" => $message,
                "status" => $maintenance->vis_main,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "message" => "Mantenimiento no encontrado",
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Ocurrió un error al actualizar el mantenimiento",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function search(Request $request)
    {
        $request->validate([
            "term" => 'required|max:10',
        ]);

        $payload = JWTAuth::parseToken()->getPayload();
        $role = $payload->get('role');

        $query = Maintenance::with(['maintenanceType:id,typ_main', 'responsible:id,dni_res,nam_res,las_res']);

        if ($role === "user") {
            $query->where('vis_main', 'V');
        }

        $term = $request->input('term');

        $query->where('cod_main', 'LIKE', "%{$term}%");

        $maintenances = $query->get()->map(function ($maintenance) {
            return [
                'id' => $maintenance->id,
                'cod_main' => $maintenance->cod_main,
                'vis_main' => $maintenance->vis_main,
                'created_at' => $maintenance->created_at,
                'ended_at' => $maintenance->ended_at,
                'responsable' => $maintenance->responsible->nam_res . ' ' . $maintenance->responsible->las_res,
                'type' => $maintenance->maintenanceType->typ_main,
            ];
        });

        return response()->json([
            'results' => $maintenances,
        ], 200);
    }

    
}
