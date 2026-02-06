<script setup lang="ts">
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
const stats = [
  { label: "Total Jam Bulan Ini", value: "32 Jam 15 Menit", icon: "🕒" },
  { label: "Status Pengajuan", value: "2 Pending", icon: "📄" },
  { label: "Total Lembur (Gross)", value: "Rp 1.612.500", icon: "💰" },
];

const submissions = [
  {
    id: 1,
    date: "20 Okt 2024",
    duration: "4 Jam",
    pic_status: "done",
    clevel_status: "process",
    hrd_status: "pending",
    amount: "Rp 200.000",
    status: "process",
  },
  {
    id: 2,
    date: "18 Okt 2024",
    duration: "2 Jam",
    pic_status: "done",
    clevel_status: "done",
    hrd_status: "done",
    amount: "Rp 100.000",
    status: "done",
  },
];
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Dewa <span class="text-[#C5A059]">Overtime</span>
        </h1>
        <p class="text-gray-500 font-medium font-inter">
          Sistem Pengajuan Lembur - Dewa United Indonesia
        </p>
      </div>
      <button
        class="bg-[#C5A059] hover:bg-[#AF8D4A] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
      >
        <span class="text-xl">+</span> Ajukan Lembur
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <StatsCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>
    <div
      class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div
        class="p-8 border-b border-gray-50 flex justify-between items-center"
      >
        <h3 class="font-bold text-xl text-gray-800">Riwayat Pengajuan</h3>

        <button class="text-[#C5A059] font-bold hover:text-[#AF8D4A] text-sm">
          Lihat Semua →
        </button>
      </div>

      <OvertimeTable
        title="Riwayat Pengajuan"
        :headers="['Tanggal', 'Durasi', 'Progress', 'Estimasi']"
      >
        <template #header-action>
          <button class="text-[#C5A059] font-bold hover:text-[#AF8D4A] text-sm">
            Lihat Semua →
          </button>
        </template>

        <template #body-content>
          <tr
            v-for="item in submissions"
            :key="item.id"
            class="hover:bg-[#FFFDF9] transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700">{{ item.date }}</td>
            <td class="p-6 text-gray-500">{{ item.duration }}</td>
            <td class="p-6">
              <Stepper
                :pic-status="item.pic_status"
                :clevel-status="item.clevel_status"
                :hrd-status="item.hrd_status"
              />
            </td>
            <td class="p-6 text-right text-[#C5A059] font-black text-lg">
              {{ item.amount }}
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
