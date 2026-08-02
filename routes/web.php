<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app'); // sesuaikan nama file view kamu, mis. resources/views/app.blade.php
})->where('any', '.*');