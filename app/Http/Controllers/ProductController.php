<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
        return response()->json($products); 
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
    ]);

    $userId = Auth::user()->id;

    if (!$userId) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $product = Product::create([
        'name' => $request->input('name'), 
        'price' => $request->input('price'), 
        'user_id' => $userId, // user_id dari user yang login
    ]);

    return response()->json($product, 201); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    //
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
{
    // Ambil data produk berdasarkan ID
    $product = Product::find($id);

    // Cek apakah produk ditemukan
    if (!$product) {
        return response()->json([
            'message' => 'Product not found'
        ], 404);
    }

    // Mengembalikan data produk dalam format JSON
    return response()->json($product, 200);
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    
}
