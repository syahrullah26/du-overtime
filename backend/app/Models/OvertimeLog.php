<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OvertimeLog extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'submission_id',
        'action_by',
        'action',
        'old_status',
        'new_status',
        'note',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Boot the model and set created_at on creation.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_at = now();
        });
    }

    /**
     * Get the submission that this log belongs to.
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(OvertimeSubmission::class, 'submission_id');
    }

    /**
     * Get the user who performed the action.
     */
    public function actionByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'action_by');
    }

    /**
     * Scope to filter by submission.
     */
    public function scopeBySubmission($query, string $submissionId)
    {
        return $query->where('submission_id', $submissionId);
    }

    /**
     * Scope to filter by action type.
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }
}