<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MateriProgressController;
use App\Http\Controllers\Api\Materi1JawabanController;
use App\Http\Controllers\Api\Materi2JawabanController;
use App\Http\Controllers\Api\Materi3JawabanController;
use App\Http\Controllers\Api\Materi4JawabanController;
use App\Http\Controllers\Api\Materi5JawabanController;
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

    Route::get('/materi3/jawaban', [Materi3JawabanController::class, 'index']);
Route::post('/materi3/jawaban', [Materi3JawabanController::class, 'store']);
Route::get('/materi3/summary', [Materi3JawabanController::class, 'summary']);

Route::get('/materi4/jawaban', [Materi4JawabanController::class, 'index']);
Route::post('/materi4/jawaban', [Materi4JawabanController::class, 'store']);

Route::get('/materi5/jawaban', [Materi5JawabanController::class, 'index']);
Route::post('/materi5/jawaban', [Materi5JawabanController::class, 'store']);
Route::get('/materi5/summary', [Materi5JawabanController::class, 'summary']);
});