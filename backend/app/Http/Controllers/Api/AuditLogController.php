<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    public function index(): JsonResponse
    {
        $logs = AuditLog::orderBy('created_at', 'desc')->get()->map(function ($a) {
            return [
                'id' => 'aud-' . $a->id,
                'db_id' => $a->id,
                'admin' => $a->admin,
                'action' => $a->action,
                'details' => $a->details,
                'ip' => $a->ip ?? '127.0.0.1',
                'timestamp' => $a->created_at ? $a->created_at->toISOString() : now()->toISOString(),
            ];
        });

        return response()->json($logs);
    }
}
