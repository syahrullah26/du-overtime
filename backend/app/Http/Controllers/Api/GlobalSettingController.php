<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;

class GlobalSettingController extends Controller
{
    /**
     * list globl sttingny
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $settings = GlobalSetting::all();

        return response()->json([
            'data' => $settings,
        ]);
    }

    /**
     * buat setting baru
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // cm hr dan finance yg bisa buat baru
        if (!in_array($request->user()->role, ['HRD', 'FINANCE'])) {
            return response()->json([
                'message' => 'Unauthorized to create settings',
            ], 403);
        }

        $validated = $request->validate([
            'key' => 'required|string|max:100|unique:global_settings,key',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $setting = GlobalSetting::create($validated);

        return response()->json([
            'message' => 'Setting created successfully',
            'data' => $setting,
        ], 201);
    }

    /**
     * liat setting
     *
     * @param string $key
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $key)
    {
        $setting = GlobalSetting::where('key', $key)->firstOrFail();

        return response()->json([
            'data' => $setting,
        ]);
    }

    /**
     * updt setting.
     *
     * @param Request $request
     * @param string $key
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $key)
    {
        // cm hr and finance yg bs updt
        if (!in_array($request->user()->role, ['HRD', 'FINANCE'])) {
            return response()->json([
                'message' => 'Unauthorized to update settings',
            ], 403);
        }

        $setting = GlobalSetting::where('key', $key)->firstOrFail();

        $validated = $request->validate([
            'value' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $setting->update($validated);

        return response()->json([
            'message' => 'Setting updated successfully',
            'data' => $setting,
        ]);
    }

    /**
     * hapus settingan tertentu
     *
     * @param Request $request
     * @param string $key
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, string $key)
    {
        // cm hr dan finance yg bs
        if (!in_array($request->user()->role, ['HRD', 'FINANCE'])) {
            return response()->json([
                'message' => 'Unauthorized to delete settings',
            ], 403);
        }

        $setting = GlobalSetting::where('key', $key)->firstOrFail();
        $setting->delete();

        return response()->json([
            'message' => 'Setting deleted successfully',
        ]);
    }

    /**
     * get semua settingny
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllSettings()
    {
        $settings = GlobalSetting::getAllSettings();

        return response()->json([
            'data' => $settings,
        ]);
    }
}