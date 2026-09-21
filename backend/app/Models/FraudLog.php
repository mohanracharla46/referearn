<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FraudLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'affiliate',
        'trigger',
        'ip_address',
        'target_product',
        'risk_score',
        'status',
        'incident_time',
    ];

    protected function casts(): array
    {
        return [
            'risk_score' => 'integer',
            'incident_time' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
