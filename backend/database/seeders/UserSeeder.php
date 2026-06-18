<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{

    public function run(): void
    {

        User::create([
            "name"=> "Administrador base",
            "email" => "admin@gmail.com",
            "password"=> Hash::make("admin123"),
            "role"=> "admin",
            "dni_usr"=> "1111111111"
        ]);

        User::create([
            "name"=> "Usuario Normal",
            "email" => "user@gmail.com",
            "password"=> Hash::make("user123"),
            "role"=> "user",
            "dni_usr"=> "2222222222"
        ]);
    }
}