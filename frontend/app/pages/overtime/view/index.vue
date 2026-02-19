<script setup lang="ts">
import { ref, computed } from "vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import Stepper from "~/components/ui/Stepper.vue";
import StatsCard from "~/components/ui/StatsCard.vue";
import type { OvertimeSubmission } from "~/types/auth";
const activeTab = ref("PENDING_PIC");

const { userState } = useAuth();
const { submissions, fetchSubmissions, loading } = useOvertime();

const period = [
  {
    label: "Periode Bulan Ini",
    value: "20 September 2024 - 20 Oktober 2024",
    icon: "🕒",
  },
];
const stats = computed(() => {
  const totalGross = submissions.value.reduce(
    (acc, curr) => acc + (curr.total_pay || 0),
    0,
  );
  const pendingCount = submissions.value.filter((s) =>
    s.status.startsWith("PENDING"),
  ).length;

  return [
    {
      label: "Total Pengajuan",
      value: `${submissions.value.length} Data`,
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
const searchQuery = ref("");
const filteredSubmissions = computed(() => {
  if (!submissions.value) return [];

  return submissions.value.filter((item: OvertimeSubmission) => {
    let matchTab = false;
    if (activeTab.value === "APPROVAL_HISTORY") {
      const role = userState.value?.role;
      if (role === "PIC") {
        matchTab =
          item.pic_id === userState.value?.id && item.status !== "PENDING_PIC";
      } else if (role === "C_LEVEL") {
        matchTab =
          item.clevel_id === userState.value?.id &&
          !["PENDING_PIC", "PENDING_C_LEVEL"].includes(item.status);
      } else if (role === "HRD") {
        matchTab = item.status === "COMPLETED";
      } else if (role === "SUPERADMIN") {
        matchTab = item.status === "COMPLETED" || item.status === "REJECTED";
      }
    } else if (activeTab.value === "PENDING_PIC") {
      const role = userState.value?.role;
      if (role === "PIC") matchTab = item.status === "PENDING_PIC";
      else if (role === "C_LEVEL") matchTab = item.status === "PENDING_C_LEVEL";
      else if (role === "HRD") matchTab = item.status === "PENDING_HRD";
      else
        matchTab = ["PENDING_PIC", "PENDING_C_LEVEL", "PENDING_HRD"].includes(
          item.status,
        );
    } else {
      matchTab = item.status === activeTab.value;
    }

    const searchTerm = searchQuery.value.toLowerCase();
    const employeeName = item.employee?.name?.toLowerCase() || "";
    const submissionDate = item.date?.toLowerCase() || "";

    const matchSearch =
      employeeName.includes(searchTerm) || submissionDate.includes(searchTerm);

    return matchTab && matchSearch;
  });
});

// const pedingTabs = computed(() =>
//   ["PENDING_PIC", "PENDING_C_LEVEL", "PENDING_HRD"].includes(activeTab.value),
// );
// const setPendingTabs = () => {
//   activeTab.value = "PENDING_PIC";
// };

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

onMounted(async () => {
  await fetchSubmissions();
});
</script>
<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Dewa <span class="text-[var(--gold-main)]">Overtime</span>
        </h1>
        <p class="text-gray-500 font-medium font-inter">
          Sistem Pengajuan Lembur - Dewa United Indonesia
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-1 gap-8 mb-10">
      <StatsCard v-for="item in period" :key="item.label" v-bind="item" />
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
        <h3 class="font-bold text-xl text-gray-800">View Overtime</h3>
        <BaseSearchInput
          v-model="searchQuery"
          placeholder="Search"
          width-class="md:w-64"
        />
      </div>

      <div class="flex gap-8 justify-center items-center my-4 mx-4">
        <button
          @click="activeTab = 'PENDING_PIC'"
          :class="[
            'pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2',
            ['PENDING_PIC', 'PENDING_C_LEVEL', 'PENDING_HRD'].includes(
              activeTab,
            )
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Overtime Request
          <div
            v-if="
              ['PENDING_PIC', 'PENDING_C_LEVEL', 'PENDING_HRD'].includes(
                activeTab,
              )
            "
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--gold-main)] rounded-t-full"
          ></div>
        </button>
        <button
          @click="activeTab = 'COMPLETED'"
          :class="[
            'pb-4 text-sm font-bold transition-all relative',
            activeTab === 'COMPLETED'
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Your Overtime History
          <div
            v-if="activeTab === 'COMPLETED'"
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--gold-main)] rounded-t-full"
          ></div>
        </button>
        <button
          v-if="userState?.role !== 'EMPLOYEE'"
          @click="activeTab = 'APPROVAL_HISTORY'"
          :class="[
            'pb-4 text-sm font-bold transition-all relative',
            activeTab === 'APPROVAL_HISTORY'
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          History Approval
          <div
            v-if="activeTab === 'APPROVAL_HISTORY'"
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--gold-main)] rounded-t-full"
          ></div>
        </button>
        <button
          @click="activeTab = 'REJECTED'"
          :class="[
            'pb-4 text-sm font-bold transition-all relative',
            activeTab === 'REJECTED'
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Your Overtime Rejected
          <div
            v-if="activeTab === 'REJECTED'"
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--gold-main)] rounded-t-full"
          ></div>
        </button>
      </div>
      <OvertimeTable
        :headers="[
          'Tanggal',
          'Durasi',
          'Nama',
          'Progress',
          'Estimasi',
          'Actions',
        ]"
      >
        <template #body-content>
          <tr
            v-for="item in filteredSubmissions"
            :key="item.id"
            class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700 whitespace-nowrap">
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
            <td class="p-6 text-gray-500 font-medium">
              {{ item.employee?.name }}
            </td>
            <td class="p-6">
              <Stepper
                :pic-status="getStepperStatus(item, 'PIC')"
                :clevel-status="getStepperStatus(item, 'CLEVEL')"
                :hrd-status="getStepperStatus(item, 'HRD')"
              />
            </td>
            <td
              class="p-6 text-right text-[var(--gold-dark)] font-black text-lg"
            >
              {{ formatCurrency(item.total_pay) }}
            </td>
            <td class="p-6">
              <div class="flex justify-center items-center gap-2">
                <template v-if="activeTab === 'done'">
                  <NuxtLink
                    :to="`/overtime/view/${item.id}`"
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      🔍
                    </button></NuxtLink
                  >
                </template>
                <template
                  v-else-if="
                    [
                      'REJECTED',
                      'PENDING_PIC',
                      'PENDING_C_LEVEL',
                      'PENDING_HRD',
                      'APPROVAL_HISTORY',
                      'COMPLETED',
                    ].includes(activeTab)
                  "
                >
                  <NuxtLink
                    :to="`/overtime/view/${item.id}`"
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      🔍
                    </button></NuxtLink
                  >
                  <NuxtLink
                    v-if="
                      item.status === 'PENDING_PIC' &&
                      item.employee_id === userState?.id
                    "
                    :to="`/overtime/edit/${item.id}`"
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      📝
                    </button></NuxtLink
                  >
                </template>
              </div>
            </td>
          </tr>

          <tr v-if="filteredSubmissions.length === 0">
            <td
              colspan="6"
              class="p-12 text-center text-gray-400 text-sm italic"
            >
              Belum ada data {{ activeTab }} untuk saat ini.
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
