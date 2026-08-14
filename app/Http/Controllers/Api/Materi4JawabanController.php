<?php

namespace App\Http\Controllers\Api;

use App\Models\Materi4Jawaban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class Materi4JawabanController extends Controller
{
    /**
     * Ambil semua jawaban milik user yang sedang login untuk Materi 4.
     * Dipakai supaya progres kuis bisa dipulihkan saat halaman dibuka ulang.
     */
    public function index(Request $request)
    {
        $jawaban = Materi4Jawaban::where('user_id', $request->user()->id)->get();

        return response()->json(['data' => $jawaban]);
    }

    /**
     * Simpan atau perbarui satu jawaban pertanyaan pada Materi 4.
     * item_type + item_id dipakai sebagai kunci unik per user, jadi kalau
     * user mengulang pertanyaan yang sama, baris lama ditimpa (upsert),
     * bukan menumpuk baris baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_type'  => 'required|in:mcq,drag,koneksi,refleksi',
            'item_id'    => 'required|string|max:50',
            'detail'     => 'nullable',
            'is_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid.', 'errors' => $validator->errors()], 422);
        }

        $userId = $request->user()->id;
        $isCorrect = (bool) $request->input('is_correct');

        $jawaban = Materi4Jawaban::updateOrCreate(
            [
                'user_id'   => $userId,
                'item_type' => $request->input('item_type'),
                'item_id'   => $request->input('item_id'),
            ],
            [
                'detail'     => $request->input('detail'),
                'is_correct' => $isCorrect,
                'nilai'      => $isCorrect ? 100 : 0,
            ]
        );

        return response()->json(['data' => $jawaban], 200);
    }
}