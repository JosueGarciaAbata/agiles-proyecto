<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        Location::create([
            'cod_loc' => 'D01',
            'nam_loc' => 'DITIC',
        ]);

        Location::create([
            'cod_loc' => 'L02',
            'nam_loc' => 'Laboratorio de redes2',
        ]);
        Location::create([
            'cod_loc' => 'E01',
            'nam_loc' => 'Laboratorio de Electrónica',
        ]);
        Location::create([
            'cod_loc' => 'A01',
            'nam_loc' => 'Administración Central',
        ]);
    }
}