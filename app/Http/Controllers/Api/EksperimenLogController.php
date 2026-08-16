<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EksperimenLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EksperimenLogController extends Controller
{
    /**
     * Ambil riwayat eksperimen milik user yang sedang login.
     * Dipakai Lab Virtual saat halaman dibuka, supaya jumlah percobaan
     * ("Sudah mencatat X percobaan...") ambil dari database, bukan localStorage.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $logs = EksperimenLog::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => [
                'total' => EksperimenLog::where('user_id', $userId)->count(),
                'list'  => $logs,
            ],
        ]);
    }

    /**
     * Catat satu percobaan baru saat siswa klik "Coba Kondisi Lain".
     * Selalu insert baris baru (bukan upsert) karena ini log, bukan jawaban
     * per soal — siswa boleh mencoba kombinasi yang sama berkali-kali.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kerapatan_mangrove' => 'required|integer|min:0|max:100',
            'tinggi_gelombang'   => 'required|integer|min:0|max:100',
            'perlindungan'       => 'required|string|max:20',
            'skor_abrasi'        => 'required|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid.', 'errors' => $validator->errors()], 422);
        }

        $log = EksperimenLog::create([
            'user_id'            => $request->user()->id,
            'kerapatan_mangrove' => $request->input('kerapatan_mangrove'),
            'tinggi_gelombang'   => $request->input('tinggi_gelombang'),
            'perlindungan'       => $request->input('perlindungan'),
            'skor_abrasi'        => $request->input('skor_abrasi'),
        ]);

        $total = EksperimenLog::where('user_id', $request->user()->id)->count();

        return response()->json(['data' => $log, 'total' => $total], 201);
    }
}