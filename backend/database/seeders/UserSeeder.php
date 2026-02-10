<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get departments
        $itDept = Department::where('name', 'IT')->first();
        $esportsDept = Department::where('name', 'Esports')->first();
        $hrDept = Department::where('name', 'Human Resources')->first();
        $financeDept = Department::where('name', 'Finance')->first();

        // Create demo users for each role
        $users = [
            [
                'name' => 'HRD Admin',
                'email' => 'hrd@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'HRD',
                'dept_id' => $hrDept?->id,
            ],
            [
                'name' => 'Finance Manager',
                'email' => 'finance@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'FINANCE',
                'dept_id' => $financeDept?->id,
            ],
            [
                'name' => 'C-Level Executive',
                'email' => 'clevel@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'C_LEVEL',
                'dept_id' => null,
            ],
            [
                'name' => 'IT PIC',
                'email' => 'pic.it@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'PIC',
                'dept_id' => $itDept?->id,
            ],
            [
                'name' => 'Esports PIC',
                'email' => 'pic.esports@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'PIC',
                'dept_id' => $esportsDept?->id,
            ],
            [
                'name' => 'John Doe',
                'email' => 'john@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'EMPLOYEE',
                'dept_id' => $itDept?->id,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'EMPLOYEE',
                'dept_id' => $esportsDept?->id,
            ],
            [
                'name' => 'Ahmad Pratama',
                'email' => 'ahmad@dewaunited.com',
                'password' => Hash::make('password123'),
                'role' => 'EMPLOYEE',
                'dept_id' => $itDept?->id,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}