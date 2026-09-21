<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('method'); // 'UPI Instant Payout', 'HDFC Bank IMPS', 'NEFT Payout'
            $table->string('destination');
            $table->string('status')->default('Pending Approval'); // 'Pending Approval', 'Completed', 'Rejected'
            $table->string('reference')->unique();
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('withdrawals');
    }
};
