<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::table('kuis_hasil', function (Blueprint $table) {
      // Jumlah soal PG yang memiliki kunci jawaban resmi
      $table->unsignedTinyInteger('total_pg')->default(9)->after('total');
      // Jawaban lengkap (PG index + teks uraian) dalam format JSON
      $table->json('jawaban')->nullable()->after('total_pg');
    });
  }

  public function down(): void
  {
    Schema::table('kuis_hasil', function (Blueprint $table) {
      $table->dropColumn(['total_pg', 'jawaban']);
    });
  }
};
