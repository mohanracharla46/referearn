<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Target;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TargetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);
        $target = $user ? Target::where('user_id', $user->id)->where('completed', false)->latest()->first() : null;

        if (!$target) {
            $conversions = $user ? (int) $user->conversions_count : 0;
            $goal = 7;
            return response()->json([
                'id' => 'tgt-sprint',
                'title' => '7-Referral Milestone Sprint',
                'targetConversions' => $goal,
                'currentConversions' => $conversions,
                'percentage' => min(100, round(($conversions / $goal) * 100)),
                'rewardAmount' => 30.00,
                'deadline' => '2026-09-30T23:59:59Z',
                'completed' => $conversions >= $goal,
                'remainingConversions' => max(0, $goal - $conversions),
            ]);
        }

        $percentage = $target->target_conversions > 0 
            ? min(100, round(($target->current_conversions / $target->target_conversions) * 100)) 
            : 0;

        return response()->json([
            'id' => 'tgt-' . $target->id,
            'db_id' => $target->id,
            'title' => $target->title,
            'targetConversions' => (int) $target->target_conversions,
            'currentConversions' => (int) $target->current_conversions,
            'percentage' => $percentage,
            'rewardAmount' => (float) $target->reward_amount,
            'deadline' => $target->deadline ? $target->deadline->toISOString() : '2026-09-30T23:59:59Z',
            'completed' => (bool) $target->completed,
            'remainingConversions' => max(0, $target->target_conversions - $target->current_conversions),
        ]);
    }

    public function all(Request $request): JsonResponse
    {
        $targets = Target::orderBy('id', 'desc')->get()->map(function ($target) {
            $percentage = $target->target_conversions > 0 
                ? min(100, round(($target->current_conversions / $target->target_conversions) * 100)) 
                : 0;

            return [
                'id' => 'tgt-' . $target->id,
                'db_id' => $target->id,
                'title' => $target->title,
                'conversions' => (int) $target->target_conversions,
                'targetConversions' => (int) $target->target_conversions,
                'currentConversions' => (int) $target->current_conversions,
                'percentage' => $percentage,
                'reward' => (float) $target->reward_amount,
                'rewardAmount' => (float) $target->reward_amount,
                'deadline' => $target->deadline ? $target->deadline->toISOString() : '2026-09-30T23:59:59Z',
                'status' => $target->completed ? 'Completed' : 'Active Sprint',
                'completed' => (bool) $target->completed,
                'remainingConversions' => max(0, $target->target_conversions - $target->current_conversions),
            ];
        });

        return response()->json($targets);
    }
}
