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

const activeTab = ref("waiting_hrd");

const filteredData = computed(() => {
  return props.submissions.filter((item: OvertimeSubmission) => {
    if (activeTab.value === "waiting_hrd") {
      return item.status === "PENDING_HRD";
    } else if (activeTab.value === "all") {
      return true;
    }
    return item.employee_id === props.user?.id;
  });
});

const totalWaitingHrd = computed(() => {
  return props.submissions.filter((item) => item.status === "PENDING_HRD")
    .length;
});

const stats = computed(() => {
  const totalPayout = props.submissions
    .filter((s) => s.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr.total_pay || 0), 0);

  return [
    {
      label: "Menunggu Approval HRD",
      value: `${totalWaitingHrd.value} Data`,
      icon: "⏳",
    },
    {
      label: "Total Pengajuan (All)",
      value: `${props.submissions.length}`,
      icon: "📊",
    },
    {
      label: "Total Payout (Completed)",
      value: formatCurrency(totalPayout),
      icon: "🏦",
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
    // if (status === "DONE") return "done";
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
          HRD Management Panel - Dewa United Indonesia
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          📥 Export CSV
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
      <div class="flex gap-8 px-8 pt-6 border-b border-gray-50">
        <button
          @click="activeTab = 'waiting_hrd'"
          :class="[
            'pb-4 text-sm font-bold relative',
            activeTab === 'waiting_hrd' ? 'text-amber-500' : 'text-gray-400',
          ]"
        >
          Waiting My Approval
          <span
            v-if="totalWaitingHrd > 0"
            class="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full"
            >{{ totalWaitingHrd }}</span
          >
          <div
            v-if="activeTab === 'waiting_hrd'"
            class="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"
          ></div>
        </button>
        <button
          @click="activeTab = 'all'"
          :class="[
            'pb-4 text-sm font-bold relative',
            activeTab === 'all' ? 'text-amber-500' : 'text-gray-400',
          ]"
        >
          All Submissions
          <div
            v-if="activeTab === 'all'"
            class="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"
          ></div>
        </button>
      </div>

      <OvertimeTable
        :headers="[
          'Tanggal',
          'Nama',
          'Durasi',
          'Progress',
          'Total Pay',
          'Actions',
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
                <span class="font-bold text-gray-800">{{
                  item.employee?.name
                }}</span>
                <span class="text-xs text-gray-400">{{
                  item.employee?.role
                }}</span>
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
            <td class="p-6 text-right text-[var(--gold-main)] font-black">
              {{ formatCurrency(item.total_pay) }}
            </td>
            <td class="p-6">
              <div class="flex justify-center gap-2">
                <NuxtLink
                  :to="`/overtime/view/${item.id}`"
                  class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                >
                  <button class="hover:scale-125 transition-all">🔍</button>
                </NuxtLink>
                <template v-if="item.status === 'PENDING_HRD'">
                  <button
                    title="Approve"
                    class="p-2 bg-green-50 text-green-600 rounded-lg hover:scale-110 transition-all"
                  >
                    ✅
                  </button>
                  <button
                    title="Reject"
                    class="p-2 bg-red-50 text-red-600 rounded-lg hover:scale-110 transition-all"
                  >
                    ❌
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="p-12 text-center text-gray-400 italic">
              Tidak ada data untuk kategori ini.
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
