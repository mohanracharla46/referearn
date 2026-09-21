<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Referral extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'product',
        'product_id',
        'clicks',
        'status',
        'total_earned',
    ];

    protected function casts(): array
    {
        return [
            'clicks' => 'integer',
            'total_earned' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function productRelation(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
