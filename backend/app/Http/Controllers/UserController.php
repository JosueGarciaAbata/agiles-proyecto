<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json([
            "results" => $users,
            "message" => "Operacion exitosa",
            // como el josue toma el ok del status m parece innecesario poner mensaje
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|string|max:255|unique:users,email",
                "password" => "required|string|max:255",
                "role" => "nullable|string",
                "dni_usr" => "required|string|size:10|unique:users,dni_usr|unique:responsibles,dni_res",
            ], [
                "email.unique" => "Correo electronico duplicado",
                "dni_usr.unique" => "Cédula duplicada"
            ]);

            $user = User::create([
                "name" => $validated["name"],
                "email" => $validated["email"],
                "password" => Hash::make($validated["password"]),
                "dni_usr" => $validated["dni_usr"],
                "role" => $validated["role"] ?? "user",
            ]);

            return response()->json([
                "message" => "Usuario creado exitosamente",
                "results" => $user
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                "message" => "Errores de validación",
                "errors" => $e->errors(),
            ], 422);
        }
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user)
            return response()->json([
                "message" => "Usuario no encontrado",
            ], 404);

        return response()->json([
            "result" => $user,
            "message" => "Usuario obtenido exitosamente"
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user)
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);

        try {
            $validatedData = $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|string|max:255|unique:users,email,$id",
                "password" => "nullable|string|max:255",
                "role" => "required|string|in:admin,user"
            ], [
                "email.unique" => "Correo electronico duplicado",
                "role.in" => "El rol debe ser 'admin' o 'user'"
            ]);
            //si no esta quitarlo del arreglo
            if (!empty($validatedData["password"])) {
                $validatedData["password"] = Hash::make($validatedData["password"]);
            } else { // eliminar clave
                unset($validatedData["password"]);
            }

            $user->update($validatedData);

            return response()->json([
                "message" => "Usuario actualizado exitosamente"
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                "message" => "Errores de validación",
                "errors" => $e->errors(),
            ], 422);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user)
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);

        $user->delete();
        return response()->json([
            "message" => "Usuario eliminado con exito."
        ], 200);
    }

    public function search(Request $request)
    {
        $request->validate([
            "term" => "required|string|min:1|max:50",
        ]);
        $term = $request["term"] ?? "";
        $users = User::where("dni_usr", "LIKE", "%$term%")->get();

        return response()->json([
            "results" => $users,
        ], 200);
    }
}