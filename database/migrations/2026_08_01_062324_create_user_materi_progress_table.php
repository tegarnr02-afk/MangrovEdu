<?php

// database/migrations/xxxx_xx_xx_create_user_materi_progress_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_materi_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('materi_slug');
            $table->unsignedTinyInteger('urutan');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'materi_slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_materi_progress');
    }
};
