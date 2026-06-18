<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\IncomeController;
use Illuminate\Http\Request;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MaintenanceDetailController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ReplacedComponentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResponsibleController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\TypeMaintenanceController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\JwtMiddleware;

// no probadas
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('{id}', [UserController::class, 'show']);
    Route::put('{id}', [UserController::class, 'update']);
    Route::delete('{id}', [UserController::class, 'destroy']);
    Route::post('search', [UserController::class, 'search']);
});

// Rutas de Autenticación (sin protección)
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);
Route::post('logout', [JWTAuthController::class, 'logout']);

// Rutas de Proveedores
Route::prefix('suppliers')->group(function () {
    Route::get('/', [SuppliersController::class, 'index']);
    Route::post('/', [SuppliersController::class, 'store']);
    Route::get('{id}', [SuppliersController::class, 'show']);
    Route::put('{id}', [SuppliersController::class, 'update']);
    Route::delete('{id}', [SuppliersController::class, 'destroy']);
    Route::post('search', [SuppliersController::class, 'search']);
});

// Rutas de Categorías
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('show/{id}', [CategoryController::class, 'show']);
    Route::get('types', [CategoryController::class, 'getTypes']);
    Route::get('names', [CategoryController::class, 'getNames']);
});

// Rutas de Ubicaciones
Route::prefix('locations')->group(function () {
    Route::get('/', [LocationController::class, 'index']);
    Route::post('/', [LocationController::class, 'store']);
    Route::get('{id}', [LocationController::class, 'show']);
    Route::put('{id}', [LocationController::class, 'update']);
    Route::delete('{id}', [LocationController::class, 'destroy']);
    Route::post('search', [LocationController::class, 'search']);
});

// Rutas protegidas con middleware (por ejemplo, autenticación JWT)
Route::middleware([JwtMiddleware::class])->group(function () {
    // Aquí van las rutas protegidas
});


// Rutas de Ingresos
Route::prefix('incomes')->group(function () {
    Route::get('/', [IncomeController::class, 'index']);
    Route::post('/', [IncomeController::class, 'store']);
    Route::get('{id}', [IncomeController::class, 'show']);
    // Route::get('by-supplier/{id}', [IncomeController::class, 'showBySupplier']); // Comentada si no se usa
    Route::put('{id}', [IncomeController::class, 'update']);
    Route::delete('{id}', [IncomeController::class, 'destroy']);
    Route::delete('open', [IncomeController::class, 'showOpenIncomes']);
    Route::post('search', [IncomeController::class, 'search']);
});

// Rutas de Responsables
Route::prefix('responsibles')->group(function () {
    Route::get('/', [ResponsibleController::class, 'index']);
    Route::post('/', [ResponsibleController::class, 'store']);
    Route::get('{id}', [ResponsibleController::class, 'show']);
    Route::put('{id}', [ResponsibleController::class, 'update']);
    Route::delete('{id}', [ResponsibleController::class, 'destroy']);
    Route::post('search', [ResponsibleController::class, 'search']);
});

// Rutas de Activos
Route::prefix('assets')->group(function () {
    Route::get('/', [AssetController::class, 'index']);
    Route::get("/all", [AssetController::class, 'all']);
    Route::get('for-maintenance', [AssetController::class, 'indexForMaintenances']);
    Route::get('showForMaintenances/{id}', [AssetController::class, 'showForManteinces']);
    Route::get('show/{id}', [AssetController::class, 'show']);

    // Mostrar ingresos abiertos solo
    Route::get('incomes/create', [AssetController::class, 'showOpenIncomesCreate']);
    Route::get('incomes/{id}', [AssetController::class, 'showOpenIncomes']);

    // Actualizar activos
    Route::put('{id}', [AssetController::class, 'update']);

    // Ocultar, mostrar activos
    Route::put('hide/{id}', [AssetController::class, 'hideAsset']);
    Route::put('visible/{id}', [AssetController::class, 'visibleAsset']);

    // Rutas adicionales para activos
    Route::post('/', [AssetController::class, 'store']);
    Route::post('search', [AssetController::class, 'search']);
    Route::post('filters', [AssetController::class, 'indexWithFilters']);
    Route::post('status', [AssetController::class, 'getStatus']);


    //ingrso en lote 

    Route::post('/validateBatch', [AssetController::class, 'validateAssets']);

    Route::post('/storeBatch', [AssetController::class, 'storeBatch']);

});


