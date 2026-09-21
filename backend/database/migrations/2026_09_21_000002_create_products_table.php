<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('General');
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->decimal('price', 10, 2);
            $table->string('commission'); // e.g. "20%" or "₹1,500"
            $table->decimal('commission_value', 10, 2);
            $table->string('commission_type')->default('Percentage'); // 'Percentage' | 'Flat Rate'
            $table->string('status')->default('Active');
            $table->decimal('rating', 3, 1)->default(4.8);
            $table->integer('conversions')->default(0);
            $table->text('description')->nullable();
            $table->text('image')->nullable();
            $table->text('rules')->nullable();
            $table->json('assets')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
