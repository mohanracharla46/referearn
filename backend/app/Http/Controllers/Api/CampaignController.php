<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index(): JsonResponse
    {
        $campaigns = Campaign::orderBy('id', 'desc')->get()->map(function ($c) {
            return [
                'id' => 'cmp-' . $c->id,
                'db_id' => $c->id,
                'name' => $c->name,
                'type' => $c->type,
                'budget' => (float) $c->budget,
                'status' => $c->status,
                'conversions' => (int) $c->conversions,
                'startDate' => $c->start_date ? $c->start_date->format('Y-m-d') : null,
                'endDate' => $c->end_date ? $c->end_date->format('Y-m-d') : null,
            ];
        });

        return response()->json($campaigns);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'status' => 'nullable|string',
        ]);

        $campaign = Campaign::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'budget' => (float) $validated['budget'],
            'status' => $validated['status'] ?? 'Active',
            'conversions' => 0,
            'start_date' => now(),
            'end_date' => now()->addDays(30),
        ]);

        AuditLog::create([
            'admin' => 'Marketing Admin',
            'action' => 'Created Incentive Campaign',
            'details' => "Launched campaign '{$campaign->name}' (Budget: ₹{$campaign->budget})",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'id' => 'cmp-' . $campaign->id,
            'name' => $campaign->name,
            'type' => $campaign->type,
            'budget' => (float) $campaign->budget,
            'status' => $campaign->status,
            'conversions' => 0,
        ], 201);
    }
}
