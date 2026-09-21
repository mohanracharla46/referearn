<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')->get();
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? '',
            'icon' => $validated['icon'] ?? 'Folder',
            'status' => 'Active',
        ]);

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Created Category',
            'details' => "Added category '{$category->name}'",
            'ip' => $request->ip(),
        ]);

        return response()->json($category, 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $cat = Category::findOrFail($id);
        $name = $cat->name;
        $cat->delete();

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Deleted Category',
            'details' => "Deleted category '{$name}'",
            'ip' => $request->ip(),
        ]);

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
