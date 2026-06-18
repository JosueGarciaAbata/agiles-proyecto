<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssetRequest;
use App\Models\Asset;
use App\Models\Category;
use App\Models\Component;
use App\Models\Income;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
class AssetController extends Controller
{
    //Crear, Actualizar,Eliminar,Ver, Filtrar   


    public function showOpenIncomes($id)
    {

        $asset = Asset::with('income')->find($id);


        $associatedIncome = $asset->income;

        $otherIncomes = Income::where('est_inc', 'O')
            ->where('id', '!=', $associatedIncome->id)
            ->get();
        $combinedIncomes = $otherIncomes->prepend($associatedIncome);

        return response()->json($combinedIncomes, 200);
    }
    public function showOpenIncomesCreate()
    {

        $incomes = Income::select('id', 'cod_inc')
            ->where('est_inc', 'O')
            ->get();

        if ($incomes->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron ingresos'
            ]);
        }

        return response()->json($incomes, 200);
    }

    public function hideAsset($id)
    {
        $asset = Asset::findOrFail($id);

        if ($asset->est_ass === 'H') {
            return response()->json([
                'error' => true,
                'message' => 'El activo ya está oculto.',
            ], 400);
        }

        $asset->update([
            'est_ass' => 'H',
        ]);

        return response()->json($asset->only([
            'id_inc_ass',
            'id_cat_ass',
            'id_loc_ass',
            'cod_ass',
            'est_ass',
            'ser_num_ass',
            'obs_add_ass',
            'updated_at',
            'created_at',
            'id',
        ]) + [
            'category_name' => $asset->category->nom_dis,
            'location_name' => $asset->location->nam_loc,
            'income_code' => $asset->income->cod_inc,
        ]);
    }

    public function visibleAsset($id)
    {
        $asset = Asset::findOrFail($id);

        if ($asset->est_ass === 'V') {
            return response()->json([
                'error' => true,
                'message' => 'El activo ya está visible.',
            ], 400);
        }

        $asset->update([
            'est_ass' => 'V',
        ]);

        return response()->json($asset->only([
            'id_inc_ass',
            'id_cat_ass',
            'id_loc_ass',
            'cod_ass',
            'est_ass',
            'ser_num_ass',
            'obs_add_ass',
            'updated_at',
            'created_at',
            'id',
        ]) + [
            'category_name' => $asset->category->nom_dis,
            'location_name' => $asset->location->nam_loc,
            'income_code' => $asset->income->cod_inc,
        ]);
    }

    public function index()
    {

        $payload = JWTAuth::parseToken()->getPayload();
        $rol = $payload->get('role');


        if ($rol == 'user') {
            $assets = Asset::where('est_ass', 'V')
                ->with(['income', 'category', 'location'])
                ->get();

        } else {

            $assets = Asset::with(['income', 'category', 'location'])->get();
        }


        $transformedAssets = $assets->map(function ($asset) use ($rol) {
            return [
                'id' => $asset->id,
                'income_code' => $asset->income->cod_inc,
                'category_name' => $asset->category->nom_dis,
                'location_name' => $asset->location->nam_loc,
                'location_data' => $asset->location,
                'income_data' => $asset->income,
                'category_data' => $asset->category,
                'cod_ass' => $asset->cod_ass,
                'ser_num_ass' => $asset->ser_num_ass,
                'obs_add_ass' => $asset->obs_add_ass ?? null,
                'est_ass' => $rol === 'admin' ? $asset->est_ass : null,

            ];
        });
        return response()->json($transformedAssets, 200);
    }


    public function all()
    {
        // Obtener todos los activos
        $assets = Asset::all();

        // Mapear para solo devolver el 'id' de cada activo
        $transformedAssets = $assets->map(function ($asset) {
            return [
                'id' => $asset->id, // Solo devolver el ID
                'cod_ass' => $asset->cod_ass,
                'ser_num_ass' => $asset->ser_num_ass
            ];
        });

        // Retornar la respuesta con los IDs de los activos
        return response()->json($transformedAssets, 200);
    }

    public function indexForMaintenances()
    {

        $assets = Asset::where('est_ass', 'V')
            ->select('id', 'cod_ass', 'ser_num_ass')
            ->get();


        return response()->json($assets, 200);
    }




    public function show($id)
    {

        $payload = JWTAuth::parseToken()->getPayload();
        $userRole = $payload->get('role');


        if (!$userRole) {
            return response()->json([
                'errors' => [
                    'role' => ['El rol del usuario no fue proporcionado.']
                ]
            ], 400);
        }

        $asset = Asset::with([
            'income:id,cod_inc,est_inc',
            'category:id,cod_dis,nom_dis',
            'location:id,cod_loc,nam_loc',
            'components:id,nam_com'
        ])->findOrFail($id);

        if ($asset->est_ass === 'H' && $userRole !== "admin") {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'asset' => ['El activo solicitado no está disponible actualmente.']
                ]
            ], 422));
        }


        $components = $asset->components->map(function ($component) {
            return [
                'id' => $component->id,
                'nam_com' => $component->nam_com,
                'pivot' => [
                    'description' => $component->pivot->description,
                ],
            ];
        });


        $response = [
            'id' => $asset->id,
            'id_inc_ass' => $asset->income->id,
            'id_cat_ass' => $asset->category->id,
            'id_loc_ass' => $asset->location->id,
            'income_code' => $asset->income->cod_inc,
            'income_est' => $asset->income->est_inc,
            'category_name' => $asset->category->nom_dis,
            'location_name' => $asset->location->nam_loc,
            'cod_ass' => $asset->cod_ass,
            'ser_num_ass' => $asset->ser_num_ass,
            'obs_add_ass' => $asset->obs_add_ass ?? null,
            'components' => $components,
        ];

        return response()->json($response);
    }



    public function showForManteinces($id)
    {
        $asset = Asset::findOrFail($id);

        if ($asset->est_ass === 'H') {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'asset' => ['El activo solicitado no está disponible actualmente.']
                ]
            ], 422));
        }


        $components = $asset->components->map(function ($component) {
            return [
                'id' => $component->id,
                'cod_com' => $component->cod_com,
                'nam_com' => $component->nam_com,
                'pivot' => [
                    'description' => $component->pivot->description,
                ],
            ];
        });


        $response = [

            'components' => $components,
        ];

        return response()->json($response);
    }


    public function store(AssetRequest $request)
    {


        $validatedData = $request->validated();

        $service = $validatedData['asset'];



        $service = $request->input('asset');

        $incomeId = $service['id_inc_ass'];

        $income = Income::findOrFail($incomeId);

        if ($income->est_inc === 'C') {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'income' => ['No se pudo registrar el activo, debido a que el ingreso asociado se encuentra actualmente cerrado.']
                ]
            ], 422));
        }

        $asset = Asset::create([

            'id_inc_ass' => $service['id_inc_ass'],
            'id_cat_ass' => $service['id_cat_ass'],
            'id_loc_ass' => $service['id_loc_ass'],
            'cod_ass' => $service['cod_ass'],
            'ser_num_ass' => $service['ser_num_ass'],
            'obs_add_ass' => $service['obs_add_ass'] ?? null,

        ]);


        $components = collect($service['components'])->mapWithKeys(function ($component) {
            return [
                $component['id'] => [
                    'description' => $component['pivot']['description'],
                ],
            ];
        });

        $asset->components()->attach($components);

        return response()->json([
            'asset' => $asset->toArray() + [
                'category_data' => $asset->category,
                'location_data' => $asset->location,
                'income_data' => $asset->income,
                'category_name' => $asset->category->nom_dis,
                'location_name' => $asset->location->nam_loc,
                'income_code' => $asset->income->cod_inc,
            ],
        ]);
    }
    public function update(AssetRequest $request, string $id)
    {
        $validatedData = $request->validated();

        $asset = Asset::findOrFail($id);

        // Obtener los datos actualizados
        $service = $validatedData['asset'];

        $incomeId = $service['id_inc_ass'];


        if ($incomeId != $asset->id_inc_ass) {
            $income = Income::findOrFail($incomeId);


            if ($income->est_inc === 'C') {
                throw new HttpResponseException(response()->json([
                    'errors' => [
                        'income' => ['No se pudo actualizar el activo, debido a que el ingreso asociado se encuentra actualmente cerrado.']
                    ]
                ], 422));
            }
        }


        $asset->update([
            'id_inc_ass' => $service['id_inc_ass'],
            'id_loc_ass' => $service['id_loc_ass'],
            'cod_ass' => $service['cod_ass'],
            'ser_num_ass' => $service['ser_num_ass'],
            'obs_add_ass' => $service['obs_add_ass'] ?? $asset->obs_add_ass,
        ]);


        if (isset($service['components'])) {
            $components = collect($service['components'])->mapWithKeys(function ($component) {
                return [
                    $component['id'] => [
                        'description' => $component['pivot']['description'],
                    ],
                ];
            });

            $asset->components()->sync($components);
        }

        return response()->json([
            'asset' => $asset->toArray() + [
                'category_data' => $asset->category,
                'location_data' => $asset->location,
                'income_data' => $asset->income,
                'category_name' => $asset->category->nom_dis,
                'location_name' => $asset->location->nam_loc,
                'income_code' => $asset->income->cod_inc,
            ],
        ]);
    }

    public function search(Request $request)
    {

        $payload = JWTAuth::parseToken()->getPayload();
        $rol = $payload->get('role');

        $request->validate([
            'term' => 'required|string|max:25',
        ]);

        $term = $request->input('term');

        $query = Asset::with(['income', 'category', 'location'])
            ->where('ser_num_ass', 'LIKE', "%{$term}%");


        if ($rol == 'user') {
            $query->where('est_ass', 'V');
        }


        $assets = $query->get();


        $transformedAssets = $assets->map(function ($asset) use ($rol) {
            return [
                'id' => $asset->id,
                'income_code' => $asset->income->cod_inc,
                'category_name' => $asset->category->nom_dis,
                'location_name' => $asset->location->nam_loc,
                'cod_ass' => $asset->cod_ass,
                'ser_num_ass' => $asset->ser_num_ass,
                'obs_add_ass' => $asset->obs_add_ass ?? null,
                'est_ass' => $rol === 'admin' ? $asset->est_ass : null,
            ];
        });

        return response()->json($transformedAssets, 200);
    }

    public function indexWithFilters(Request $request)
    {

        $payload = JWTAuth::parseToken()->getPayload();
        $rol = $payload->get('role');

        $assets = Asset::query();


        if ($request->has('location') && count($request->input('location')) > 0) {
            $assets->whereIn('id_loc_ass', $request->input('location'));
        }

        if ($request->has('income') && count($request->input('income')) > 0) {
            $assets->whereIn('id_inc_ass', $request->input('income'));
        }


        if ($request->has('type') && count($request->input('type')) > 0) {
            $assets->whereHas('category', function ($query) use ($request) {
                $query->whereIn('tip_dis', $request->input('type'));
            });
        }

        if ($request->has('device') && count($request->input('device')) > 0) {
            $assets->whereHas('category', function ($query) use ($request) {
                $query->whereIn('nom_dis', $request->input('device'));
            });
        }


        // Lógica para usuarios (rol "user")
        if ($rol === 'user') {
            // Ignorar cualquier filtro de estado y mostrar solo los activos visibles
            $assets->where('est_ass', 'V');
        } else if ($rol === 'admin' && $request->has('status') && count($request->input('status')) > 0) {
            // Lógica para administradores: permitir filtro por estado
            $assets->whereIn('est_ass', $request->input('status'));
        }



        $assets = $assets->with(['income', 'category', 'location'])->get();


        $transformedAssets = $assets->map(function ($asset) use ($rol) {
            return [
                'id' => $asset->id,
                'income_code' => $asset->income->cod_inc,
                'category_name' => $asset->category->nom_dis,
                'location_name' => $asset->location->nam_loc,
                'cod_ass' => $asset->cod_ass,
                'ser_num_ass' => $asset->ser_num_ass,
                'obs_add_ass' => $asset->obs_add_ass ?? null,
                'est_ass' => $rol === 'admin' ? $asset->est_ass : null,
            ];
        });

        return response()->json($transformedAssets, 200);
    }

    public function getStatus()
    {

        $statuses = Asset::distinct()->pluck('est_ass');

        $mappedStatuses = $statuses->map(function ($status) {
            return [
                'code' => $status,
                'description' => $status === 'V' ? 'Visible' : 'Oculto'
            ];
        });

        return response()->json($mappedStatuses, 200);
    }

    public function validateAssets(Request $request)
    {
        $assets = $request->input('assets');

        $validAssets = [];
        $invalidAssets = [];
        $codAssArray = [];
        $serNumArray = [];

        foreach ($assets as $key => $asset) {
            $errors = []; // Inicializar el array de errores para cada activo

            // Verificar si el código o número de serie se repiten en el JSON
            if (in_array($asset['cod_ass'], $codAssArray)) {
                $errors['cod_ass'][] = "El código '{$asset['cod_ass']}' ya se ha ingresado.";
            } else {
                $codAssArray[] = $asset['cod_ass'];
            }

            if (in_array($asset['ser_num_ass'], $serNumArray)) {
                $errors['ser_num_ass'][] = "El número de serie '{$asset['ser_num_ass']}' ya se ha ingresado.";
            } else {
                $serNumArray[] = $asset['ser_num_ass'];
            }

            // Buscar el ingreso por su código
            try {
                $income = Income::where('cod_inc', $asset['id_inc_ass'])->firstOrFail();

                if ($income->est_inc == 'C') {
                    $errors['id_inc_ass'][] = "El ingreso asociado está cerrado y no puede usarse.";
                } else {
                    // Asignamos el ID del ingreso al activo
                    $asset['id_inc_ass'] = $income->id;
                }
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                $errors['id_inc_ass'][] = "El ingreso asociado al activo no existe.";
            }

            // Buscar la localización por su código
            try {
                $location = Location::where('cod_loc', $asset['id_loc_ass'])->firstOrFail();
                // Asignamos el ID de la localización al activo
                $asset['id_loc_ass'] = $location->id;
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                $errors['id_loc_ass'][] = "La localización ingresada no existe.";
            }

            // Continuamos con las demás validaciones
            try {
                $rules = [
                    'id_inc_ass' => 'required',
                    'id_loc_ass' => 'required',
                    'id_cat_ass' => 'required',
                    'cod_ass' => 'required|unique:assets,cod_ass',
                    'ser_num_ass' => 'required|unique:assets,ser_num_ass',
                    'components.*.id' => 'required|exists:components,id',
                    'components.*.pivot.description' => 'required|string',
                    'obs_add_ass' => 'nullable|string|max:500',
                ];

                // Definir los mensajes personalizados para las reglas de validación
                $messages = [
                    'id_loc_ass.required' => "La localización es obligatoria.",
                    'id_inc_ass.required' => "El ingreso es obligatorio.",
                    'id_cat_ass.required' => "La categoría del activo es obligatoria.",
                    'cod_ass.unique' => "El código de activo '{$asset['cod_ass']}' ya esta registrado en la base de datos.",
                    'ser_num_ass.unique' => "El número de serie '{$asset['ser_num_ass']} ya esta registrado en la base de datos.",
                    'components.*.id.exists' => "El componente especificado no existe para el activo en la posición {$key}.",
                    'components.*.pivot.description.required' => "La descripción del componente es obligatoria para el activo en la posición {$key}.",
                    'components.*.pivot.description.string' => "La descripción del componente debe ser una cadena de texto para el activo en la posición {$key}.",
                ];

                // Validar cada activo usando las reglas definidas
                $validator = Validator::make($asset, $rules, $messages);

                if ($validator->fails()) {
                    // Agrupar los errores por campo
                    $errors = array_merge($errors, $validator->errors()->toArray());
                }

                // Validación de la categoría y sus componentes
                try {
                    $category = Category::findOrFail($asset['id_cat_ass']);
                } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                    $errors['id_cat_ass'][] = "La categoría ingresada no existe.";
                }

                $requiredComponents = $category ? $category->components->pluck('id')->toArray() : [];
                $providedComponents = collect($asset['components'])->pluck('id')->toArray();

                // Verificar que todos los componentes requeridos están presentes
                if (array_diff($requiredComponents, $providedComponents)) {
                    $errors['components'][] = "Faltan componentes obligatorios para la categoría seleccionada en el activo {$key}.";
                }

                // Si hay errores acumulados, los agregamos a los activos inválidos
                if (!empty($errors)) {
                    $invalidAssets[] = [
                        'header' => "El asset {$asset['cod_ass']} no se pudo registrar debido a los siguientes errores",
                        'errors' => $errors, // Incluye los errores agrupados por campo
                    ];
                } else {

                    foreach ($asset['components'] as &$component) {
                        try {
                            // Obtén el nombre del componente por su ID
                            $componentData = Component::findOrFail($component['id']);
                            $component['name'] = $componentData->nam_com; // Agrega el nombre del componente
                        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                            // Si el componente no se encuentra, puedes manejarlo aquí si es necesario
                            $component['name'] = null; // O asignar un valor por defecto
                        }
                    }


                    $asset['category_name'] = $category->nom_dis; // Usando la variable $category que ya recuperaste
                    $asset['location_name'] = $location->nam_loc; // Usando la variable $location
                    $asset['income_code'] = $income->cod_inc; // Usando la variable $income
                    $asset['category_data'] = $category;
                    $asset['income_data'] = $income;
                    $asset['location_data'] = $location;

                    $validAssets[] = $asset;
                }

            } catch (\Exception $e) {
                // Si ocurre algún error inesperado, lo agregamos al array de errores
                $invalidAssets[] = [
                    'asset' => $asset,
                    'error' => $e->getMessage(),
                ];
            }
        }

        // Devolver tanto los válidos como los inválidos con sus razones de error
        return response()->json([
            'valid_assets' => $validAssets,
            'invalid_assets' => $invalidAssets,
        ]);
    }

    public function storeBatch(Request $request)
    {
        $assets = $request->input('assets');

        $successMessages = [];
        $errorMessages = [];
        $assetDetails = [];

        foreach ($assets as $key => $service) {
            try {

                $income = Income::findOrFail($service['id_inc_ass']);
                if ($income->est_inc === 'C') {
                    throw new \Exception("El ingreso asociado está cerrado.");
                }


                $asset = Asset::create([
                    'id_inc_ass' => $service['id_inc_ass'],
                    'id_cat_ass' => $service['id_cat_ass'],
                    'id_loc_ass' => $service['id_loc_ass'],
                    'cod_ass' => $service['cod_ass'],
                    'ser_num_ass' => $service['ser_num_ass'],
                    'obs_add_ass' => $service['obs_add_ass'] ?? null,
                ]);


                $components = collect($service['components'])->mapWithKeys(function ($component) {
                    return [
                        $component['id'] => [
                            'description' => $component['pivot']['description'],
                        ],
                    ];
                });
                $asset->components()->attach($components);


                $asset->load(['income', 'category', 'location', 'components']);


                $assetDetails[] = [
                    'id' => $asset->id,
                    'income_code' => $asset->income->cod_inc,
                    'category_name' => $asset->category->nom_dis,
                    'location_name' => $asset->location->nam_loc,
                    'location_data' => $asset->location,
                    'income_data' => $asset->income,
                    'category_data' => $asset->category,
                    'cod_ass' => $asset->cod_ass,
                    'ser_num_ass' => $asset->ser_num_ass,
                    'obs_add_ass' => $asset->obs_add_ass ?? null,

                ];

                $successMessages[] = "Activo con código '{$service['cod_ass']}' registrado exitosamente.";

            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                $errorMessages[] = [
                    'cod_ass' => $service['cod_ass'],
                    'error' => "No se pudo encontrar el ingreso o la ubicación asociada."
                ];
            } catch (\Exception $e) {
                $errorMessages[] = [
                    'cod_ass' => $service['cod_ass'],
                    'error' => $e->getMessage()
                ];
            }
        }


        return response()->json([
            'message' => 'Proceso de registro de activos en lote completado.',
            'success_messages' => $successMessages,
            'error_messages' => $errorMessages,
            'asset_details' => $assetDetails,
        ]);
    }


}