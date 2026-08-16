<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi1Jawaban;
use App\Models\Materi2Jawaban;
use App\Models\Materi3Jawaban;
use App\Models\Materi4Jawaban;
use App\Models\Materi5Jawaban;
use App\Models\MateriProgress;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     *
     * Menggabungkan data yang SUDAH tersedia di database untuk halaman dasbor,
     * seluruhnya difilter berdasarkan user yang sedang login (tidak ada user_id
     * yang di-hardcode, sehingga user hanya melihat datanya sendiri).
     *
     * Sumber data (tabel yang sudah dipakai aplikasi):
     *  - user_materi_progress : materi mana saja yang sudah selesai (materi_slug, completed_at)
     *  - materi1_jawaban .. materi5_jawaban : aktivitas/jawaban per materi (item_type, item_id, nilai)
     *  - users : nama/email user
     *
     * Catatan: eksperimen lab virtual & hasil kuis (Berpikir Kausal) BELUM disimpan
     * ke database, jadi bagian tersebut dikembalikan sebagai "tersedia: false" dan
     * frontend menampilkan empty-state "Belum ada data" — bukan angka palsu.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $urutan = config('materi.urutan', []);

        // Materi yang sudah ditandai selesai oleh user ini.
        $selesaiSlugs = MateriProgress::query()
            ->where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->pluck('materi_slug')
            ->all();

        // Model jawaban per urutan materi (tabel per-materi).
        $models = [
            1 => Materi1Jawaban::class,
            2 => Materi2Jawaban::class,
            3 => Materi3Jawaban::class,
            4 => Materi4Jawaban::class,
            5 => Materi5Jawaban::class,
        ];

        $items = [];
        foreach ($urutan as $urutanKe => $slug) {
            $isSelesai = in_array($slug, $selesaiSlugs, true);

            $stats = isset($models[$urutanKe])
                ? $this->aktivitas($models[$urutanKe], $user->id)
                : ['aktivitas' => 0, 'nilai_rata' => null];

            if ($isSelesai) {
                $status = 'selesai';
            } elseif ($stats['aktivitas'] > 0) {
                $status = 'berjalan';
            } else {
                $status = 'belum';
            }

            $items[] = [
                'slug'       => $slug,
                'urutan'     => $urutanKe,
                'judul'      => $this->judul($slug),
                'status'     => $status,
                'aktivitas'  => $stats['aktivitas'],
                'nilai_rata' => $stats['nilai_rata'],
            ];
        }

        $totalMateri   = count($urutan);
        $selesaiCount  = count(array_intersect($urutan, $selesaiSlugs));
        $progresTotal  = $totalMateri > 0
            ? (int) round(($selesaiCount / $totalMateri) * 100)
            : 0;

        return response()->json([
            'success' => true,
            'data'    => [
                'user' => [
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
                'materi' => [
                    'total'   => $totalMateri,
                    'selesai' => $selesaiCount,
                    'items'   => $items,
                ],
                'progres_keseluruhan' => $progresTotal,

                // Data yang belum tersedia di database (jangan dibuat angkanya).
                'eksperimen' => [
                    'tersedia' => false,
                    'total'    => 0,
                    'list'     => [],
                ],
                'kuis' => [
                    'tersedia'       => false,
                    'dikerjakan'     => 0,
                    'nilai_terakhir' => null,
                    'nilai_terbaik'  => null,
                ],
            ],
        ]);
    }

    /**
     * Hitung jumlah aktivitas tersimpan dan rata-rata nilai untuk satu tabel
     * jawaban materi milik user tertentu.
     *
     * @return array{aktivitas:int, nilai_rata:?int}
     */
    protected function aktivitas(string $modelClass, int $userId): array
    {
        $rows = $modelClass::query()
            ->where('user_id', $userId)
            ->get(['nilai']);

        $aktivitas = $rows->count();

        if ($aktivitas === 0) {
            return ['aktivitas' => 0, 'nilai_rata' => null];
        }

        $nilai = $rows->pluck('nilai')->filter(fn ($v) => is_numeric($v));
        $nilaiRata = $nilai->isNotEmpty() ? (int) round($nilai->avg()) : null;

        return ['aktivitas' => $aktivitas, 'nilai_rata' => $nilaiRata];
    }

    /**
     * Ubah slug menjadi judul yang enak dibaca, mis.
     * "interaksi-ekosistem" -> "Interaksi Ekosistem".
     */
    protected function judul(string $slug): string
    {
        return ucwords(str_replace('-', ' ', $slug));
    }
}
