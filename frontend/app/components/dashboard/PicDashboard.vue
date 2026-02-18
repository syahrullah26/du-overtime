<script setup lang="ts">
import type { OvertimeSubmission } from "~/types/auth";
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import ProfileCard from "~/components/ui/ProfileCard.vue";
import { formatCurrency } from "~/utils/helper";

const props = defineProps<{
  user: any;
  submissions: OvertimeSubmission[];
  loading: boolean;
}>();

const activeTab = ref("process");

// filter active tab
const filteredData = computed(() => {
  return props.submissions.filter((item: OvertimeSubmission) => {
    if (activeTab.value === "process") {
      return (
        item.status === "PENDING_PIC" && item.employee_id !== props.user?.id
      );
    } else {
      return item.employee_id === props.user?.id;
    }
  });
});

const totalProcess = computed(() => {
  return props.submissions.filter(
    (item: OvertimeSubmission) =>
      item.status === "PENDING_PIC" && item.employee_id !== props.user?.id,
  ).length;
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
      label: "Total Data Terkait",
      value: `${props.submissions.length} Data`,
      icon: "🕒",
    },
    { label: "Total Pending", value: `${pendingCount} Status`, icon: "📄" },
    {
      label: "Total Lembur (Gross)",
      value: formatCurrency(totalGross),
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
          Panel PIC - Dewa United Indonesia
        </p>
      </div>
      <NuxtLink
        to="/overtime"
        class="bg-[var(--gold-main)] hover:bg-[#b38f4d] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2"
      >
        <span class="text-xl">+</span> Ajukan Lembur
      </NuxtLink>
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
        class="flex gap-8 justify-center items-center mt-8 border-b border-gray-50"
      >
        <button
          @click="activeTab = 'process'"
          :class="[
            'pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2',
            activeTab === 'process'
              ? 'text-amber-500'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Overtime Request
          <span
            v-if="totalProcess > 0"
            class="min-w-[20px] h-[20px] px-1.5 text-[10px] flex items-center justify-center rounded-full bg-amber-500 text-white shadow-sm border-2 border-white font-black"
          >
            {{ totalProcess }}
          </span>
          <div
            v-if="activeTab === 'process'"
            class="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"
          ></div>
        </button>

        <button
          @click="activeTab = 'done'"
          :class="[
            'pb-4 text-sm font-bold transition-all relative',
            activeTab === 'done'
              ? 'text-amber-500'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Your Overtime
          <div
            v-if="activeTab === 'done'"
            class="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full"
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
            v-for="item in filteredData"
            :key="item.id"
            class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700 whitespace-nowrap">
              {{ formatDate(item.date) }}
            </td>
            <td class="p-6 text-gray-500 text-sm">
              <span class="font-bold"
                >{{ formatTime(item.start_time) }} -
                {{ formatTime(item.end_time) }}
              </span>
              : {{ Math.floor(item.duration_min / 60) }}j
              {{ item.duration_min % 60 }}m
            </td>
            <td class="p-6 text-gray-500 font-medium">
              {{ item.employee?.name || "Unknown" }}
            </td>
            <td class="p-6">
              <Stepper
                :pic-status="getStepperStatus(item, 'PIC')"
                :clevel-status="getStepperStatus(item, 'CLEVEL')"
                :hrd-status="getStepperStatus(item, 'HRD')"
              />
            </td>
            <td class="p-6 text-right text-amber-500 font-black text-lg">
              {{ formatCurrency(item.total_pay) }}
            </td>
            <td class="p-6">
              <div class="flex justify-center items-center gap-3">
                <NuxtLink
                  class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                  ><button class="hover:scale-125 transition-all">
                    🔍
                  </button></NuxtLink
                >
                <template v-if="activeTab === 'process'">
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)] hover:bg-green-50"
                  >
                    <button title="Approve" class="bg-green-50 rounded-lg">
                      ✅
                    </button></NuxtLink
                  >
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)] hover:bg-red-50"
                  >
                    <button title="Reject" class="bg-red-50 rounded-lg">
                      ❌
                    </button>
                  </NuxtLink>
                </template>
              </div>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td
              colspan="6"
              class="p-12 text-center text-gray-400 text-sm italic"
            >
              Belum ada data
              {{
                activeTab === "process" ? "pengajuan masuk" : "lembur pribadi"
              }}
              untuk saat ini.
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
