<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{

    public function run(): void
    {
        Supplier::create([
            'id_num_sup' => '1723456789',
            'nam_sup' => 'Distribuidora Andina S.A.',
            'ema_sup' => 'contacto@andina.com',
            'pho_sup' => '022345678',
        ]);

        Supplier::create([
            'id_num_sup' => '0998765432',
            'nam_sup' => 'Importadora Quito LTDA',
            'ema_sup' => 'ventas@quitoimport.com',
            'pho_sup' => '023456789',
        ]);

    }
}