<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('referrals', 'rejection_reason')) {
            Schema::table('referrals', function (Blueprint $table) {
                $table->string('rejection_reason')->nullable()->after('status');
            });
        }
        if (!Schema::hasColumn('transactions', 'rejection_reason')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->string('rejection_reason')->nullable()->after('status');
            });
        }
        if (!Schema::hasColumn('users', 'rejection_reason')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('rejection_reason')->nullable()->after('status');
            });
        }
    }

    public function down(): void
    {
        Schema::table('referrals', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });
    }
};
