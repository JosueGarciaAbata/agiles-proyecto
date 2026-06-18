<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResponsibleRequest;
use App\Models\Responsible;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ResponsibleController extends Controller
{
    public function index()
    {
        $responsibles = Responsible::all();
        return response()->json([
            "results" => $responsibles,
        ], 200);
    }

    public function store(ResponsibleRequest $request)
    {
        try {
            $responsible = Responsible::create($request->validated());
            return response()->json([
                "results" => $responsible
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Ocurrió un error al guardar al responsable",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function update(ResponsibleRequest $request, $id)
    {

        try {
            $responsible = Responsible::findOrFail($id);
            $validatedData = $request->validated();

            $responsible->update([
                "nam_res" => $validatedData['nam_res'],
                "las_res" => $validatedData['las_res'],
                "ema_res" => $validatedData['ema_res'],
                "pho_res" => $validatedData['pho_res'],
                "is_ext" => $validatedData['is_ext'],
            ]);

            return response()->json([
                "message" => "Responsable actualizado"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "message" => "Resposable no encontrado",
                // "error"=>;
            ], 404);
        }
    }

    public function show($id)
    {
        try {
            $responsible = Responsible::findOrFail($id);

            return response()->json([
                "result" => $responsible,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "message" => "Responsable no encontrado",
            ], 404);
        }
    }

    public function destroy($id)
    {// seria mas q nada logico, o no sep
        try {
            $responsible = Responsible::findOrFail($id);

            if (!$responsible) {
                return response()->json([
                    'message' => 'No se puede eliminar responsables asociados a mantenimientos',
                ], 404);
            }

            if ($responsible->maintenances()->exists()) {
                return response()->json([
                    'errors' => [
                        'reason' => ['No se puede eliminar el responsable debido a que está asociado a al menos un mantenimiento.']
                    ]
                ], 400);
            }

            $responsible->delete();
            return response()->json([
                "message" => "Eliminación exitosa"
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "message" => "Responsable no encontrado",
            ], 404);
        }
    }

    public function search(Request $request)
    {
        $request->validate([
            "term" => 'required|max:10'
        ]);
        $term = $request->input('term');
        $responsibles = Responsible::where('dni_res', 'LIKE', "%{$term}%")->get();

        return response()->json([
            'results' => $responsibles,
        ], 200);
    }
}