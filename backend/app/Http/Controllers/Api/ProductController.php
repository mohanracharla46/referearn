<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = strtolower($request->search);
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$s}%"]);
            });
        }

        if ($request->filled('sortBy')) {
            if ($request->sortBy === 'commission') {
                $query->orderBy('commission_value', 'desc');
            } elseif ($request->sortBy === 'price') {
                $query->orderBy('price', 'desc');
            } elseif ($request->sortBy === 'popularity') {
                $query->orderBy('conversions', 'desc');
            }
        } else {
            $query->orderBy('id', 'asc');
        }

        $products = $query->get()->map(function ($p) {
            return [
                'id' => 'prod-' . $p->id,
                'db_id' => $p->id,
                'name' => $p->name,
                'category' => $p->category,
                'price' => (float) $p->price,
                'commission' => $p->commission,
                'commissionValue' => (float) $p->commission_value,
                'commissionType' => $p->commission_type,
                'status' => $p->status,
                'rating' => (float) $p->rating,
                'conversions' => (int) $p->conversions,
                'description' => $p->description,
                'image' => $p->image,
                'rules' => $p->rules,
                'assets' => $p->assets ?? [],
            ];
        });

        return response()->json($products);
    }

    public function show(string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'prod-') ? (int) substr($id, 5) : (int) $id;
        $p = Product::findOrFail($dbId);

        return response()->json([
            'id' => 'prod-' . $p->id,
            'db_id' => $p->id,
            'name' => $p->name,
            'category' => $p->category,
            'price' => (float) $p->price,
            'commission' => $p->commission,
            'commissionValue' => (float) $p->commission_value,
            'commissionType' => $p->commission_type,
            'status' => $p->status,
            'rating' => (float) $p->rating,
            'conversions' => (int) $p->conversions,
            'description' => $p->description,
            'image' => $p->image,
            'rules' => $p->rules,
            'assets' => $p->assets ?? [],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'commission' => 'required|string',
            'commission_type' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'rules' => 'nullable|string',
            'assets' => 'nullable|array',
        ]);

        $price = (float) $validated['price'];
        $commissionStr = $validated['commission'];
        $commissionValue = 0;

        if (str_contains($commissionStr, '%')) {
            $pct = (float) str_replace(['%', ' '], '', $commissionStr);
            $commissionValue = ($price * $pct) / 100;
        } else {
            $commissionValue = (float) preg_replace('/[^0-9.]/', '', $commissionStr);
        }

        $product = Product::create([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? 'Software',
            'price' => $price,
            'commission' => $commissionStr,
            'commission_value' => $commissionValue,
            'commission_type' => $validated['commission_type'] ?? (str_contains($commissionStr, '%') ? 'Percentage' : 'Flat Rate'),
            'status' => 'Active',
            'rating' => 4.9,
            'conversions' => 0,
            'description' => $validated['description'] ?? 'Registered enterprise product for affiliate promotions.',
            'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
            'rules' => $validated['rules'] ?? 'Cookie length: 60 days. Standard referral payout rules apply.',
            'assets' => $validated['assets'] ?? [
                ['name' => 'Banner Pack', 'size' => '2.5 MB', 'type' => 'ZIP'],
                ['name' => 'One-Pager Brochure', 'size' => '420 KB', 'type' => 'PDF'],
            ],
        ]);

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Created Marketplace Product',
            'details' => "Added product '{$product->name}' (₹{$product->price})",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => [
                'id' => 'prod-' . $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => (float) $product->price,
                'commission' => $product->commission,
                'commissionValue' => (float) $product->commission_value,
                'commissionType' => $product->commission_type,
                'status' => $product->status,
                'rating' => (float) $product->rating,
                'conversions' => 0,
                'description' => $product->description,
                'image' => $product->image,
                'rules' => $product->rules,
                'assets' => $product->assets,
            ],
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'prod-') ? (int) substr($id, 5) : (int) $id;
        $product = Product::findOrFail($dbId);

        $product->update($request->all());

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Updated Product',
            'details' => "Updated product '{$product->name}'",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'prod-') ? (int) substr($id, 5) : (int) $id;
        $product = Product::findOrFail($dbId);
        $name = $product->name;
        $product->delete();

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Deleted Product',
            'details' => "Deleted product '{$name}'",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
