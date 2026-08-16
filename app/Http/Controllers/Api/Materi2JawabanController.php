<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi2Jawaban;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Materi2JawabanController extends Controller
{
    /**
     * GET /api/materi2/jawaban
     * Ambil semua progres/jawaban materi 2 milik user yang sedang login.
     * Dipakai saat halaman pertama kali dimuat, supaya hotspot & jawaban
     * yang pernah dijawab tidak ter-reset (state dipulihkan dari DB).
     */
    public function index(Request $request): JsonResponse
    {
        $rows = Materi2Jawaban::query()
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'hotspot' => $rows->where('item_type', 'hotspot')
                ->pluck('item_id')
                ->values(),

            'relasi' => $rows->where('item_type', 'relasi')
                ->mapWithKeys(fn ($r) => [
                    $r->item_id => [
                        'selected'   => $r->detail['selected'] ?? null,
                        'is_correct' => $r->is_correct,
                        'nilai'      => $r->nilai,
                    ],
                ]),

            'rantai' => $rows->firstWhere('item_type', 'rantai')?->only([]) !== null
                ? [
                    'urutan'     => $rows->firstWhere('item_type', 'rantai')?->detail['urutan'] ?? null,
                    'is_correct' => $rows->firstWhere('item_type', 'rantai')?->is_correct ?? false,
                    'nilai'      => $rows->firstWhere('item_type', 'rantai')?->nilai ?? 0,
                ]
                : null,

            'prediksi_hilang' => $rows->where('item_type', 'prediksi-hilang')
                ->mapWithKeys(fn ($r) => [
                    $r->item_id => [
                        'jawaban_isian' => $r->detail['jawaban_isian'] ?? null,
                        'kategori'      => $r->detail['kategori'] ?? null,
                        'is_correct'    => $r->is_correct,
                        'nilai'         => $r->nilai,
                    ],
                ]),
        ]);
    }

    /**
     * POST /api/materi2/jawaban
     * Simpan (atau update) satu jawaban materi 2.
     * Dipanggil setiap kali:
     * - hotspot diklik (item_type=hotspot)
     * - jawaban relasi diperiksa (item_type=relasi)
     * - rantai makanan diperiksa (item_type=rantai)
     * - prediksi komponen hilang diperiksa (item_type=prediksi-hilang)
     *
     * Catatan penting: endpoint ini SELALU menyimpan apa pun hasilnya
     * (benar maupun salah). Tidak ada logika "tolak jika salah", karena
     * di frontend tidak ada lagi tombol "coba lagi" yang mengharuskan
     * jawaban benar untuk lanjut.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'item_type'  => ['required', 'in:hotspot,relasi,rantai,prediksi-hilang'],
            'item_id'    => ['required', 'string', 'max:50'],
            'is_correct' => ['sometimes', 'boolean'],
            'nilai'      => ['sometimes', 'integer', 'min:0', 'max:100'],
            'detail'     => ['sometimes', 'nullable', 'array'],
        ]);

        $validator->after(function ($validator) use ($request) {
            $type = $request->input('item_type');

            if ($type === 'relasi' && $request->input('detail.selected') === null) {
                $validator->errors()->add('detail.selected', 'Pilihan jawaban relasi wajib diisi.');
            }

            if ($type === 'rantai' && empty($request->input('detail.urutan'))) {
                $validator->errors()->add('detail.urutan', 'Urutan rantai makanan wajib diisi.');
            }

            if ($type === 'prediksi-hilang') {
                if (empty($request->input('detail.jawaban_isian'))) {
                    $validator->errors()->add('detail.jawaban_isian', 'Jawaban isian prediksi wajib diisi.');
                }
                if (!in_array($request->input('detail.kategori'), ['sesuai', 'sebagian', 'belum'], true)) {
                    $validator->errors()->add('detail.kategori', 'Kategori prediksi tidak valid.');
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid.', 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        $jawaban = Materi2Jawaban::updateOrCreate(
            [
                'user_id'   => $request->user()->id,
                'item_type' => $data['item_type'],
                // rantai hanya 1 baris per user, id-nya disamakan
                'item_id'   => $data['item_type'] === 'rantai' ? 'rantai-makanan' : $data['item_id'],
            ],
            [
                'detail'     => $data['detail'] ?? null,
                'is_correct' => $data['is_correct'] ?? false,
                'nilai'      => $data['nilai'] ?? 0,
            ]
        );

        return response()->json([
            'message' => 'Jawaban tersimpan.',
            'data'    => $jawaban,
        ]);
    }
}