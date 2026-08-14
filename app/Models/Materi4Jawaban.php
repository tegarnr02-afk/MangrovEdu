<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi4Jawaban extends Model
{
    use HasFactory;

    protected $table = 'materi4_jawaban';

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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}