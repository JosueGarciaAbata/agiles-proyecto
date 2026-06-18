<?php
namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $locations = Location::all();

        return response()->json([
            'results' => $locations,
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            // Validación de los datos del request
            $validated = $request->validate([
                'cod_loc' => 'required|unique:locations,cod_loc',
                'nam_loc' => 'required'
            ], [
                'cod_loc.unique' => 'El código de ubicación ya existe. Por favor, elija otro.'
            ]);

            // Crear la ubicación
            $location = Location::create($validated);

            return response()->json([
                'message' => 'Ubicación creada con éxito',
                'data' => $location
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Captura los errores de validación
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show(string $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }

        return response()->json([
            'result' => $location,
            'message' => 'Operación exitosa',
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }

        try {
            // Validación de los campos
            $validated = $request->validate([
                'cod_loc' => 'required|unique:locations,cod_loc,' . $location->id,
                'nam_loc' => 'required'
            ], [
                'cod_loc.unique' => 'El código de ubicación ya existe. Por favor, elija otro.'
            ]);

            // Actualizar la ubicación
            $location->update($validated);

            return response()->json(['message' => 'Ubicación actualizada', 'data' => $location], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Captura los errores de validación
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(string $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(["message" => "Ubicación no encontrada"], 404);
        }


        if ($location->assets()->exists()) {
            return response()->json([
                'errors' => [
                    'reason' => ['No se puede eliminar la ubicación debido a que está asociado a al menos un activo.']
                ]
            ], 400);
        }


        $location->delete();

        return response()->json(["message" => "Ubicación borrada con éxito"], 200);
    }


    public function search(Request $request)
    {
        $request->validate([
            'term' => 'required|string|max:25',
        ]);

        $term = $request["term"] ?? "";
        $locations = Location::where('cod_loc', 'LIKE', "%$term%")->get();

        return response()->json([
            'results' => $locations,
            'message' => 'Búsqueda realizada con éxito.',
        ], 200);
    }

}