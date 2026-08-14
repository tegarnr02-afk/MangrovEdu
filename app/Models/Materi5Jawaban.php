<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materi5Jawaban extends Model
{
    /**
     * Nama tabel di database adalah `materi5_jawaban` (singular),
     * bukan hasil pluralize otomatis Eloquent (`materi5_jawabans`).
     */
    protected $table = 'materi5_jawaban';

    /**
     * Wajib ada supaya updateOrCreate() di Materi5JawabanController
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
