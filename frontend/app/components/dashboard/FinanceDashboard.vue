<script setup lang="ts">
import type { OvertimeSubmission } from "~/types/auth";
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import ProfileCard from "~/components/ui/ProfileCard.vue";

const props = defineProps<{
  user: any;
  submissions: OvertimeSubmission[];
  loading: boolean;
}>();

// Finance biasanya melihat data yang sudah 'COMPLETED' (Siap Bayar) atau 'PENDING_HRD' (Proyeksi)
const activeTab = ref("ready_to_pay");

const filteredData = computed(() => {
  return props.submissions.filter((item: OvertimeSubmission) => {
    if (activeTab.value === "ready_to_pay") {
      // Data yang sudah disetujui semua pihak
      return item.status === "COMPLETED";
    }
    // Riwayat pribadi finance jika dia sendiri lembur
    return item.employee_id === props.user?.id;
  });
});

const stats = computed(() => {
  // Hitung total uang yang harus dibayarkan bulan ini
  const totalPayout = props.submissions
    .filter((s) => s.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr.total_pay || 0), 0);

  const pendingFinanceView = props.submissions.filter((s) =>
    s.status.startsWith("PENDING"),
  ).length;

  return [
    {
      label: "Deadline Periode Ini",
      value: "25 Feb 2026",
      icon: "🕒",
    },
    {
      label: "Total Pengajuan (Pending)",
      value: `${pendingFinanceView} Data`,
      icon: "📄",
    },
    {
      label: "Total Payout Periode Ini",
      value: formatCurrency(totalPayout),
      icon: "💰",
    },
  ];
});

const getStepperStatus = (
  item: OvertimeSubmission,
  level: "PIC" | "CLEVEL" | "HRD",
) => {
  const status = item.status;
  if (status === "COMPLETED") return "done";
  if (status === "REJECTED") return "error";

  if (level === "PIC") return status === "PENDING_PIC" ? "process" : "done";
  if (level === "CLEVEL") {
    if (status === "PENDING_PIC") return "pending";
    return status === "PENDING_C_LEVEL" ? "process" : "done";
  }
  if (level === "HRD") {
    if (status === "PENDING_HRD") return "process";
    return "pending";
  }
  return "pending";
};
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Dewa <span class="text-[var(--gold-main)]">Overtime</span>
        </h1>
        <p class="text-gray-500 font-medium">
          Finance Control Panel - Dewa United Indonesia
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          📊 Report Payroll
        </button>
        <NuxtLink
          to="/overtime"
          class="bg-[var(--gold-main)] text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2"
        >
          <span class="text-xl">+</span> Ajukan Lembur
        </NuxtLink>
      </div>
    </header>

    <div v-if="user" class="mb-10">
      <ProfileCard v-bind="user" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <StatsCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <div
      class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div
        class="p-8 border-b border-gray-50 flex justify-between items-center"
      >
        <h3 class="font-bold text-xl text-gray-800">
          Monitoring Pembayaran Lembur
        </h3>

        <div class="flex bg-gray-100 p-1 rounded-xl">
          <button
            @click="activeTab = 'ready_to_pay'"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all',
              activeTab === 'ready_to_pay'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-500',
            ]"
          >
            Ready to Pay
          </button>
          <button
            @click="activeTab = 'my_overtime'"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all',
              activeTab === 'my_overtime'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-500',
            ]"
          >
            My Overtime
          </button>
        </div>
      </div>

      <OvertimeTable
        :headers="[
          'Tanggal',
          'Nama Karyawan',
          'Durasi',
          'Status Approval',
          'Total Pay',
          'Action',
        ]"
      >
        <template #body-content>
          <tr
            v-for="item in filteredData"
            :key="item.id"
            class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700">
              {{ formatDate(item.date) }}
            </td>
            <td class="p-6">
              <div class="flex flex-col">
                <span class="text-gray-800 font-bold">{{
                  item.employee?.name || "User"
                }}</span>
                <span
                  class="text-[10px] text-gray-400 uppercase tracking-widest"
                  >{{ item.employee?.role }}</span
                >
              </div>
            </td>
            <td class="p-6 text-gray-500 text-sm">
              <span class="font-bold"
                >{{ formatTime(item.start_time) }} -
                {{ formatTime(item.end_time) }}
              </span>
              : {{ Math.floor(item.duration_min / 60) }}j
              {{ item.duration_min % 60 }}m
            </td>
            <td class="p-6">
              <Stepper
                :pic-status="getStepperStatus(item, 'PIC')"
                :clevel-status="getStepperStatus(item, 'CLEVEL')"
                :hrd-status="getStepperStatus(item, 'HRD')"
              />
            </td>
            <td
              class="p-6 text-right text-[var(--gold-main)] font-black text-lg"
            >
              {{ formatCurrency(item.total_pay) }}
            </td>
            <td class="p-6">
              <div class="flex justify-center">
                <button
                  title="Detail Review"
                  class="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  🔍
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="p-12 text-center text-gray-400 italic">
              Tidak ada data yang tersedia untuk kategori ini.
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
