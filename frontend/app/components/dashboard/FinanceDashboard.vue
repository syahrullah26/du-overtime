<script setup lang="ts">
import { ref, computed } from "vue";
import type { OvertimeSubmission } from "~/types/auth";
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import ProfileCard from "~/components/ui/ProfileCard.vue";
import { formatCurrency, formatDate, formatTime } from "~/utils/helper";

const props = defineProps<{
  user: any;
  submissions: OvertimeSubmission[];
  loading: boolean;
}>();

const activeTab = ref("ready_to_pay");
const searchQuery = ref("");
const selectedDept = ref("All");

const { fetchAllDept, allDept } = useUser();

const loadDept = async () => {
  try {
    await fetchAllDept();
  } catch (error: any) {
    console.error(
      "Error Fetching All Users Data:",
      error.data || error.message,
    );
  }
};

onMounted(() => {
  loadDept();
});

// Logic Filter Data
const filteredData = computed(() => {
  if (!props.submissions) return [];

  return props.submissions.filter((item: OvertimeSubmission) => {
    const matchesSearch = item.employee?.name
      ?.toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesDept =
      selectedDept.value === "All" ||
      item.employee?.department?.name === selectedDept.value;

    if (activeTab.value === "ready_to_pay") {
      return item.status === "COMPLETED" && matchesSearch && matchesDept;
    }
    return item.employee_id === props.user?.id && matchesSearch;
  });
});

// Stats khusus Finance
const stats = computed(() => {
  const completedPayout = props.submissions
    .filter((s) => s.status === "COMPLETED")
    .reduce((acc, curr) => acc + (Number(curr.total_pay) || 0), 0);

  const pendingHrd = props.submissions
    .filter((s) => s.status === "PENDING_HRD")
    .reduce((acc, curr) => acc + (Number(curr.total_pay) || 0), 0);

  return [
    {
      label: "Siap Bayar (Completed)",
      value: formatCurrency(completedPayout),
      icon: "💰",
    },
    {
      label: "Proyeksi Keluar (Pending HRD)",
      value: formatCurrency(pendingHrd),
      icon: "⏳",
    },
    {
      label: "Total Tagihan Bulan Ini",
      value: formatCurrency(completedPayout + pendingHrd),
      icon: "📊",
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
  <div class="min-h-screen bg-[var(--white-bone)] p-4 md:p-8">
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
    >
      <div>
        <h1 class="text-3xl font-black tracking-tight text-gray-900 uppercase">
          Dewa <span class="text-[var(--gold-main)]">Finance</span>
        </h1>
        <p
          class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1"
        >
          Payroll & Disbursement Control
        </p>
      </div>
      <div class="flex flex-wrap gap-3 w-full md:w-auto">
        <BaseButton label="📥 Export Excel" variant="primary" />
        <NuxtLink
          to="/overtime"
          class="flex-1 md:flex-none bg-black text-white font-bold py-3 px-6 rounded-md shadow-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
        >
          <span class="text-xl">+</span> Add Request
        </NuxtLink>
      </div>
    </header>

    <div v-if="user" class="mb-10">
      <ProfileCard v-bind="user" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatsCard
        v-for="stat in stats"
        :key="stat.label"
        v-bind="stat"
        class="!rounded-3xl border-none shadow-sm"
      />
    </div>

    <div
      class="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden"
    >
      <div class="p-8 border-b border-gray-50">
        <div
          class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
        >
          <div class="flex bg-gray-100 p-1.5 rounded-2xl w-full lg:w-auto">
            <button
              @click="activeTab = 'ready_to_pay'"
              :class="[
                'flex-1 lg:flex-none px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all',
                activeTab === 'ready_to_pay'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-400',
              ]"
            >
              Ready to Pay
            </button>
            <button
              @click="activeTab = 'my_overtime'"
              :class="[
                'flex-1 lg:flex-none px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all',
                activeTab === 'my_overtime'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-400',
              ]"
            >
              My Overtime
            </button>
          </div>

          <div class="flex flex-col md:flex-row gap-3 w-full lg:w-2/3">
            <div class="relative flex-1">
              <span
                class="absolute inset-y-0 left-4 flex items-center text-gray-400"
                >🔍</span
              >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari karyawan..."
                class="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:text-black outline-none text-sm font-medium"
              />
            </div>
            <select
              v-model="selectedDept"
              class="px-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-500 outline-none cursor-pointer"
            >
              <option value="All">All Department</option>
              <option v-for="dept in allDept" :key="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <OvertimeTable
        :headers="[
          'Tanggal',
          'Karyawan',
          'Durasi',
          'Approval',
          'Total Pay',
          'Action',
        ]"
      >
        <template #body-content>
          <tr
            v-for="item in filteredData"
            :key="item.id"
            class="group hover:bg-gray-50/50 transition-all"
          >
            <td class="p-6">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-800">{{
                  formatDate(item.date)
                }}</span>
                <span class="text-[10px] text-gray-400 font-medium"
                  >REF#OT-{{ item.id }}</span
                >
              </div>
            </td>
            <td class="p-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs border border-amber-100"
                >
                  <img
                    :src="
                      getImageUrl(item.employee?.profile_picture) ||
                      `https://ui-avatars.com/api/?name=${item.employee?.name}&background=111&color=fff&size=200`
                    "
                    class="rounded-full"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-black text-gray-700">{{
                    item.employee?.name
                  }}</span>
                  <span
                    class="text-[10px] font-bold text-amber-500 uppercase tracking-tighter"
                    >{{ item.employee?.department?.name }}</span
                  >
                </div>
              </div>
            </td>
            <td class="p-6">
              <div class="text-xs text-gray-500 font-medium">
                <span class="text-gray-900 font-bold block"
                  >{{ formatTime(item.start_time) }} -
                  {{ formatTime(item.end_time) }}</span
                >
                {{ Math.floor(item.duration_min / 60) }}h
                {{ item.duration_min % 60 }}m
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
              <div class="flex flex-col items-end">
                <span class="text-lg font-black text-gray-900 italic">{{
                  formatCurrency(item.total_pay)
                }}</span>
                <span
                  v-if="item.status === 'COMPLETED'"
                  class="flex items-center gap-1 text-[9px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase"
                >
                  Ready to Pay
                </span>
              </div>
            </td>
            <td class="p-6">
              <div class="flex justify-end gap-2">
                <NuxtLink :to="`/overtime/view/${item.id}`">
                  <button
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                  >
                    🔍
                  </button>
                </NuxtLink>
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="p-24 text-center">
              <div class="flex flex-col items-center opacity-20">
                <span class="text-6xl mb-4">📂</span>
                <p class="text-xs font-black uppercase tracking-[0.3em]">
                  No Payment Data Found
                </p>
              </div>
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
