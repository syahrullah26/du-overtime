<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OvertimeSubmission extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'date',
        'start_time',
        'end_time',
        'duration_min',
        'status',
        'reason',
        'pic_id',
        'clevel_id',
        'signature_pic',
        'signature_clevel',
        'signature_hrd',
        'applied_rate',
        'total_pay',
        'rejection_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'applied_rate' => 'decimal:2',
        'total_pay' => 'decimal:2',
        'duration_min' => 'integer',
    ];

    /**
     * Status constants.
     */
    const STATUS_PENDING_PIC = 'PENDING_PIC';
    const STATUS_PENDING_C_LEVEL = 'PENDING_C_LEVEL';
    const STATUS_PENDING_HRD = 'PENDING_HRD';
    const STATUS_COMPLETED = 'COMPLETED';
    const STATUS_REJECTED = 'REJECTED';

    /**
     * Get the employee who submitted the overtime.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    /**
     * Get all logs for this submission.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(OvertimeLog::class, 'submission_id');
    }

    /**
     * Get the PIC for this submission.
     */
    public function pic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pic_id');
    }

    /**
     * Get the C-Level for this submission.
     */
    public function clevel(): BelongsTo
    {
        return $this->belongsTo(User::class, 'clevel_id');
    }

    /**
     * Calculate and set total pay based on duration and flat rate.
     */
    public function calculateTotalPay(): void
    {
        $flatRate = GlobalSetting::getValue('FLAT_RATE_PER_HOUR', 50000);
        $this->applied_rate = $flatRate;
        $this->total_pay = round(($this->duration_min / 60) * $flatRate, 2);
    }

    /**
     * Calculate duration in minutes from start and end time.
     */
    public function calculateDuration(): void
    {
        if (!$this->start_time || !$this->end_time) {
            return;
        }

        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        
        // Ensure duration is non-negative and absolute
        $this->duration_min = $end->diffInMinutes($start, true);
    }

    /**
     * Create a log entry for this submission.
     */
    public function createLog(string $actionBy, string $action, ?string $oldStatus = null, ?string $note = null): void
    {
        OvertimeLog::create([
            'submission_id' => $this->id,
            'action_by' => $actionBy,
            'action' => $action,
            'old_status' => $oldStatus,
            'new_status' => $this->status,
            'note' => $note,
        ]);
    }

    /**
     * Check if submission can be approved by given role.
     */
    public function canBeApprovedBy(string $role): bool
    {
        $allowedTransitions = [
            self::STATUS_PENDING_PIC => 'PIC',
            self::STATUS_PENDING_C_LEVEL => 'C_LEVEL',
            self::STATUS_PENDING_HRD => 'HRD',
        ];

        return isset($allowedTransitions[$this->status]) && $allowedTransitions[$this->status] === $role;
    }

    /**
     * Approve the submission and move to next status.
     */
    public function approve(User $approver, ?string $signaturePath = null): bool
    {
        if (!$this->canBeApprovedBy($approver->role)) {
            return false;
        }

        $oldStatus = $this->status;

        switch ($this->status) {
            case self::STATUS_PENDING_PIC:
                $this->status = self::STATUS_PENDING_C_LEVEL;
                $this->signature_pic = $signaturePath;
                break;

            case self::STATUS_PENDING_C_LEVEL:
                $this->status = self::STATUS_PENDING_HRD;
                $this->signature_clevel = $signaturePath;
                break;

            case self::STATUS_PENDING_HRD:
                $this->status = self::STATUS_COMPLETED;
                $this->signature_hrd = $signaturePath;
                $this->calculateTotalPay();
                break;

            default:
                return false;
        }

        $this->save();
        $this->createLog($approver->id, 'APPROVE_' . $approver->role, $oldStatus);

        return true;
    }

    /**
     * Reject the submission.
     */
    public function reject(User $rejector, string $reason): bool
    {
        $oldStatus = $this->status;
        $this->status = self::STATUS_REJECTED;
        $this->rejection_reason = $reason;
        $this->save();

        $this->createLog($rejector->id, 'REJECT', $oldStatus, $reason);

        return true;
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by employee.
     */
    public function scopeByEmployee($query, string $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}