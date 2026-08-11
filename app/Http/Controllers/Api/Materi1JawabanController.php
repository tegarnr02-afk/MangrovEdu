<?php

namespace App\Http\Controllers\Api;

use App\Models\Materi1Jawaban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;


class Materi1JawabanController extends Controller
{
  /**
   * Ambil semua jawaban Materi 1 milik user yang sedang login.
   * Dipakai frontend untuk rehydrate state hotspot/spesies saat reload halaman.
   */
  public function index(Request $request)
  {
    $jawaban = Materi1Jawaban::where('user_id', $request->user()->id)
      ->get(['item_type', 'item_id', 'is_correct', 'nilai']);

    return response()->json([
      'success' => true,
      'data' => $jawaban,
    ]);
  }

  /**
   * Simpan / update jawaban satu item (hotspot atau spesies).
   * Upsert berdasarkan unique key (user_id, item_type, item_id).
   */
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'item_type' => 'required|in:hotspot,spesies',
      'item_id' => 'required|string|max:50',
      'is_correct' => 'required|boolean',
      'nilai' => 'nullable|integer|min:0|max:100',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    $userId = $request->user()->id;

    $jawaban = Materi1Jawaban::updateOrCreate(
      [
        'user_id' => $userId,
        'item_type' => $request->item_type,
        'item_id' => $request->item_id,
      ],
      [
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
   * Ringkasan progres Materi 1: jumlah item benar per tipe.
   * Berguna untuk validasi "semua hotspot benar" / "semua spesies selesai" di backend,
   * bukan cuma di client state React.
   */
  public function summary(Request $request)
  {
    $userId = $request->user()->id;

    $hotspotBenar = Materi1Jawaban::where('user_id', $userId)
      ->where('item_type', 'hotspot')
      ->where('is_correct', true)
      ->count();

    $spesiesBenar = Materi1Jawaban::where('user_id', $userId)
      ->where('item_type', 'spesies')
      ->where('is_correct', true)
      ->count();

    return response()->json([
      'success' => true,
      'data' => [
        'hotspot_benar' => $hotspotBenar,
        'spesies_benar' => $spesiesBenar,
      ],
    ]);
  }
}