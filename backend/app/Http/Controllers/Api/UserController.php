<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = User::with('department');

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by department
        if ($request->has('dept_id')) {
            $query->where('dept_id', $request->dept_id);
        }

        // Search name ato email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15);

        return response()->json($users);
    }

    /**
     * Display the specified user.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        $user = User::with(['department', 'overtimeSubmissions'])->findOrFail($id);

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Update user tertentu.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // bolehin user update profilenya sendiri, ditambah hrd
        if ($request->user()->id !== $id && $request->user()->role !== 'HRD') {
            return response()->json([
                'message' => 'Unauthorized to update this user',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'dept_id' => 'nullable|uuid|exists:departments,id',
        ]);

        // cm hrd yg bs apdet role
        if ($request->has('role') && $request->user()->role === 'HRD') {
            $request->validate([
                'role' => 'in:EMPLOYEE,PIC,C_LEVEL,HRD,FINANCE',
            ]);
            $validated['role'] = $request->role;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user->fresh()->load('department'),
        ]);
    }

    /**
     * apdet user pw.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // user cm bs ganti pw dia sndiri
        if ($request->user()->id !== $id) {
            return response()->json([
                'message' => 'Unauthorized to update password',
            ], 403);
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        // verify pw
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Remove the specified user.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, string $id)
    {
        // cm hr yg bs dlt user
        if ($request->user()->role !== 'HRD') {
            return response()->json([
                'message' => 'Unauthorized to delete users',
            ], 403);
        }

        $user = User::findOrFail($id);

        if ($request->user()->id === $id) {
            return response()->json([
                'message' => 'Cannot delete your own account',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}