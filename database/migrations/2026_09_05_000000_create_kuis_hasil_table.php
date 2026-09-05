<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('kuis_hasil', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();
      $table->unsignedTinyInteger('skor');        // 0–100
      $table->unsignedTinyInteger('benar');       // jumlah jawaban benar
      $table->unsignedTinyInteger('total');       // jumlah soal
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('kuis_hasil');
  }
};
