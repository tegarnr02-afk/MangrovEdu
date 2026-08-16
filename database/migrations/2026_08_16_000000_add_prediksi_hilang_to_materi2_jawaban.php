<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Kolom item_type pada materi2_jawaban memakai tipe ENUM, sehingga item
     * baru "prediksi-hilang" (Bagian 3.5) ditolak MySQL sebelum sempat tersimpan.
     * Tambahkan nilai tersebut ke daftar ENUM.
     */
    public function up(): void
    {
        DB::statement(
            "ALTER TABLE materi2_jawaban MODIFY COLUMN item_type ENUM('hotspot','relasi','rantai','prediksi-hilang') COLLATE utf8mb4_unicode_ci NOT NULL"
        );
    }

    public function down(): void
    {
        // Catatan: rollback bisa gagal bila sudah ada baris ber-item_type
        // 'prediksi-hilang'. Hapus baris tersebut dulu bila perlu.
        DB::statement(
            "ALTER TABLE materi2_jawaban MODIFY COLUMN item_type ENUM('hotspot','relasi','rantai') COLLATE utf8mb4_unicode_ci NOT NULL"
        );
    }
};