//Mantenimientos - aun no gestiono su relacion con responsables
// Route::middleware([JwtMiddleware::class])->group(function () {

// });


// Rutas de Mantenimiento
Route::prefix('maintenances')->group(function () {
    Route::get('/', [MaintenanceController::class, 'index']);
    Route::post('/', [MaintenanceController::class, 'store']);
    Route::post('search', [MaintenanceController::class, 'search']);
    Route::get('{id}', [MaintenanceController::class, 'show']);
    Route::put('{id}', [MaintenanceController::class, 'update']);
    Route::post('{id}', [MaintenanceController::class, 'hide'])->where('id', '[0-9]+');
    Route::post('filters', [MaintenanceController::class, 'filteringMaintenances']);
    Route::post('filters-by-date', [MaintenanceController::class, 'maintenancesByTime']);
});

// Rutas de Observaciones
Route::prefix('observations')->group(function () {
    Route::get('/', [ObservationController::class, 'index']);
    Route::post('/', [ObservationController::class, 'store']);
    Route::get('{id}', [ObservationController::class, 'show']);
    Route::put('{id}', [ObservationController::class, 'update']);
    Route::delete('{id}', [ObservationController::class, 'destroy']);
    Route::post('search', [ObservationController::class, 'search']);
});

// Rutas de Tipo de Mantenimiento
Route::prefix('type-maintenance')->group(function () {
    Route::get('/', [TypeMaintenanceController::class, 'index']);
    Route::get('{id}', [TypeMaintenanceController::class, 'show']);
    // Las rutas comentadas no se han usado, pero están preparadas por si se necesitan
    // Route::post('/', [ActivityController::class, 'store']);
    // Route::put('{id}', [ActivityController::class, 'update']);
    // Route::delete('{id}', [ActivityController::class, 'destroy']);
    // Route::post('search', [ActivityController::class, 'search']);
});


// Rutas de Actividades de Mantenimiento
Route::prefix('activities')->group(function () {
    Route::get('/', [ActivityController::class, 'index']);
    Route::post('/', [ActivityController::class, 'store']);
    Route::get('{id}', [ActivityController::class, 'show']);
    Route::put('{id}', [ActivityController::class, 'update']);
    Route::delete('{id}', [ActivityController::class, 'destroy']);
    Route::post('search', [ActivityController::class, 'search']);
});

// Rutas de Componentes Reemplazados
Route::prefix('replaced-components')->group(function () {
    Route::get('/', [ReplacedComponentController::class, 'index']);
    Route::post('/', [ReplacedComponentController::class, 'store']);
    Route::get('{id}', [ReplacedComponentController::class, 'show']);
    Route::put('{id}', [ReplacedComponentController::class, 'update']);
    Route::delete('{id}', [ReplacedComponentController::class, 'destroy']);
    Route::post('search', [ReplacedComponentController::class, 'search']);
});

// Rutas de Detalles de Mantenimiento
Route::prefix('maintenance-detail')->group(function () {
    Route::get('/', [MaintenanceDetailController::class, 'index']);
    Route::get('{id}', [MaintenanceDetailController::class, 'show']);
    Route::post('/', [MaintenanceDetailController::class, 'store']);
    Route::put('{id}', [MaintenanceDetailController::class, 'update']);
});
// Reportes
Route::prefix('report')->group(function () {
    Route::post('/maintenances-by-responsible', [ReportController::class, 'filterByResponsibleAndTime']);
    Route::post('/maintenances-by-asset', [ReportController::class, 'filterByAsset']);
    Route::post('/mandatory-maintenances', [ReportController::class, 'maintenancesToAssets']);
    Route::post('/formated-mandatory-maintenances', [ReportController::class, 'maintenancesToAssetsFormated']);
});