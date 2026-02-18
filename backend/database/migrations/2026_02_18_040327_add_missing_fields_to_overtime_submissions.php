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
        Schema::table('overtime_submissions', function (Blueprint $table) {
            $table->text('reason')->after('end_time')->nullable();
            $table->uuid('pic_id')->after('reason')->nullable();
            $table->uuid('clevel_id')->after('pic_id')->nullable();

            $table->foreign('pic_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('clevel_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('overtime_submissions', function (Blueprint $table) {
            $table->dropForeign(['pic_id']);
            $table->dropForeign(['clevel_id']);
            $table->dropColumn(['reason', 'pic_id', 'clevel_id']);
        });
    }
};
