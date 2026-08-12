<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materi3Jawaban extends Model
{
    /**
     * Nama tabel di database adalah `materi3_jawaban` (singular),
     * bukan hasil pluralize otomatis Eloquent (`materi3_jawabans`).
     */
    protected $table = 'materi3_jawaban';

    /**
     * Wajib ada supaya updateOrCreate() di Materi3JawabanController
     * tidak kena MassAssignmentException.
     */
    protected $fillable = [
        'user_id',
        'item_type',
        'item_id',
        'detail',
        'is_correct',
        'nilai',
    ];

    protected $casts = [
        'detail' => 'array',
        'is_correct' => 'boolean',
        'nilai' => 'integer',
    ];
}