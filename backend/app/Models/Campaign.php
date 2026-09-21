<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'budget',
        'status',
        'conversions',
        'start_date',
        'end_date',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'float',
            'conversions' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}
