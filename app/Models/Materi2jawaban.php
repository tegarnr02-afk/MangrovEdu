<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materi2Jawaban extends Model
{
    use HasFactory;

    protected $table = 'materi2_jawaban';

    protected $fillable = [
        'user_id',
        'item_type',
        'item_id',
        'detail',
        'is_correct',
        'nilai',
    ];

    protected $casts = [
        'detail'     => 'array',
        'is_correct' => 'boolean',
        'nilai'      => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope bantuan untuk mengambil jawaban milik satu user berdasarkan tipe.
     */
    public function scopeOfType($query, string $itemType)
    {
        return $query->where('item_type', $itemType);
    }
}