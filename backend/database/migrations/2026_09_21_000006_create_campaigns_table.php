<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // 'Bonus Multiplier', 'Flat Cash Incentive', 'Tier Upgrade'
            $table->decimal('budget', 12, 2)->default(0.00);
            $table->string('status')->default('Active'); // 'Active', 'Scheduled', 'Completed'
            $table->integer('conversions')->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
