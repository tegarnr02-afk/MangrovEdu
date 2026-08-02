<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MateriProgress;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MateriProgressController extends Controller
{
    /**
     * Daftar slug materi yang sudah diselesaikan user.
     * Response: { "completed": ["ekosistem-mangrove", ...] }
     */
    public function index(Request $request)
    {
        $completed = $request->user()
            ->materiProgress()
            ->whereNotNull('completed_at')
            ->pluck('materi_slug');

        return response()->json(['completed' => $completed]);
    }

    /**
     * Tandai satu materi selesai. Urutan divalidasi di sini,
     * jadi meskipun frontend dilewati (misal ketik URL langsung),
     * materi yang urutannya belum sampai tetap ditolak.
     */
    public function complete(Request $request, string $slug)
    {
        $urutanList = config('materi.urutan'); // [1 => 'ekosistem-mangrove', ...]
        $slugToUrutan = array_flip($urutanList);

        if (! isset($slugToUrutan[$slug])) {
            abort(404, 'Materi tidak ditemukan.');
        }

        $urutan = $slugToUrutan[$slug];
        $user = $request->user();

        if ($urutan > 1) {
            $prevSlug = $urutanList[$urutan - 1];
            $prevSelesai = $user->materiProgress()
                ->where('materi_slug', $prevSlug)
                ->whereNotNull('completed_at')
                ->exists();

            if (! $prevSelesai) {
                throw ValidationException::withMessages([
                    'materi' => ["Selesaikan materi sebelumnya terlebih dahulu."],
                ]);
            }
        }

        $progress = MateriProgress::updateOrCreate(
            ['user_id' => $user->id, 'materi_slug' => $slug],
            ['urutan' => $urutan, 'completed_at' => now()]
        );

        return response()->json([
            'message' => 'Materi ditandai selesai.',
            'progress' => $progress,
        ]);
    }
}