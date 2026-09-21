<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Target extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'target_conversions',
        'current_conversions',
        'reward_amount',
        'deadline',
        'completed',
    ];

    protected function casts(): array
    {
        return [
            'target_conversions' => 'integer',
            'current_conversions' => 'integer',
            'reward_amount' => 'float',
            'deadline' => 'datetime',
            'completed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
