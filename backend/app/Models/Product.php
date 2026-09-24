<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'category_id',
        'price',
        'commission',
        'commission_value',
        'commission_type',
        'status',
        'rating',
        'conversions',
        'description',
        'product_link',
        'image',
        'rules',
        'assets',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'commission_value' => 'float',
            'rating' => 'float',
            'conversions' => 'integer',
            'assets' => 'array',
        ];
    }

    public function categoryRelation(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class);
    }
}
