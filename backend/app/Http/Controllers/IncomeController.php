<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeRequest;
use App\Models\Income;
use App\Models\Supplier;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class IncomeController extends Controller
{
    public function index()
    {
        $incomes = Income::with('supplier:id,nam_sup')->get();

        $formattedIncomes = $incomes->map(function ($income) {
            return [
                'id' => $income->id,
                'cod_inc' => $income->cod_inc,
                'date_inc' => $income->date_inc,
                'est_inc' => $income->est_inc,
                'supplier_name' => $income->supplier->nam_sup ?? null,
            ];
        });

        return response()->json([
            'results' => $formattedIncomes
        ], 200);
    }



    public function store(IncomeRequest $request)
    {

        $validated = $request->validated();
        $supplier = Income::create([
            'cod_inc' => $validated['cod_inc'],
            'date_inc' => $validated['date_inc'],
            'supplier_id' => $validated['supplier_id'],
        ]);

        return response()->json([
            'message' => 'Ingreso creado con éxito',
            'data' => $supplier,
        ], 201);
    }



    public function update(IncomeRequest $request, $id)
    {

        $validatedData = $request->validate(
            [
                'est_inc' => 'required|in:O,C',
            ],
            [
                'est_inc.required' => 'El estado es obligatorio.',
                'est_inc.in' => 'El estado debe ser "O" (abierto) o "C" (cerrado).',
            ]
        );

        $income = Income::findOrFail($id);

        $income->update(array_merge($request->validated(), $validatedData));

        return response()->json([
            "message" => 'Ingreso actualizado con exito',
            'income' => $income

        ], 200);
    }

    public function show($id)
    {
        try {
            $supplier = Income::find($id);

            return response()->json([
                'result' => $supplier,
                'message' => 'Operación exitosa',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Ingreso no encontrado',
                'error' => $e->getMessage(),
            ], 404);
        }

    }

    public function destroy($id)
    {

        $income = Income::findOrFail($id);

        if ($income->assets()->exists()) {

            return response()->json([
                'errors' => [
                    'reason' => ['No se puede eliminar el ingreso debido a que está asociado a al menos un activo.']
                ]
            ], 400);



        } else {

            $income->delete();

            return response()->json([
                'message' => 'Ingreso elimado con exito'
            ], 200);
        }

    }

    public function search(Request $request)
    {
        $request->validate([
            'term' => 'required|string|max:25',
        ]);

        $term = $request->input('term');


        $incomes = Income::with('supplier:id,nam_sup')
            ->where('cod_inc', 'LIKE', "%{$term}%")
            ->get();


        $formattedIncomes = $incomes->map(function ($income) {
            return [
                'id' => $income->id,
                'cod_inc' => $income->cod_inc,
                'date_inc' => $income->date_inc,
                'est_inc' => $income->est_inc,
                'supplier_name' => $income->supplier->nam_sup ?? null,
            ];
        });

        return response()->json([
            'results' => $formattedIncomes,
            'message' => 'Búsqueda realizada con éxito.',
        ], 200);
    }



    //  * Search categories based on term.
    //  */
    // public function search(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'term' => 'required|string|max:25',
    //         ]);

    //         $term = $request->input('term');
    //         $categories = Category::where('cod_dis', 'LIKE', "%{$term}%")->get();

    //         return response()->json([
    //             'results' => $categories,
    //             'message' => 'Búsqueda realizada con éxito.',
    //         ], 200);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         // Captura los errores de validación
    //         return response()->json([
    //             'message' => 'Errores de validación',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         // Captura cualquier otro error
    //         return response()->json(['message' => 'Error al realizar la búsqueda'], 500);
    //     }
    // }
    /**

    * /
     * @param mixed $supplierId
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    // public function showBySupplier($supplierId)
    // {
    //     $incomes = Income::where('id_sup_inc', $supplierId)->get();

    //     return response()->json(["data" => $incomes, "message" => "Operation ends well"], 200);
    // }

    // public function store(Request $request, $supplierId)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             "time" => "nullable|date",
    //             "state" => "required|string|max:1"
    //         ]);

    //         Supplier::findOrFail($supplierId);

    //         $income = new Income();
    //         $income->updated_at = $validatedData["time"] ?? now();
    //         $income->est_inc = $validatedData["state"];
    //         $income->id_sup_inc = $supplierId;
    //         $income->save();

    //         return response()->json([
    //             "message" => "Ingreso creado exitosamente.",
    //         ], 201);
    //     } catch (ValidationException $exception) {
    //         return response()->json([
    //             "message" => "Errores de validación.",
    //             "errors" => $exception->errors()
    //         ], 422);
    //     } catch (Exception $exception) {
    //         return response()->json([
    //             "message" => "Ocurrió un error inesperado."
    //         ], 500);
    //     }
    // }

    // public function update(Request $request, $incomeId)
    // {
    //     try {
    //         $income = Income::findOrFail($incomeId);

    //         $validatedData = $request->validate([
    //             "time" => "nullable|date",
    //             "state" => "nullable|string|max:1"
    //         ]);

    //         $income->updated_at = $validatedData["time"] ?? $income->updated_at;
    //         $income->est_inc = $validatedData["state"] ?? $income->est_inc;
    //         $income->save();

    //         return response()->json([
    //             "message" => "Ingreso actualizado exitosamente.",
    //         ]);
    //     } catch (ValidationException $exception) {
    //         return response()->json([
    //             "message" => "Errores de validación.",
    //             "errors" => $exception->errors()
    //         ], 422);
    //     } catch (Exception $exception) {
    //         return response()->json([
    //             "message" => "Ocurrió un error inesperado."
    //         ], 500);
    //     }
    // }

    // public function destroy($incomeId)
    // {
    //     try {
    //         $income = Income::find($incomeId);
    //         $message = "Ingreso eliminado con éxito.";
    //         if (!$income) {
    //             return response()->json([
    //                 "message" => $income ? "Ingreso eliminado con éxito." : "El ingreso no existe"
    //             ], 404);
    //         }
    //         $income->delete();
    //         return response()->json([
    //             "message" => "Ingreso eliminado con éxito."
    //         ], 200);

    //     } catch (Exception $exception) {
    //         return response()->json([
    //             "message" => "Ocurrió un error inesperado."
    //         ], 500);
    //     }
    // }

    // public function index()
    // {
    //     $categories = Category::all();

    //     return response()->json([
    //         'results' => $categories,
    //         'message' => 'Categoría obtenida con éxito.'
    //     ], 200);
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function store(Request $request)
    // {
    //     try {
    //         // Validación de los datos del request
    //         $validated = $request->validate([
    //             'cod_dis' => 'required|string|max:10|unique:categories,cod_dis',
    //             'tip_dis' => 'required|string|max:10',
    //             'nom_dis' => 'required|string|max:25'
    //         ], [
    //             'cod_dis.unique' => 'El código de la categoría ya existe. Por favor, elija otro.'
    //         ]);

    //         // Intentamos crear el registro
    //         $category = Category::create($validated);

    //         // Devolvemos la respuesta
    //         return response()->json([
    //             'category' => $category,
    //             'message' => 'Categoría almacenada correctamente'
    //         ], 201);

    //     } catch (\Illuminate\Validation\ValidationException $e) {

    //         $errors = $e->errors();


    //         return response()->json([
    //             'message' => 'Errores de validación',
    //             'errors' => $errors
    //         ], 422);
    //     } catch (\Exception $e) {
    //         // Captura cualquier otro error
    //         return response()->json([
    //             "message" => 'Error inesperado',
    //             'errors' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    // /**
    //  * Display the specified resource.
    //  */
    // public function show(string $id)
    // {
    //     $category = Category::find($id);

    //     if (!$category) {
    //         return response()->json(['message' => 'Categoría no encontrada'], 404);
    //     }

    //     return response()->json([
    //         'result' => $category,
    //         'message' => 'Categoría obtenida con éxito.'
    //     ], 200);
    // }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function update(Request $request, string $id)
    // {
    //     $category = Category::find($id);

    //     if (!$category) {
    //         return response()->json(['message' => 'Categoría no encontrada'], 404);
    //     }

    //     try {
    //         // Validación de los campos
    //         $validated = $request->validate([
    //             'cod_dis' => 'required|unique:categories,cod_dis,' . $category->id,
    //             'tip_dis' => 'required|string|max:20',
    //             'nom_dis' => 'required|string|max:25',
    //         ], [
    //             'cod_dis.unique' => 'El código de la categoría ya existe. Por favor, elija otro.'
    //         ]);

    //         // Actualizar la categoría con los datos validados
    //         $category->update($validated);

    //         // Responder con la categoría actualizada
    //         return response()->json(['message' => 'Categoría actualizada', 'data' => $category], 200);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         $errors = $e->errors();



    //         return response()->json([
    //             'message' => 'Errores de validación',
    //             'errors' => $errors
    //         ], 422);

    //     } catch (\Exception $e) {
    //         // Captura cualquier otro error
    //         return response()->json(['message' => 'Error al actualizar la categoría'], 500);
    //     }
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(string $id)
    // {
    //     $category = Category::find($id);

    //     if (!$category) {
    //         return response()->json(['message' => 'Categoría no encontrada'], 404);
    //     }

    //     try {
    //         $category->delete();
    //         return response()->json(['message' => 'Categoría eliminada exitosamente'], 200);

    //     } catch (\Exception $e) {
    //         return response()->json(['message' => 'Error al eliminar la categoría'], 500);
    //     }
    // }

    // /**
    //  * Search categories based on term.
    //  */
    // public function search(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'term' => 'required|string|max:25',
    //         ]);

    //         $term = $request->input('term');
    //         $categories = Category::where('cod_dis', 'LIKE', "%{$term}%")->get();

    //         return response()->json([
    //             'results' => $categories,
    //             'message' => 'Búsqueda realizada con éxito.',
    //         ], 200);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         // Captura los errores de validación
    //         return response()->json([
    //             'message' => 'Errores de validación',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         // Captura cualquier otro error
    //         return response()->json(['message' => 'Error al realizar la búsqueda'], 500);
    //     }
    // }
}