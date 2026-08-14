<?php

// database/migrations/2026_08_14_000000_create_materi5_jawaban_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materi5_jawaban', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('item_type'); // mcq | koneksi | predict | refleksi
            $table->string('item_id');
            $table->json('detail')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->unsignedTinyInteger('nilai')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'item_type', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materi5_jawaban');
    }
};
