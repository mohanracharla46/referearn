<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('product')->nullable();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('buyer');
            $table->decimal('amount', 10, 2);
            $table->decimal('commission', 10, 2);
            $table->string('status')->default('Approved'); // 'Approved' | 'Pending' | 'Reversed'
            $table->string('type')->default('Sale'); // 'Sale' | 'Refund' | 'Bonus'
            $table->timestamp('transaction_date')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
