<?php

namespace Database\Seeders;

use App\Models\GlobalSetting;
use Illuminate\Database\Seeder;

class GlobalSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'FLAT_RATE_PER_HOUR',
                'value' => 50000.00,
                'description' => 'Tarif lembur per jam dalam Rupiah',
            ],
            [
                'key' => 'MAX_OVERTIME_HOURS_PER_DAY',
                'value' => 4.00,
                'description' => 'Maksimal jam lembur per hari',
            ],
            [
                'key' => 'MIN_OVERTIME_HOURS',
                'value' => 1.00,
                'description' => 'Minimal jam lembur yang dapat diajukan',
            ],
        ];

        foreach ($settings as $setting) {
            GlobalSetting::create($setting);
        }
    }
}