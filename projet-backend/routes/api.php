<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\AdminController;

// Routes publiques (Étudiants)
Route::post('/demandes', [DemandeController::class, 'store']);

// Routes d'authentification admin
Route::post('/admin/login', [AdminController::class, 'login']);

// Routes protégées (Admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AdminController::class, 'logout']);
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/demandes', [AdminController::class, 'getDemandes']);
    Route::get('/admin/demandes/{id}', [AdminController::class, 'getDemandeDetails']);
    Route::put('/admin/demandes/{id}/valider', [AdminController::class, 'validerDemande']);
    Route::put('/admin/demandes/{id}/refuser', [AdminController::class, 'refuserDemande']);
});
