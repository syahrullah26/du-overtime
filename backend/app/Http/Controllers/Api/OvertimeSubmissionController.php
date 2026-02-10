<?php

namespace App\Http\Controllers;

use App\Models\OvertimeSubmission;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OvertimeSubmissionController extends Controller
{
    /**
     * Display a listing of overtime submissions.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = OvertimeSubmission::with(['employee.department', 'logs.actionByUser']);

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by employee (for specific user)
        if ($request->has('employee_id')) {
            $query->byEmployee($request->employee_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Filter by current user if employee role
        if ($request->user()->role === 'EMPLOYEE') {
            $query->byEmployee($request->user()->id);
        }

        // Filter by pending approvals for PIC, C_LEVEL, HRD
        if ($request->has('pending_for_me') && $request->pending_for_me) {
            $statusMap = [
                'PIC' => OvertimeSubmission::STATUS_PENDING_PIC,
                'C_LEVEL' => OvertimeSubmission::STATUS_PENDING_C_LEVEL,
                'HRD' => OvertimeSubmission::STATUS_PENDING_HRD,
            ];

            if (isset($statusMap[$request->user()->role])) {
                $query->byStatus($statusMap[$request->user()->role]);
            }
        }

        $submissions = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($submissions);
    }

    /**
     * Store a newly created overtime submission.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date_format:Y-m-d H:i:s|after:start_time',
        ]);

        $submission = new OvertimeSubmission($validated);
        $submission->employee_id = $request->user()->id;
        $submission->status = OvertimeSubmission::STATUS_PENDING_PIC;
        
        // Calculate duration
        $submission->calculateDuration();
        
        // Set initial rate and pay (will be recalculated on final approval)
        $flatRate = GlobalSetting::getValue('FLAT_RATE_PER_HOUR', 50000);
        $submission->applied_rate = $flatRate;
        $submission->total_pay = round(($submission->duration_min / 60) * $flatRate, 2);
        
        $submission->save();

        // Create initial log
        $submission->createLog(
            $request->user()->id,
            'SUBMIT',
            null,
            'Overtime submission created'
        );

        return response()->json([
            'message' => 'Overtime submission created successfully',
            'data' => $submission->load(['employee', 'logs.actionByUser']),
        ], 201);
    }

    /**
     * Display the specified overtime submission.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        $submission = OvertimeSubmission::with([
            'employee.department',
            'logs.actionByUser'
        ])->findOrFail($id);

        return response()->json([
            'data' => $submission,
        ]);
    }

    /**
     * Update the specified overtime submission.
     * Only allowed if status is still PENDING_PIC.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $submission = OvertimeSubmission::findOrFail($id);

        // Only allow update if still pending PIC and user is the owner
        if ($submission->status !== OvertimeSubmission::STATUS_PENDING_PIC) {
            return response()->json([
                'message' => 'Cannot update submission after approval process has started',
            ], 403);
        }

        if ($submission->employee_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to update this submission',
            ], 403);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:Y-m-d H:i:s',
            'end_time' => 'sometimes|date_format:Y-m-d H:i:s|after:start_time',
        ]);

        $submission->update($validated);
        
        // Recalculate duration if times changed
        if (isset($validated['start_time']) || isset($validated['end_time'])) {
            $submission->calculateDuration();
            $submission->calculateTotalPay();
            $submission->save();
        }

        return response()->json([
            'message' => 'Overtime submission updated successfully',
            'data' => $submission->load(['employee', 'logs.actionByUser']),
        ]);
    }

    /**
     * Approve the overtime submission.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, string $id)
    {
        $submission = OvertimeSubmission::findOrFail($id);
        $user = $request->user();

        // Check if user can approve this submission
        if (!$submission->canBeApprovedBy($user->role)) {
            return response()->json([
                'message' => 'You are not authorized to approve this submission at this stage',
            ], 403);
        }

        $validated = $request->validate([
            'signature' => 'nullable|file|image|max:2048', // Max 2MB
        ]);

        $signaturePath = null;

        // Handle signature upload if provided
        if ($request->hasFile('signature')) {
            $signaturePath = $request->file('signature')->store('signatures', 'public');
        }

        if ($submission->approve($user, $signaturePath)) {
            return response()->json([
                'message' => 'Overtime submission approved successfully',
                'data' => $submission->fresh()->load(['employee', 'logs.actionByUser']),
            ]);
        }

        return response()->json([
            'message' => 'Failed to approve submission',
        ], 400);
    }

    /**
     * Reject the overtime submission.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(Request $request, string $id)
    {
        $submission = OvertimeSubmission::findOrFail($id);
        $user = $request->user();

        // Check if user can reject this submission
        if (!$submission->canBeApprovedBy($user->role)) {
            return response()->json([
                'message' => 'You are not authorized to reject this submission at this stage',
            ], 403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        if ($submission->reject($user, $validated['reason'])) {
            return response()->json([
                'message' => 'Overtime submission rejected',
                'data' => $submission->fresh()->load(['employee', 'logs.actionByUser']),
            ]);
        }

        return response()->json([
            'message' => 'Failed to reject submission',
        ], 400);
    }

    /**
     * Delete the overtime submission.
     * Only allowed if status is PENDING_PIC and user is the owner.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, string $id)
    {
        $submission = OvertimeSubmission::findOrFail($id);

        // Only allow deletion if still pending PIC and user is the owner
        if ($submission->status !== OvertimeSubmission::STATUS_PENDING_PIC) {
            return response()->json([
                'message' => 'Cannot delete submission after approval process has started',
            ], 403);
        }

        if ($submission->employee_id !== $request->user()->id && $request->user()->role !== 'HRD') {
            return response()->json([
                'message' => 'Unauthorized to delete this submission',
            ], 403);
        }

        $submission->delete();

        return response()->json([
            'message' => 'Overtime submission deleted successfully',
        ]);
    }

    /**
     * Get statistics for overtime submissions.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request)
    {
        $query = OvertimeSubmission::query();

        // Filter by employee if not admin
        if ($request->user()->role === 'EMPLOYEE') {
            $query->byEmployee($request->user()->id);
        }

        // Filter by date range if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $stats = [
            'total_submissions' => $query->count(),
            'pending_pic' => (clone $query)->byStatus(OvertimeSubmission::STATUS_PENDING_PIC)->count(),
            'pending_clevel' => (clone $query)->byStatus(OvertimeSubmission::STATUS_PENDING_C_LEVEL)->count(),
            'pending_hrd' => (clone $query)->byStatus(OvertimeSubmission::STATUS_PENDING_HRD)->count(),
            'completed' => (clone $query)->byStatus(OvertimeSubmission::STATUS_COMPLETED)->count(),
            'rejected' => (clone $query)->byStatus(OvertimeSubmission::STATUS_REJECTED)->count(),
            'total_hours' => round((clone $query)->sum('duration_min') / 60, 2),
            'total_pay' => (clone $query)->byStatus(OvertimeSubmission::STATUS_COMPLETED)->sum('total_pay'),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }
}