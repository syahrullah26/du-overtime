<script setup lang="ts">
import type { OvertimeSubmission } from "~/types/auth";
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import ProfileCard from "~/components/ui/ProfileCard.vue";
import { formatCurrency } from "~/utils/helper";
// get data dari index.vue
const props = defineProps<{
  user: any;
  submissions: OvertimeSubmission[];
  loading: boolean;
}>();

const filteredData = computed(() => {
  return props.submissions.filter((item: OvertimeSubmission) => {
    return item.status != "COMPLETED" && item.status != "REJECTED";
  });
});

const stats = computed(() => {
  const totalGross = props.submissions.reduce(
    (acc, curr) => acc + (curr.total_pay || 0),
    0,
  );
  const pendingCount = props.submissions.filter((s) =>
    s.status.startsWith("PENDING"),
  ).length;

  return [
    {
      label: "Total Pengajuan",
      value: `${props.submissions.length} Data`,
      icon: "🕒",
    },
    { label: "Status Pengajuan", value: `${pendingCount} Pending`, icon: "📄" },
    {
      label: "Total Lembur (Gross)",
      value: formatCurrency(totalGross),
      icon: "💰",
    },
  ];
});
</script>

<template>
  <div class="space-y-8">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Dewa <span class="text-[var(--gold-main)]">Overtime</span>
        </h1>
        <p class="text-gray-500 font-medium">
          Sistem Pengajuan Lembur - Dewa United Indonesia
        </p>
      </div>
      <NuxtLink
        to="/overtime"
        class="bg-[var(--gold-main)] hover:bg-[#b38f4d] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2"
      >
        <span class="text-xl">+</span> Ajukan Lembur
      </NuxtLink>
    </header>

    <div v-if="user" class="dashboard">
      <ProfileCard v-bind="user" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- <StatsCacrd v-for="stat in stats" :key="stat.label" v-bind="stat" /> -->
    </div>

    <div
      class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div
        class="p-8 border-b border-gray-50 flex justify-between items-center"
      >
        <h3 class="font-bold text-xl text-gray-800">Riwayat Pengajuan</h3>
        <NuxtLink
          to="/overtime/view"
          class="text-[var(--gold-main)] font-bold text-sm"
        >
          Lihat Semua →
        </NuxtLink>
      </div>

      <OvertimeTable
        :headers="['Tanggal', 'Durasi', 'Progress', 'Estimasi', 'Action']"
      >
        <template #body-content>
          <tr v-if="filteredData.length === 0">
            <td colspan="5" class="p-10 text-center text-gray-400">
              Belum ada data pengajuan lembur.
            </td>
          </tr>
          <tr
            v-for="item in filteredData"
            :key="item.id"
            class="hover:bg-[var(--white-bone)] transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700">
              {{ formatDate(item.date) }}
            </td>
            <td class="p-6 text-gray-500">
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
            <td class="p-6 items-center">
              <NuxtLink
                :to="`/overtime/view/${item.id}`"
                class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
              >
                <button class="hover:scale-125 transition-all">🔍</button>
              </NuxtLink>
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
