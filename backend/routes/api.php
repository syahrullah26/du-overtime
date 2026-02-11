<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\GlobalSettingController;
use App\Http\Controllers\Api\OvertimeSubmissionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// Health Check 
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Public 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected 
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Department
    Route::apiResource('departments', DepartmentController::class);

    // User
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::put('/users/{id}/password', [UserController::class, 'updatePassword']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Global Settings
    Route::get('/settings', [GlobalSettingController::class, 'index']);
    Route::get('/settings/all', [GlobalSettingController::class, 'getAllSettings']);
    Route::get('/settings/{key}', [GlobalSettingController::class, 'show']);
    Route::post('/settings', [GlobalSettingController::class, 'store']);
    Route::put('/settings/{key}', [GlobalSettingController::class, 'update']);
    Route::delete('/settings/{key}', [GlobalSettingController::class, 'destroy']);

    // Overtime Submission
    Route::get('/overtime-submissions', [OvertimeSubmissionController::class, 'index']);
    Route::post('/overtime-submissions', [OvertimeSubmissionController::class, 'store']);
    Route::get('/overtime-submissions/statistics', [OvertimeSubmissionController::class, 'statistics']);
    Route::get('/overtime-submissions/{id}', [OvertimeSubmissionController::class, 'show']);
    Route::put('/overtime-submissions/{id}', [OvertimeSubmissionController::class, 'update']);
    Route::delete('/overtime-submissions/{id}', [OvertimeSubmissionController::class, 'destroy']);

    // Approval actions
    Route::post('/overtime-submissions/{id}/approve', [OvertimeSubmissionController::class, 'approve']);
    Route::post('/overtime-submissions/{id}/reject', [OvertimeSubmissionController::class, 'reject']);
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()->toIso8601String(),
    ]);
});
