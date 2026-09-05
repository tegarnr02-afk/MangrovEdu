<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KuisHasil extends Model
{
  protected $table = 'kuis_hasil';

  protected $fillable = [
    'user_id',
    'skor',
    'benar',
    'total',
    'total_pg',
    'jawaban',
  ];

  protected $casts = [
    'skor' => 'integer',
    'benar' => 'integer',
    'total' => 'integer',
    'total_pg' => 'integer',
    'jawaban' => 'array',
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
