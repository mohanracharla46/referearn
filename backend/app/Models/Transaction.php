<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product',
        'product_id',
        'buyer',
        'amount',
        'commission',
        'status',
        'type',
        'transaction_date',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'commission' => 'float',
            'transaction_date' => 'datetime',
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
