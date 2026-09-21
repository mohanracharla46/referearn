<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (!$user) {
            return response()->json([]);
        }

        $query = Notification::query();

        $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        });

        $notifications = $query->orderBy('created_at', 'desc')->get()->map(function ($n) {
            return [
                'id' => 'notif-' . $n->id,
                'db_id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'type' => $n->type,
                'date' => $n->created_at ? $n->created_at->toISOString() : now()->toISOString(),
                'read' => (bool) $n->is_read,
            ];
        });

        return response()->json($notifications);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);
        $query = Notification::query();

        if ($user) {
            $query->where('user_id', $user->id);
        }

        $query->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read', 'success' => true]);
    }

    public function broadcast(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'audience' => 'nullable|string',
        ]);

        $notification = Notification::create([
            'user_id' => null, // Global broadcast
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => 'system',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Broadcast dispatched successfully',
            'notification' => $notification,
        ], 201);
    }
}
