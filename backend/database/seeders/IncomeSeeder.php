<?php

namespace Database\Seeders;

use App\Models\Income;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncomeSeeder extends Seeder
{
    public function run(): void
    {

        Income::create([
            'cod_inc' => 'INC001',
            'date_inc' => '2018-02-02',
            'est_inc' => 'O',
            'supplier_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Income::create([
            'cod_inc' => 'INC002',
            'date_inc' => '2019-02-02',
            'est_inc' => 'O',
            'supplier_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        Income::create([
            'cod_inc' => 'INC003',
            'date_inc' => '2020-02-02',
            'est_inc' => 'O',
            'supplier_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Income::create([
            'cod_inc' => 'INC004',
            'date_inc' => '2021-02-02',
            'est_inc' => 'O',
            'supplier_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);



        Income::create([
            'cod_inc' => 'INC005',
            'date_inc' => Carbon::now()->subYear()->format('Y-m-d'),
            'est_inc' => 'O',
            'supplier_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Income::create([
            'cod_inc' => 'INC006',
            'date_inc' => Carbon::now()->subDays(5)->format('Y-m-d'),
            'est_inc' => 'O',
            'supplier_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Income::create([
            'cod_inc' => 'INC007',
            'date_inc' => Carbon::now()->subDays(10)->format('Y-m-d'),
            'est_inc' => 'O',
            'supplier_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Income::create([
            'cod_inc' => 'INC008',
            'date_inc' => Carbon::now()->subDays(2)->format('Y-m-d'),
            'est_inc' => 'O',
            'supplier_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);



        $incomes = [
            [
                'cod_inc' => 'INC009',
                'date_inc' => Carbon::now()->subYears(3)->format('Y-m-d'),
                'est_inc' => 'O',
                'supplier_id' => 1,
            ],
            [
                'cod_inc' => 'INC0010',
                'date_inc' => Carbon::now()->subYears(3)->addMonths(6)->format('Y-m-d'), // Hace 2.5 años
                'est_inc' => 'O',
                'supplier_id' => 2,
            ],
            [
                'cod_inc' => 'INC0011',
                'date_inc' => Carbon::now()->subYears(2)->format('Y-m-d'),
                'est_inc' => 'O',
                'supplier_id' => 2,
            ],
        ];

        foreach ($incomes as $income) {
            Income::create(array_merge($income, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }


    }
}