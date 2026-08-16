<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EksperimenLog extends Model
{
    use HasFactory;

    protected $table = 'eksperimen_log';

    protected $fillable = [
        'user_id',
        'kerapatan_mangrove',
        'tinggi_gelombang',
        'perlindungan',
        'skor_abrasi',
    ];

    protected $casts = [
        'kerapatan_mangrove' => 'integer',
        'tinggi_gelombang'   => 'integer',
        'skor_abrasi'        => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}