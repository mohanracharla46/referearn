<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->integer('target_conversions')->default(50);
            $table->integer('current_conversions')->default(0);
            $table->decimal('reward_amount', 10, 2)->default(5000.00);
            $table->timestamp('deadline')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('targets');
    }
};
