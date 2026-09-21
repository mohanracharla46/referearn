<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fraud_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('affiliate');
            $table->string('trigger');
            $table->string('ip_address')->nullable();
            $table->string('target_product')->nullable();
            $table->integer('risk_score')->default(50);
            $table->string('status')->default('Under Review'); // 'Under Review', 'Blocked', 'Suspended', 'Resolved'
            $table->timestamp('incident_time')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fraud_logs');
    }
};
