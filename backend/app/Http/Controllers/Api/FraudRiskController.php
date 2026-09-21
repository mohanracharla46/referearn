<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FraudLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FraudRiskController extends Controller
{
    public function index(): JsonResponse
    {
        $logs = FraudLog::orderBy('incident_time', 'desc')->get()->map(function ($f) {
            return [
                'id' => 'frd-' . $f->id,
                'db_id' => $f->id,
                'affiliate' => $f->affiliate,
                'trigger' => $f->trigger,
                'ipAddress' => $f->ip_address,
                'targetProduct' => $f->target_product,
                'riskScore' => (int) $f->risk_score,
                'status' => $f->status,
                'timestamp' => $f->incident_time ? $f->incident_time->toISOString() : $f->created_at->toISOString(),
            ];
        });

        return response()->json($logs);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Under Review,Blocked,Suspended,Resolved',
        ]);

        $log = FraudLog::findOrFail($id);
        $log->status = $validated['status'];
        $log->save();

        AuditLog::create([
            'admin' => 'Security Admin',
            'action' => 'Updated Fraud Incident Status',
            'details' => "Incident #{$log->id} marked as {$log->status}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Fraud incident status updated',
            'fraudLog' => $log,
        ]);
    }
}
