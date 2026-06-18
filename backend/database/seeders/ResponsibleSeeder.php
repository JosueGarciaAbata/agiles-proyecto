<?php

namespace Database\Seeders;

use App\Models\Responsible;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResponsibleSeeder extends Seeder
{

    public function run(): void
    {
        Responsible::create([
            'dni_res' => '1724567890',
            'nam_res' => 'Andrés',
            'las_res' => 'Villacís',
            'ema_res' => 'andres.villacis@empresa.com',
            'pho_res' => '0987654321',
            'is_ext' => 'N',
        ]);

        Responsible::create([
            'dni_res' => '1721234567',
            'nam_res' => 'Mariana',
            'las_res' => 'Espinoza',
            'ema_res' => 'mariana.espinoza@empresa.com',
            'pho_res' => '0988765432',
            'is_ext' => 'N',
        ]);

        Responsible::create([
            'dni_res' => '0912345678',
            'nam_res' => 'Ricardo',
            'las_res' => 'Paredes',
            'ema_res' => 'ricardo.paredes@global.com',
            'pho_res' => '0991234567',
            'is_ext' => 'Y',
        ]);

        Responsible::create([
            'dni_res' => '0923456789',
            'nam_res' => 'Sofía',
            'las_res' => 'Torres',
            'ema_res' => 'sofia.torres@global.com',
            'pho_res' => '0998765432',
            'is_ext' => 'Y',
        ]);

    }
}