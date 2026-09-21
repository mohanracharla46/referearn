<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : (string) $value]
            );
        }

        AuditLog::create([
            'admin' => 'Super Admin',
            'action' => 'Updated System Settings',
            'details' => 'Platform global configurations modified',
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => Setting::all()->pluck('value', 'key'),
        ]);
    }
}
