<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * route "/register"
 * @method "POST"
 */
Route::post('/register', App\Http\Controllers\Api\RegisterController::class)->name('register');

/**
 * route "/login"
 * @method "POST"
 */
Route::post('/login', App\Http\Controllers\Api\LoginController::class)->name('login');

/**
 * route "/user"
 * @method "GET"
 */
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * route "/logout"
 * @method "POST"
 */
Route::post('/logout', App\Http\Controllers\Api\LogoutController::class)->name('logout');


Route::middleware('auth:api')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);  
    Route::get('/products', [ProductController::class, 'index']);   
    Route::get('/products/{id}', [ProductController::class, 'show']); 
}); 

