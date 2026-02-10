<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('overtime_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('employee_id');
            $table->date('date');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->unsignedInteger('duration_min');
            $table->enum('status', [
                'PENDING_PIC',
                'PENDING_C_LEVEL',
                'PENDING_HRD',
                'COMPLETED',
                'REJECTED'
            ])->default('PENDING_PIC');
            $table->string('signature_pic')->nullable();
            $table->string('signature_clevel')->nullable();
            $table->string('signature_hrd')->nullable();
            $table->decimal('applied_rate', 15, 2);
            $table->decimal('total_pay', 15, 2);
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('employee_id');
            $table->index('status');
            $table->index('date');
            $table->index('created_at');

            // Foreign Key
            $table->foreign('employee_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtime_submissions');
    }
};