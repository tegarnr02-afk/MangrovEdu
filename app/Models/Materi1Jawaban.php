<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materi1Jawaban extends Model
{
    /**
     * Nama tabel di database adalah `materi1_jawaban` (singular),
     * bukan hasil pluralize otomatis Eloquent (`materi1_jawabans`).
     * Tanpa ini, query akan gagal dengan error
     * "Base table or view not found" -> 500.
     */
    protected $table = 'materi1_jawaban';

    /**
     * Wajib ada supaya updateOrCreate() di Materi1JawabanController
     * tidak kena MassAssignmentException.
     */
    protected $fillable = [
        'user_id',
        'item_type',
        'item_id',
        'is_correct',
        'nilai',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'nilai' => 'integer',
    ];
}