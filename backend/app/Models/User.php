<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'referral_code',
        'upi_id',
        'bank_account',
        'tier',
        'status',
        'rejection_reason',
        'risk_score',
        'total_earnings',
        'available_balance',
        'pending_earnings',
        'locked_balance',
        'referrals_count',
        'conversions_count',
        'needs_onboarding',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'total_earnings' => 'float',
            'available_balance' => 'float',
            'pending_earnings' => 'float',
            'locked_balance' => 'float',
            'referrals_count' => 'integer',
            'conversions_count' => 'integer',
            'needs_onboarding' => 'boolean',
        ];
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function targets(): HasMany
    {
        return $this->hasMany(Target::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
