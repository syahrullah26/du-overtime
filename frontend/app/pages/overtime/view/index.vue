<script setup lang="ts">
import { ref, computed } from "vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import Stepper from "~/components/ui/Stepper.vue";
import StatsCard from "~/components/ui/StatsCard.vue";
const activeTab = ref("process");

const period = [
  {
    label: "Periode Bulan Ini",
    value: "20 September 2024 - 20 Oktober 2024",
    icon: "🕒",
  },
];
const stats = [
  {
    label: "Overtime Request",
    value: "1 Pending",
    icon: "📄",
  },
  { label: "Overtime Approve", value: "1 Approve", icon: "✅" },
  { label: "Overtime Rejected", value: "1 Reject", icon: "❌" },
];

const submissions = [
  {
    id: 1,
    date: "20 Okt 2024",
    duration: "4 Jam",
    nama: "Galuh Anjani Garnisaputri",
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
    nama: "Galuh Anjani Garnisaputri",
    pic_status: "done",
    clevel_status: "done",
    hrd_status: "done",
    amount: "Rp 100.000",
    status: "done",
  },
  {
    id: 3,
    date: "18 Okt 2024",
    duration: "2 Jam",
    nama: "Muhammad Syahrullah",
    pic_status: "process",
    clevel_status: "pending",
    hrd_status: "rejected",
    amount: "Rp 100.000",
    status: "rejected",
  },
];

const searchQuery = ref("");

const filteredSubmissions = computed(() => {
  return submissions.filter((item) => {
    const matchTab = item.status === activeTab.value;
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchTab && matchSearch;
  });
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
          @click="activeTab = 'process'"
          :class="[
            'pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2',
            activeTab === 'process'
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Overtime Request
          <div
            v-if="activeTab === 'process'"
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--gold-main)] rounded-t-full"
          ></div>
        </button>
        <button
          @click="activeTab = 'done'"
          :class="[
            'pb-4 text-sm font-bold transition-all relative',
            activeTab === 'done'
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Your Overtime History
          <div
            v-if="activeTab === 'done'"
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--gold-main)] rounded-t-full"
          ></div>
        </button>
        <button
          @click="activeTab = 'rejected'"
          :class="[
            'pb-4 text-sm font-bold transition-all relative',
            activeTab === 'rejected'
              ? 'text-[var(--gold-main)]'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Your Overtime Rejected
          <div
            v-if="activeTab === 'rejected'"
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
              {{ item.date }}
            </td>
            <td class="p-6 text-gray-500">{{ item.duration }}</td>
            <td class="p-6 text-gray-500 font-medium">{{ item.nama }}</td>
            <td class="p-6">
              <Stepper
                :pic-status="item.pic_status"
                :clevel-status="item.clevel_status"
                :hrd-status="item.hrd_status"
              />
            </td>
            <td
              class="p-6 text-right text-[var(--gold-dark)] font-black text-lg"
            >
              {{ item.amount }}
            </td>
            <td class="p-6">
              <div class="flex justify-center items-center gap-2">
                <template v-if="activeTab === 'done'">
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      🔍
                    </button></NuxtLink
                  >
                </template>
                <template
                  v-else-if="
                    activeTab === 'rejected' || activeTab === 'process'
                  "
                >
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      🔍
                    </button></NuxtLink
                  >
                  <NuxtLink
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
