<script setup lang="ts">
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import { getfilteredUsers } from "~/utils/helper";

const { fetchAllUsers, allDept, fetchAllDept } = useUser();
const allUser = ref<any[]>([]);
const searchQuery = ref("");
const selectedDept = ref("All");
const loading = ref(false);
const errorMessage = ref("");

onMounted(() => {
  (fetchAllUsers().then((response) => {
    allUser.value = response || [];
  }),
    fetchAllDept());
});

const filteredUser = computed(() => {
  return getfilteredUsers(allUser.value, selectedDept.value, searchQuery.value);
});

const handleDelete = async (id: number) => {
  if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) return;

  try {
    loading.value = true;
    errorMessage.value = "";
    await useApiFetch<any>(`/users/${id}`, {
      method: "DELETE",
    });
    errorMessage.value = "Deleted Successfully!";
    if (allUser.value) {
      allUser.value = allUser.value.filter((u: any) => u.id !== id);
      allUser.value;
    }
  } catch (error: any) {
    console.error("Error deleting user:", error.data || error.message);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-end mb-12">
      <div class="space-y-1">
        <div class="flex items-center gap-2 mb-2">
          <span
            class="px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-tighter"
            >Dewa Overtime</span
          >
          <span
            class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
          ></span>
        </div>
        <h1
          class="text-5xl font-black text-gray-900 tracking-tighter uppercase"
        >
          Data
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-main)] to-[var(--gold-dark)]"
            >Karyawan</span
          >
        </h1>
      </div>
      <div
        class="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
      >
        <div class="text-right">
          <p
            class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
          >
            Total Employee
          </p>
          <p class="text-2xl font-black text-zinc-900 leading-none">
            {{ filteredUser.length }}
          </p>
        </div>
        <div
          class="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-xl"
        >
          👨‍💼
        </div>
      </div>
    </header>
    <Transition name="error-pop">
      <div v-if="errorMessage" class="w-full max-w-2xl mt-6 group">
        <div
          class="relative overflow-hidden bg-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 transition-all duration-500 hover:bg-red-500/10"
        >
          <div
            class="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center animate-pulse"
          >
            <span class="text-red-600 text-lg">⚠️</span>
          </div>

          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between">
              <span
                class="text-[9px] font-black text-red-600 uppercase tracking-[0.3em]"
                >System Alert</span
              >
              <button
                @click="errorMessage = ''"
                class="text-red-400 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-tighter"
              >
                Dismiss
              </button>
            </div>
            <p class="text-xs font-bold text-zinc-900 leading-relaxed mt-0.5">
              {{ errorMessage }}
            </p>
          </div>

          <div
            class="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--gold-dark)] to-transparent opacity-50"
          ></div>
        </div>
      </div>
    </Transition>
    <div
      class="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4"
    >
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
            class="w-full pl-12 pr-5 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:text-black outline-none focus:ring-2 focus:ring-[var(--gold-main)]"
          />
        </div>
      </div>
    </div>
    <div
      class="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white"
    >
      <div v-if="allUser && allUser.length > 0" class="overflow-x-auto">
        <OvertimeTable
          :headers="[
            'Tanggal Join',
            'Nama Karyawan',
            'Department',
            'Email',
            'Actions',
          ]"
        >
          <template #body-content>
            <tr
              v-for="user in filteredUser"
              :key="user.id"
              class="group hover:bg-gray-50/80 transition-all duration-300 border-b border-gray-100 last:border-0"
            >
              <td class="p-5 whitespace-nowrap">
                <div class="flex flex-col">
                  <span
                    class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >Joined</span
                  >
                  <span class="text-sm font-semibold text-gray-700">
                    {{ formatDate(user.created_at || new Date()) }}
                  </span>
                </div>
              </td>

              <td class="p-5 whitespace-nowrap">
                <div class="flex items-center gap-4">
                  <div class="relative flex-shrink-0">
                    <div
                      class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md transition-shadow duration-300"
                    >
                      <img
                        :src="
                          getImageUrl(user.profile_picture) ||
                          `https://ui-avatars.com/api/?name=${user.name}&background=fde68a&color=b45309&bold=true`
                        "
                        class="w-full h-full object-cover"
                        alt="Profile"
                      />
                    </div>
                    <div
                      class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                    ></div>
                  </div>

                  <div class="flex flex-col">
                    <span
                      class="text-sm font-black text-gray-800 group-hover:text-amber-600 transition-colors"
                    >
                      {{ user.name }}
                    </span>
                    <span class="text-[11px] text-gray-400 font-medium"
                      >ID: #USR-00{{ user.id }}</span
                    >
                  </div>
                </div>
              </td>

              <td class="p-5 whitespace-nowrap">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                      :class="
                        user.department
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                      "
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"
                      ></span>
                      {{ user.department?.name || "No Department" }}
                    </span>
                  </div>

                  <div class="flex items-center">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                      :class="
                        user.role
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                      "
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"
                      ></span>
                      {{ user.role || "Employee" }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="p-5 whitespace-nowrap">
                <div
                  class="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <span class="text-xs">✉️</span>
                  <span class="text-sm font-medium">{{ user.email }}</span>
                </div>
              </td>

              <td class="p-5">
                <div class="flex justify-end items-center gap-2.5">
                  <NuxtLink :to="`/admin/user/${user.id}`">
                    <button
                      class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-[var(--gold-dark)]"
                    >
                      🔍
                    </button>
                  </NuxtLink>

                  <NuxtLink
                    :to="`/admin/user/${user.id}/edit`"
                    title="Edit User"
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-amber-500"
                  >
                    <span class="text-sm">📝</span>
                  </NuxtLink>

                  <button
                    @click="handleDelete(user.id)"
                    title="Delete User"
                    class="cursor-pointer hover:bg-[var(--white-bone)] rounded-xl transition-all shadow-lg shadow-gray-600 p-2 hover:scale-110 transition-all hover:shadow-red-500"
                  >
                    <span class="text-sm">🗑️</span>
                  </button>
                  <!-- <NuxtLink
                    :to="`/admin/user/${user.id}`"
                    title="View Details"
                    class="flex items-center justify-center w-10 h-10 bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-gray-100 hover:border-blue-500 shadow-sm hover:shadow-blue-200 rounded-xl transition-all duration-300"
                  >
                    <span class="text-sm">🔍</span>
                  </NuxtLink>

                  <NuxtLink
                    :to="`/admin/user/${user.id}/edit`"
                    title="Edit User"
                    class="flex items-center justify-center w-10 h-10 bg-white text-amber-500 hover:bg-amber-500 hover:text-white border border-gray-100 hover:border-amber-500 shadow-sm hover:shadow-amber-200 rounded-xl transition-all duration-300"
                  >
                    <span class="text-sm">📝</span>
                  </NuxtLink>

                  <button
                    @click="handleDelete(user.id)"
                    title="Delete User"
                    class="flex items-center justify-center w-10 h-10 bg-white text-red-500 hover:bg-red-500 hover:text-white border border-gray-100 hover:border-red-500 shadow-sm hover:shadow-red-200 rounded-xl transition-all duration-300"
                  >
                    <span class="text-sm">🗑️</span>
                  </button> -->
                </div>
              </td>
            </tr>
          </template>
        </OvertimeTable>
      </div>

      <div v-else class="p-20 text-center text-gray-400">
        Data karyawan tidak ditemukan.
      </div>
    </div>
  </div>
</template>
