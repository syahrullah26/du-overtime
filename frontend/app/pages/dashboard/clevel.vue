<script setup lang="ts">
import StatsCard from "~/components/ui/StatsCard.vue";
import Stepper from "~/components/ui/Stepper.vue";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import ProfileCard from "~/components/ui/ProfileCard.vue";

const loading = ref(false);
const { userState, logout } = useAuth();

const stats = [
  { label: "Jumlah Pengajuan", value: "3 Pending", icon: "📄" },
  { label: "Total Approve", value: "25", icon: "💰" },
];

const profile = [
  {
    userName: "Galuh Anjani Garnisaputri",
    position: "CTO",
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

    <div v-if="userState" class="dashboard">
      <ProfileCard v-bind="userState" />
    </div>

    <div v-else>
      <p>Sedang memuat profil...</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
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

      <OvertimeTable
        title="Riwayat Pengajuan"
        :headers="[
          'Tanggal',
          'Durasi',
          'Nama',
          'Progress',
          'Estimasi',
          'Actions',
        ]"
      >
        <template #header-action>
          <button
            class="text-[var(--gold-main)] font-bold hover:text-[var(--gold-dark)] text-sm"
          >
            Lihat Semua →
          </button>
        </template>

        <template #body-content>
          <tr
            v-for="item in submissions"
            :key="item.id"
            class="hover:bg-[var(--white-bone)] transition-colors border-b border-gray-50 last:border-0"
          >
            <td class="p-6 font-medium text-gray-700">{{ item.date }}</td>
            <td class="p-6 text-gray-500">{{ item.duration }}</td>
            <td class="p-6 text-gray-500">{{ item.nama }}</td>
            <td class="p-6">
              <Stepper
                :pic-status="item.pic_status"
                :clevel-status="item.clevel_status"
                :hrd-status="item.hrd_status"
              />
            </td>
            <td
              class="p-6 text-right text-[var(--gold-main)] font-black text-lg"
            >
              {{ item.amount }}
            </td>
            <td class="p-6">
              <div class="flex justify-center items-cente gap-2">
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
                <!-- <BaseButton label="" variant="outline" type="submit" />
                <BaseButton label="✅" variant="primary" type="submit" />
                <BaseButton label="" variant="secondary" type="submit" /> -->
              </div>
            </td>
          </tr>
        </template>
      </OvertimeTable>
    </div>
  </div>
</template>
