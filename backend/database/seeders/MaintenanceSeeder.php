<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use App\Models\MaintenanceDetail;
use App\Models\Observation;
use App\Models\ReplacedComponent;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MaintenanceSeeder extends Seeder
{
    public function run()
    {
        DB::transaction(function () {


            $maintenances = [



                [

                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-001',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2019-02-02'),
                    'ended_at' => Carbon::parse('2019-02-02'),
                    'details' => [
                        [
                            'id_ass_bel' => 1,
                            'observations' => [
                                ['des_obs' => 'Revisión general del switch.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 15, 'des_rep_com' => 'La placa base presenta fallas de alimentación.'],
                            ],
                            'activities' => [1],
                        ],
                    ],
                ],
                [

                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-002',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2020-06-15'),
                    'ended_at' => Carbon::parse('2020-06-20'),
                    'details' => [
                        [
                            'id_ass_bel' => 1,
                            'observations' => [
                                ['des_obs' => 'Revisión general del switch.'],
                            ],

                            'activities' => [1],
                        ],
                    ],
                ],
                [

                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-003',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2021-06-15'),
                    'ended_at' => Carbon::parse('2021-06-20'),
                    'details' => [
                        [
                            'id_ass_bel' => 1,
                            'observations' => [
                                ['des_obs' => 'Revisión general del switch.'],
                            ],

                            'activities' => [1],
                        ],
                    ],
                ],




                [






                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-004',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2020-06-15'),
                    'ended_at' => Carbon::parse('2020-06-20'),
                    'details' => [
                        [
                            'id_ass_bel' => 2,
                            'observations' => [
                                ['des_obs' => 'Revisión general del switch.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 15, 'des_rep_com' => 'La placa base presenta fallas de alimentación.'],
                            ],
                            'activities' => [1],
                        ],
                    ],
                ],
                [
                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-005',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2021-05-10'),
                    'ended_at' => Carbon::parse('2021-05-15'),
                    'details' => [
                        [
                            'id_ass_bel' => 2,
                            'observations' => [
                                ['des_obs' => 'Actualización del firmware del switch.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 14, 'des_rep_com' => 'El chip de conmutación no cumple con los estándares actuales.'],
                            ],
                            'activities' => [1],
                        ],
                    ],
                ],

                [
                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-007',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2022-07-10'),
                    'ended_at' => Carbon::parse('2022-07-15'),
                    'details' => [
                        [
                            'id_ass_bel' => 4,
                            'observations' => [
                                ['des_obs' => 'Ajustes en configuración VLAN.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 14, 'des_rep_com' => 'Chip de conmutación actualizado.'],
                            ],
                            'activities' => [1],
                        ],
                    ],
                ],
                [
                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-008',
                    'id_typ_main' => 4,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2023-05-20'),
                    'ended_at' => Carbon::parse('2023-05-25'),
                    'details' => [
                        [
                            'id_ass_bel' => 2,
                            'observations' => [
                                ['des_obs' => 'Revisión de la conectividad por fallos intermitentes.'],
                            ],
                            'replaced_components' => [],
                            'activities' => [1],
                        ],
                    ],
                ],
                [
                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-009',
                    'id_typ_main' => 4,
                    'vis_main' => 'V',
                    'created_at' => Carbon::parse('2024-03-10'),
                    'ended_at' => Carbon::parse('2024-03-15'),
                    'details' => [
                        [
                            'id_ass_bel' => 2,
                            'observations' => [
                                ['des_obs' => 'Sustitución de ventilador por ruido excesivo.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 15, 'des_rep_com' => 'Ventilador sustituido por uno más eficiente.'],
                            ],
                            'activities' => [1],
                        ],
                    ],
                ],
                [
                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-010',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::now()->subDays(5),
                    'ended_at' => Carbon::now()->subDays(1),
                    'details' => [
                        [
                            'id_ass_bel' => 5, // Impresora

                            'replaced_components' => [
                                ['id_com_bel' => 5, 'des_rep_com' => 'El disco duro presenta fallas en la lectura de datos.'],
                                ['id_com_bel' => 6, 'des_rep_com' => 'La tarjeta gráfica muestra artefactos visuales al procesar gráficos.'],
                            ],
                            'activities' => [1],
                        ],
                        [
                            'id_ass_bel' => 6, // Nuevo activo (Impresora)
                            'observations' => [
                                ['des_obs' => 'Problemas de alimentación en la impresora.'],
                                ['des_obs' => 'Falta de respuesta de la bandeja de papel.'],
                            ],
                            'replaced_components' => [], // No se reemplazaron componentes
                            'activities' => [1], // Actividad de revisión
                        ],
                    ],
                ],

                [
                    'dni_res_main' => '1721234567',
                    'cod_main' => 'MA-011',
                    'id_typ_main' => 2,
                    'vis_main' => 'V',
                    'created_at' => Carbon::now()->subDays(15),
                    'ended_at' => Carbon::now()->subDays(10),
                    'details' => [
                        [
                            'id_ass_bel' => 6,
                            'observations' => [
                                ['des_obs' => 'Fallas detectadas en el software de control.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 7, 'des_rep_com' => 'Tarjeta madre sustituida.'],
                            ],
                            'activities' => [2, 5],
                        ],
                    ],
                ],
                [
                    'dni_res_main' => '1724567890',
                    'cod_main' => 'MA-012',
                    'id_typ_main' => 1,
                    'vis_main' => 'V',
                    'created_at' => Carbon::now()->subYears(3)->addMonths(3),
                    'ended_at' => Carbon::now()->subYears(3)->addMonths(3)->addDays(5),
                    'details' => [
                        [
                            'id_ass_bel' => 7,
                            'observations' => [
                                ['des_obs' => 'Cambio de ventilador necesario.'],
                            ],
                            'replaced_components' => [
                                ['id_com_bel' => 5, 'des_rep_com' => 'Ventilador reemplazado.'],
                            ],
                            'activities' => [1],
                        ],
                    ],
                ],
                [
                    'dni_res_main' => '1721234567',
                    'cod_main' => 'MA-013',
                    'id_typ_main' => 2,
                    'vis_main' => 'V',
                    'created_at' => Carbon::now()->subYears(2),
                    'ended_at' => Carbon::now()->subYears(2)->addDays(7),
                    'details' => [
                        [
                            'id_ass_bel' => 8,
                            'observations' => [
                                ['des_obs' => 'Falla en el sistema eléctrico.'],
                            ],
                            'replaced_components' => [],
                            'activities' => [3],
                        ],
                    ],
                ],
            ];



            foreach ($maintenances as $maintenanceData) {
                $maintenance = Maintenance::create([
                    'dni_res_main' => $maintenanceData['dni_res_main'],
                    'cod_main' => $maintenanceData['cod_main'],
                    'id_typ_main' => $maintenanceData['id_typ_main'],
                    'vis_main' => $maintenanceData['vis_main'],
                    'created_at' => $maintenanceData['created_at'],
                    'ended_at' => $maintenanceData['ended_at'],
                ]);

                foreach ($maintenanceData['details'] as $detailData) {
                    $maintenanceDetail = MaintenanceDetail::create([
                        'id_main_bel' => $maintenance->id,
                        'id_ass_bel' => $detailData['id_ass_bel'],
                    ]);

                    if (!empty($detailData['observations'])) {
                        foreach ($detailData['observations'] as $observation) {
                            Observation::create([
                                'id_det_main_obs' => $maintenanceDetail->id,
                                'des_obs' => $observation['des_obs'],
                            ]);
                        }
                    }

                    if (!empty($detailData['replaced_components'])) {
                        foreach ($detailData['replaced_components'] as $component) {
                            ReplacedComponent::create([
                                'id_det_main_bel' => $maintenanceDetail->id,
                                'id_com_bel' => $component['id_com_bel'],
                                'des_rep_com' => $component['des_rep_com'],
                            ]);
                        }
                    }

                    if (!empty($detailData['activities'])) {
                        foreach ($detailData['activities'] as $activityId) {
                            DB::table('activity_maintenance_details')->insert([
                                'id_main' => $maintenanceDetail->id,
                                'id_act' => $activityId,
                                'created_at' => Carbon::now(),
                                'updated_at' => Carbon::now(),
                            ]);
                        }
                    }
                }
            }
        });
    }
}