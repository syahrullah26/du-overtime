<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { OvertimeSubmission } from "~/types/auth";
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import { formatCurrency, formatDate, formatTime } from "~/utils/helper";

const { userState } = useAuth();
const {
  submissions,
  fetchSubmissions,
  loading,
  approveOvertime,
  rejectOvertime,
} = useOvertime();


const activeTab = ref("PENDING_PIC");

const handleApprove = async (id: string) => {
  if (!confirm("Are you sure you want to approve this overtime?")) return;
  try {
    await approveOvertime(id);
    await fetchSubmissions();
    alert("Overtime approved successfully");
  } catch (error) {
    console.error("Failed to approve overtime:", error);
  }
};

const handleReject = async (id: string) => {
  const reason = prompt("Enter rejection reason:");
  if (reason === null) return;
  if (!reason.trim()) {
    alert("Reason is required for rejection");
    return;
  }
  try {
    await rejectOvertime(id, reason);
    await fetchSubmissions();
    alert("Overtime rejected");
  } catch (error) {
    console.error("Failed to reject overtime:", error);
  }
};

const filteredData = computed(() => {
  if (!submissions.value) return [];

  return submissions.value.filter((item: OvertimeSubmission) => {
    const role = userState.value?.role;
    const isOwner = item.employee_id === userState.value?.id;

    if (activeTab.value === "PENDING_PIC") {
      if (isOwner) return false;

      if (role === "PIC") return item.status === "PENDING_PIC";
      if (role === "C_LEVEL") return item.status === "PENDING_C_LEVEL";
      if (role === "HRD") return item.status === "PENDING_HRD";
      return false;
    }
    return false;
  });
});

const totalProcess = computed(() => {
  if (!submissions.value) return 0;
  const role = userState.value?.role;

  return submissions.value.filter((item: OvertimeSubmission) => {
    if (item.employee_id === userState.value?.id) return false;
    if (role === "PIC") return item.status === "PENDING_PIC";
    if (role === "C_LEVEL") return item.status === "PENDING_C_LEVEL";
    if (role === "HRD") return item.status === "PENDING_HRD";
    return false;
  }).length;
});
const pendingCount = computed(() => {
  if (!submissions.value) return 0;

  const role = userState.value?.role;
  const allowedRoles = ["PIC", "C_LEVEL", "HRD"];

  if (role && allowedRoles.includes(role)) {
    return submissions.value.filter((s) => s.status.startsWith("PENDING"))
      .length;
  }
  return 0;
});

const stats = computed(() => {
  // const role = userState.value?.role;
  const pendingCount = computed(() => {
    if (!submissions.value) return 0;

    const role = userState.value?.role;
    const allowedRoles = ["PIC", "C_LEVEL", "HRD"];

    if (role && allowedRoles.includes(role)) {
      return submissions.value.filter((s) => s.status.startsWith("PENDING"))
        .length;
    }
    return 0;
  });

  // submissions.value.filter((s) =>
  //   s.status.startsWith("PENDING"),
  // ).length;
  return [
    {
      label: "Total Data Terkait",
      value: `${pendingCount.value} Data`,
      icon: "🕒",
    },
    {
      label: "Total Pending",
      value: `${totalProcess.value} Status`,
      icon: "📄",
    },
  ];
});

// console.log(
//   "data Pending dan Process :",
//   pendingCount.value,
//   totalProcess.value,
// );

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
    return status === "PENDING_HRD" ? "process" : "pending";
  }
  return "pending";
};

onMounted(async () => {
  await fetchSubmissions();
});
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1
          class="text-3xl font-extrabold tracking-tight text-gray-900 uppercase"
        >
          Dewa <span class="text-[var(--gold-main)]">Overtime</span>
        </h1>
        <p
          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1"
        >
          Panel {{ userState?.role }} - Dewa United Indonesia
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <StatsCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <div
      class="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white"
    >
      <div
        class="flex gap-10 justify-center items-center mt-10 border-b border-gray-50"
      >
        <button
          @click="activeTab = 'PENDING_PIC'"
          :class="[
            'pb-5 px-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-3',
            activeTab === 'PENDING_PIC'
              ? 'text-amber-500'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Overtime Request
          <span
            v-if="totalProcess > 0"
            class="w-5 h-5 text-[9px] flex items-center justify-center rounded-full bg-amber-500 text-white font-black"
          >
            {{ totalProcess }}
          </span>
          <div
            v-if="activeTab === 'PENDING_PIC'"
            class="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"
          ></div>
        </button>
      </div>

      <OvertimeTable
        :headers="[
          'Tanggal',
          'Durasi',
          'Nama Karyawan',
          'Approval Progress',
          'Estimasi Bayar',
          'Actions',
        ]"
      >
        <template #body-content>
          <tr
            v-for="item in filteredData"
            :key="item.id"
            class="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-bold text-gray-800 whitespace-nowrap text-sm">
              {{ formatDate(item.date) }}
            </td>
            <td class="p-6 text-gray-500 text-xs">
              <span class="font-black text-gray-900 block">
                {{ formatTime(item.start_time) }} -
                {{ formatTime(item.end_time) }}
              </span>
              {{ Math.floor(item.duration_min / 60) }}h
              {{ item.duration_min % 60 }}m
            </td>
            <td class="p-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold"
                >
                  {{ item.employee?.name?.charAt(0) }}
                </div>
                <span class="text-sm font-bold text-gray-700">{{
                  item.employee?.name || "Unknown"
                }}</span>
              </div>
            </td>
            <td class="p-6">
              <Stepper
                :pic-status="getStepperStatus(item, 'PIC')"
                :clevel-status="getStepperStatus(item, 'CLEVEL')"
                :hrd-status="getStepperStatus(item, 'HRD')"
              />
            </td>
            <td class="p-6 text-right">
              <span class="text-amber-600 font-black text-base">{{
                formatCurrency(item.total_pay)
              }}</span>
            </td>
            <td class="p-6">
              <div class="flex justify-end items-center gap-2">
                <NuxtLink
                  :to="`/overtime/view/${item.id}`"
                  class="p-2.5 bg-gray-50 text-gray-400 hover:text-black hover:bg-white hover:shadow-md rounded-xl transition-all"
                >
                  🔍
                </NuxtLink>

                <template v-if="activeTab === 'PENDING_PIC'">
                  <button
                    @click="handleApprove(item.id)"
                    class="p-2.5 bg-white shadow-sm border border-gray-100 hover:border-green-500 text-green-500 rounded-xl transition-all hover:shadow-lg hover:shadow-green-100"
                  >
                    ✅
                  </button>
                  <button
                    @click="handleReject(item.id)"
                    class="p-2.5 bg-white shadow-sm border border-gray-100 hover:border-red-500 text-red-500 rounded-xl transition-all hover:shadow-lg hover:shadow-red-100"
                  >
                    ❌
                  </button>
                </template>
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="p-20 text-center">
              <div class="flex flex-col items-center">
                <span class="text-4xl mb-4 opacity-20">📂</span>
                <p
                  class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]"
                >
                  No submissions found in this category
                </p>
              </div>
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
