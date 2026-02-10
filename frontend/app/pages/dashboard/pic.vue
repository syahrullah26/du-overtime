<script setup lang="ts">
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import ProfileCard from "~/components/ui/ProfileCard.vue";
const stats = [
  {
    label: "Deadline Periode Bulan Ini",
    value: "23 Hari 23:58:24",
    icon: "🕒",
  },
  { label: "Jumlah Pengajuan", value: "3 Pending", icon: "📄" },
  { label: "Jumlah Request", value: "25", icon: "💰" },
];

const profile = [
  {
    userName: "Galuh Anjani Garnisaputri",
    position: "Head IT",
    // imageUrl:
    //   "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    imageUrl: "/anjani.jpeg",
  },
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
    id: 2,
    date: "18 Okt 2024",
    duration: "2 Jam",
    nama: "Muhammad Syahrullah",
    pic_status: "process",
    clevel_status: "pending",
    hrd_status: "pending",
    amount: "Rp 100.000",
    status: "done",
  },
];
const activeTab = ref("process");
const filteredData = computed(() => {
  return submissions.filter((item) => item.pic_status === activeTab.value);
});

const totalProcess = computed(() => {
  return submissions.filter((item) => item.pic_status === "process").length;
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
      <button
        class="bg-[var(--gold-main)] hover:bg-[] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
      >
        <span class="text-xl">+</span> Ajukan Lembur
      </button>
    </header>

    <ProfileCard v-for="data in profile" :key="data.userName" v-bind="data" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <StatsCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
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
          class="text-[var(--gold-main)] font-bold hover:text-[var(--gold-dark)] text-sm"
        >
          Lihat Semua →
        </NuxtLink>
      </div>
      <div class="flex gap-8 justify-center items-center my-4 mx-4">
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
            class="absolute -top-1 -right-3 min-w-[20px] h-[20px] px-1.5 text-[10px] flex items-center justify-center rounded-full bg-amber-500 text-white shadow-sm border-2 border-white font-black"
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
            <td class="p-6 text-right text-amber-500 font-black text-lg">
              {{ item.amount }}
            </td>
            <td class="p-6">
              <div class="flex justify-center items-center gap-2">
                <template v-if="activeTab === 'process'">
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      🔍
                    </button></NuxtLink
                  >
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><buton class="hover:scale-125 transition-all"
                      >✅</buton
                    ></NuxtLink
                  >
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">❌</button>
                  </NuxtLink>
                </template>
                <template v-else>
                  <NuxtLink
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    ><button class="hover:scale-125 transition-all">
                      🔍
                    </button></NuxtLink
                  >
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
              {{ activeTab === "request" ? "pengajuan" : "riwayat" }} untuk saat
              ini.
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
