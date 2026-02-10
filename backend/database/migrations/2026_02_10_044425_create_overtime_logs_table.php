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
        Schema::create('overtime_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('submission_id');
            $table->uuid('action_by');
            $table->string('action', 50);
            $table->string('old_status', 50)->nullable();
            $table->string('new_status', 50);
            $table->text('note')->nullable();
            $table->timestamp('created_at')->nullable();

            // Indexes
            $table->index('submission_id');
            $table->index('action_by');
            $table->index('created_at');

            // Foreign Keys
            $table->foreign('submission_id')
                  ->references('id')
                  ->on('overtime_submissions')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('action_by')
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
        Schema::dropIfExists('overtime_logs');
    }
};