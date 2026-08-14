<?php

namespace App\Http\Controllers\Api;

use App\Models\Materi5Jawaban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class Materi5JawabanController extends Controller
{
    /**
     * Ambil semua jawaban Materi 5 milik user yang sedang login.
     * Dipakai frontend untuk rehydrate state (temukan perbedaan, tindakan,
     * eksplorasi fungsi, manfaat, prediksi, dan refleksi) saat halaman di-reload.
     */
    public function index(Request $request)
    {
        $jawaban = Materi5Jawaban::where('user_id', $request->user()->id)
            ->get(['item_type', 'item_id', 'detail', 'is_correct', 'nilai']);

        return response()->json([
            'success' => true,
            'data' => $jawaban,
        ]);
    }

    /**
     * Simpan / update jawaban satu item.
     * Upsert berdasarkan unique key (user_id, item_type, item_id) —
     * jadi kalau siswa menjawab ulang item yang sama, baris lama ditimpa.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_type' => 'required|in:mcq,koneksi,predict,refleksi',
            'item_id' => 'required|string|max:50',
            'is_correct' => 'required|boolean',
            'nilai' => 'nullable|integer|min:0|max:100',
            'detail' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->user()->id;

        $jawaban = Materi5Jawaban::updateOrCreate(
            [
                'user_id' => $userId,
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
            ],
            [
                'detail' => $request->detail,
                'is_correct' => $request->is_correct,
                'nilai' => $request->nilai ?? ($request->is_correct ? 100 : 0),
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $jawaban,
        ]);
    }

    /**
     * Ringkasan progres Materi 5: jumlah item benar per tipe.
     */
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        $data = [];
        foreach (['mcq', 'koneksi', 'predict', 'refleksi'] as $type) {
            $data["{$type}_benar"] = Materi5Jawaban::where('user_id', $userId)
                ->where('item_type', $type)
                ->where('is_correct', true)
                ->count();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
