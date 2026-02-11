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

const activeTab = ref("waiting_my_approval");

const filteredData = computed(() => {
  return props.submissions.filter((item: OvertimeSubmission) => {
    if (activeTab.value === "waiting_my_approval") {
      return item.status === "PENDING_C_LEVEL";
    }
  });
});

const totalWaitingCLevel = computed(() => {
  return props.submissions.filter((item) => item.status === "PENDING_C_LEVEL")
    .length;
});

const stats = computed(() => {
  const totalApprovedByMe = props.submissions.filter(
    (s) => s.status === "PENDING_HRD" || s.status === "COMPLETED",
  ).length;

  return [
    {
      label: "Perlu Persetujuan Anda",
      value: `${totalWaitingCLevel.value} Pending`,
      icon: "📄",
    },
    {
      label: "Total Telah Disetujui",
      value: `${totalApprovedByMe} Data`,
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

  if (level === "PIC") {
    return status === "PENDING_PIC" ? "process" : "done";
  }
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
          Executive Dashboard - Dewa United Indonesia
        </p>
      </div>
    </header>

    <div v-if="user" class="mb-10">
      <ProfileCard v-bind="user" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <StatsCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <div
      class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div class="flex gap-8 px-8 pt-6 border-b border-gray-50">
        <button
          @click="activeTab = 'waiting_my_approval'"
          :class="[
            'pb-4 text-sm font-bold relative transition-all',
            activeTab === 'waiting_my_approval'
              ? 'text-amber-500'
              : 'text-gray-400',
          ]"
        >
          Waiting My Approval
          <span
            v-if="totalWaitingCLevel > 0"
            class="ml-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full"
          >
            {{ totalWaitingCLevel }}
          </span>
          <div
            v-if="activeTab === 'waiting_my_approval'"
            class="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"
          ></div>
        </button>
      </div>

      <OvertimeTable
        :headers="[
          'Tanggal',
          'Durasi',
          'Nama Karyawan',
          'Progress',
          'Estimasi Pay',
          'Actions',
        ]"
      >
        <template #body-content>
          <tr
            v-for="item in filteredData"
            :key="item.id"
            class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700">{{ item.date }}</td>
            <td class="p-6 text-gray-500 text-sm">
              {{ Math.floor(item.duration_min / 60) }}j
              {{ item.duration_min % 60 }}m
            </td>
            <td class="p-6">
              <div class="flex flex-col">
                <span class="font-bold text-gray-800">{{
                  item.employee?.name || "User"
                }}</span>
                <span
                  class="text-[10px] text-gray-400 uppercase tracking-tighter"
                  >{{ item.employee?.role }}</span
                >
              </div>
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
              <div class="flex justify-center items-center gap-3">
                <button
                  title="Lihat Detail"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  🔍
                </button>

                <template v-if="item.status === 'PENDING_C_LEVEL'">
                  <button
                    title="Approve"
                    class="p-2 bg-green-50 text-green-600 rounded-xl hover:scale-110 transition-all"
                  >
                    ✅
                  </button>
                  <button
                    title="Reject"
                    class="p-2 bg-red-50 text-red-600 rounded-xl hover:scale-110 transition-all"
                  >
                    ❌
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="p-12 text-center text-gray-400 italic">
              Tidak ada data pengajuan lembur yang perlu ditinjau.
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
