<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getPayrollPeriod, formatCurrency, formatDate } from "~/utils/helper";

const { submissions, fetchSubmissions, loading } = useOvertime();
const { allDept, fetchAllDept } = useUser();

const selectedPeriod = ref("");
const searchQuery = ref("");
const selectedDept = ref("All");

onMounted(async () => {
  await Promise.all([fetchSubmissions(), fetchAllDept()]);

  const now = new Date();
  selectedPeriod.value = getPayrollPeriod(now.toISOString());
});

const availablePeriods = computed(() => {
  if (!submissions.value) return [];
  const periods = submissions.value.map((s) => getPayrollPeriod(s.created_at));
  return [...new Set(periods)].sort().reverse();
});

const filteredHistory = computed(() => {
  if (!submissions.value) return [];

  return submissions.value.filter((item) => {
    const itemPeriod = getPayrollPeriod(item.created_at);
    const matchesPeriod = itemPeriod === selectedPeriod.value;
    const matchesStatus = item.status === "COMPLETED";

    const searchTerm = searchQuery.value.toLowerCase();
    const matchesSearch = item.employee?.name
      ?.toLowerCase()
      .includes(searchTerm);

    const matchesDept =
      selectedDept.value === "All" ||
      item.employee?.department?.name === selectedDept.value;

    return matchesPeriod && matchesStatus && matchesSearch && matchesDept;
  });
});

const totalRekap = computed(() => {
  return filteredHistory.value.reduce(
    (acc, curr) => acc + (Number(curr.total_pay) || 0),
    0,
  );
});
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
    <header
      class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
    >
      <div>
        <h1
          class="text-4xl font-black text-gray-900 uppercase tracking-tighter"
        >
          Rekap <span class="text-[var(--gold-main)]">History</span>
        </h1>
        <p
          class="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Payroll Cycle: Cut-off 20th Every Month
        </p>
      </div>

      <div
        class="bg-black text-white p-6 rounded-[2rem] shadow-xl min-w-[280px] relative overflow-hidden group"
      >
        <div class="relative z-10">
          <p
            class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1"
          >
            Total Payout Periode Ini
          </p>
          <p class="text-3xl font-black italic">
            {{ formatCurrency(totalRekap) }}
          </p>
        </div>
        <span
          class="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-110 transition-transform"
          >💰</span
        >
      </div>
    </header>

    <div
      class="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4"
    >
      <div class="flex-1">
        <label
          class="text-[10px] font-black text-gray-400 uppercase ml-4 mb-1 block"
          >Periode</label
        >
        <select
          v-model="selectedPeriod"
          class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[var(--gold-main)]"
        >
          <option v-for="p in availablePeriods" :key="p" :value="p">
            {{ p }}
          </option>
        </select>
      </div>

      <div class="flex-1">
        <label
          class="text-[10px] font-black text-gray-400 uppercase ml-4 mb-1 block"
          >Departemen</label
        >
        <select
          v-model="selectedDept"
          class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[var(--gold-main)]"
        >
          <option value="All">Semua Departemen</option>
          <option v-for="d in allDept" :key="d.id" :value="d.name">
            {{ d.name }}
          </option>
        </select>
      </div>

      <div class="flex-[1.5]">
        <label
          class="text-[10px] font-black text-gray-400 uppercase ml-4 mb-1 block"
          >Cari Karyawan</label
        >
        <div class="relative">
          <span
            class="absolute inset-y-0 left-5 flex items-center text-gray-400"
            >🔍</span
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ketik nama karyawan..."
            class="w-full pl-12 pr-5 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--gold-main)]"
          />
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50">
            <th
              class="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest"
            >
              Tgl Pengajuan
            </th>
            <th
              class="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest"
            >
              Karyawan
            </th>
            <th
              class="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest"
            >
              Detail Lembur
            </th>
            <th
              class="p-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest"
            >
              Nominal
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
            <td colspan="4" class="p-24 text-center">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--gold-main)] border-t-transparent"
              ></div>
              <p
                class="mt-4 text-xs font-black text-gray-400 animate-pulse uppercase"
              >
                Syncing Data...
              </p>
            </td>
          </tr>

          <tr
            v-else
            v-for="item in filteredHistory"
            :key="item.id"
            class="hover:bg-gray-50/50 transition-all group"
          >
            <td class="p-6">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-700">{{
                  formatDate(item.created_at)
                }}</span>
                <span class="text-[9px] text-gray-400 font-mono"
                  >ID: #REK-{{ item.id }}</span
                >
              </div>
            </td>
            <td class="p-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs border border-amber-100"
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
                  <span class="text-sm font-black text-gray-800">{{
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
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span
                    class="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold"
                    >{{ formatDate(item.date) }}</span
                  >
                </div>
                <span class="text-xs text-gray-500 font-medium">
                  ⏱️ {{ Math.floor(item.duration_min / 60) }}j
                  {{ item.duration_min % 60 }}m
                </span>
              </div>
            </td>
            <td class="p-6 text-right">
              <span
                class="text-lg font-black text-gray-900 italic group-hover:text-[var(--gold-dark)] transition-colors"
              >
                {{ formatCurrency(item.total_pay) }}
              </span>
            </td>
          </tr>

          <tr v-if="!loading && filteredHistory.length === 0">
            <td colspan="4" class="p-32 text-center">
              <div class="flex flex-col items-center opacity-20">
                <span class="text-7xl mb-4">📑</span>
                <h3 class="text-sm font-black uppercase tracking-[0.3em]">
                  No Records Found
                </h3>
                <p class="text-[10px] mt-2 font-bold">
                  Cobalah ubah filter atau kata kunci pencarian Anda
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
