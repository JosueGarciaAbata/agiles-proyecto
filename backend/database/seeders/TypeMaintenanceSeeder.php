<?php

namespace Database\Seeders;

use App\Models\MaintenanceActivity;
use App\Models\MaintenanceType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeMaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        // Datos de los tipos de mantenimiento y sus actividades
        $tiposConActividades = [
            'Preventivo' => [
                'Inspección y limpieza periódica.',
                'Actualización de software.',
                'Revisión de conexiones.',
                'Reemplazo programado de piezas.'
            ],
            'Correctivo' => [
                'Reparación de fallos.',
                'Sustitución de componentes dañados.',
                'Restauración funcional tras errores.',
                'Corrección de bugs.'
            ],
            'Predictivo' => [
                'Monitoreo constante y análisis de tendencias.',
                'Alertas tempranas ante posibles fallos.',
                'Evaluación de parámetros críticos.'
            ],
            'Adaptativo' => [
                'Modificación de software para nuevos entornos.',
                'Ajustes por cambios de infraestructura.',
                'Migración a plataformas actualizadas.'
            ],
            'Perfectivo' => [
                'Mejoras de rendimiento.',
                'Nuevas funcionalidades según requerimientos.',
                'Optimización de procesos e interfaces.'
            ]
        ];

        // Crear tipos de mantenimiento y sus actividades
        foreach ($tiposConActividades as $tipo => $actividades) {
            $tipoMantenimiento = MaintenanceType::create([
                'typ_main' => $tipo
            ]);

            foreach ($actividades as $actividad) {
                MaintenanceActivity::create([
                    'typ_main_id' => $tipoMantenimiento->id,
                    'act_main' => $actividad
                ]);
            }
        }
    }
}