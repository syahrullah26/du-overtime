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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('name');
            $table->string('password');
            $table->enum('role', ['EMPLOYEE', 'PIC', 'C_LEVEL', 'HRD', 'FINANCE']);
            $table->uuid('dept_id')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // Indexes
            $table->index('dept_id');
            $table->index('role');

            // Foreign Key
            $table->foreign('dept_id')
                  ->references('id')
                  ->on('departments')
                  ->onDelete('set null')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};