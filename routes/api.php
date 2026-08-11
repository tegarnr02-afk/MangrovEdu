<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MateriProgressController;
use App\Http\Controllers\Api\Materi1JawabanController;
use App\Http\Controllers\Api\Materi2JawabanController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/materi/progress', [MateriProgressController::class, 'index']);
    Route::post('/materi/{slug}/complete', [MateriProgressController::class, 'complete']);

    Route::get('/materi1/jawaban', [Materi1JawabanController::class, 'index']);
    Route::post('/materi1/jawaban', [Materi1JawabanController::class, 'store']);
    Route::get('/materi1/jawaban/summary', [Materi1JawabanController::class, 'summary']);

    Route::get('/materi2/jawaban', [Materi2JawabanController::class, 'index']);
    Route::post('/materi2/jawaban', [Materi2JawabanController::class, 'store']);
});