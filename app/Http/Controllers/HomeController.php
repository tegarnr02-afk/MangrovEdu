<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function index()
    {
        $materi = [
            ['id'=>1,'nomor'=>'01','judul'=>'Ekosistem Mangrove'],
            ['id'=>2,'nomor'=>'02','judul'=>'Interaksi dalam Ekosistem'],
            ['id'=>3,'nomor'=>'03','judul'=>'Perubahan Lingkungan'],
            ['id'=>4,'nomor'=>'04','judul'=>'Abrasi Pantai'],
            ['id'=>5,'nomor'=>'05','judul'=>'Konservasi Mangrove'],
        ];

        return view('home', compact('materi'));
    }
}