<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OvertimeLog;
use Illuminate\Http\Request;

class OvertimeLogController extends Controller
{
    /**
     * Display a listing of overtime logs.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // cuma superadmin yg bisa akses ot
        if ($request->user()->role !== 'SUPERADMIN') {
            return response()->json([
                'message' => 'Unauthorized to access overtime logs',
            ], 403);
        }

        $query = OvertimeLog::with(['submission.employee', 'actionByUser'])
            ->orderBy('created_at', 'desc');

        // Filter by submission_id
        if ($request->has('submission_id')) {
            $query->bySubmission($request->submission_id);
        }

        // Filter by action
        if ($request->has('action')) {
            $query->byAction($request->action);
        }

        $logs = $query->paginate(20);

        return response()->json($logs);
    }
}
