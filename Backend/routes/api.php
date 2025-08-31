<?php
use Illuminate\Http\Request;    
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\AsetController;
use App\Http\Controllers\LaporanController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);


Route::middleware(['auth:api'])->group(function () {


    Route::middleware('role:admin')->group(function () {
        Route::post('/register-pegawai', [AuthController::class, 'registerPegawai']);
        Route::apiResource('pegawai', PegawaiController::class)->except(['store']);
    });


    Route::middleware('role:pegawai')->group(function () {
        Route::apiResource('lokasi', LokasiController::class);
        Route::get('/aset/riwayat', [AsetController::class, 'riwayat']);
        Route::post('/aset/bulk-upload', [AsetController::class, 'bulkUpload']);
        Route::apiResource('aset', AsetController::class);
        Route::get('/laporan', [LaporanController::class, 'generate']);
    });
});
