<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KuisHasil;
use Illuminate\Http\Request;

class KuisHasilController extends Controller
{
  /**
   * GET /api/kuis/hasil
   * Kembalikan riwayat kuis user yang sedang login.
   */
  public function index(Request $request)
  {
    $user = $request->user();

    $hasil = KuisHasil::where('user_id', $user->id)
      ->orderByDesc('created_at')
      ->get(['id', 'skor', 'benar', 'total', 'total_pg', 'created_at']);

    $terbaik = $hasil->max('skor');
    $terakhir = $hasil->first()?->skor;

    return response()->json([
      'success' => true,
      'data' => [
        'dikerjakan' => $hasil->count(),
        'nilai_terbaik' => $terbaik,
        'nilai_terakhir' => $terakhir,
        'riwayat' => $hasil,
      ],
    ]);
  }

  /**
   * POST /api/kuis/hasil
   * Simpan hasil kuis baru (mendukung jawaban PG + uraian).
   *
   * Body: {
   *   skor: int,        // 0–100, dihitung dari soal PG saja
   *   benar: int,       // jumlah jawaban PG yang benar
   *   total: int,       // total soal (PG + uraian)
   *   total_pg: int,    // jumlah soal PG (yang dinilai otomatis)
   *   jawaban: array    // [{ soal_id, tipe, jawaban }]
   * }
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'skor' => 'required|integer|min:0|max:100',
      'benar' => 'required|integer|min:0',
      'total' => 'required|integer|min:1',
      'total_pg' => 'nullable|integer|min:0',
      'jawaban' => 'nullable|array',
    ]);

    $hasil = KuisHasil::create([
      'user_id' => $request->user()->id,
      'skor' => $validated['skor'],
      'benar' => $validated['benar'],
      'total' => $validated['total'],
      'total_pg' => $validated['total_pg'] ?? $validated['total'],
      'jawaban' => $validated['jawaban'] ?? null,
    ]);

    return response()->json([
      'success' => true,
      'data' => $hasil,
    ], 201);
  }
}
