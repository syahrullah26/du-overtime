<script setup lang="ts">
import { getFilteredDepartment } from "~/utils/helper";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
const { fetchAllDept, fetchAllUsers, allDept } = useUser();
const searchQuery = ref("");
const allUser = ref<any[]>([]);

onMounted(() => {
  (fetchAllUsers().then((response) => {
    allUser.value = response;
  }),
    fetchAllDept());
});

const filteredDept = computed(() => {
  return getFilteredDepartment(allDept.value, searchQuery.value);
});

const getTotalMembers = (deptId: number) => {
  if (!allUser.value) return 0;
  return allUser.value.filter((user) => Number(user.dept_id) === Number(deptId))
    .length;
};
</script>
<template>
  <div class="min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-inter">
    <header
      class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-tighter"
            >Dewa Overtime</span
          >
          <div
            class="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full"
          >
            <span
              class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
            ></span>
            <span class="text-[9px] font-bold text-green-700 uppercase"
              >Live System</span
            >
          </div>
        </div>
        <h1
          class="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase italic"
        >
          Data
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-main)]"
            >Department</span
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
            Total Department
          </p>
          <p class="text-2xl font-black text-zinc-900 leading-none">
            {{ filteredDept.length }}
          </p>
        </div>
        <div
          class="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-xl"
        >
          🏢
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto space-y-6">
      <div
        class="bg-white p-3 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col md:flex-row gap-4"
      >
        <div class="relative flex-1 group">
          <span
            class="absolute inset-y-0 left-5 flex items-center text-gray-300 group-focus-within:text-[var(--gold-main)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2003/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search department by name..."
            class="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-transparent rounded-[1.25rem] text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-[var(--gold-main)]/20 focus:border-[var(--gold-main)]/30 transition-all placeholder:text-gray-300"
          />
        </div>
      </div>

      <div
        class="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100"
      >
        <div v-if="allDept && allDept.length > 0" class="overflow-x-auto">
          <OvertimeTable
            :headers="[
              'ID Reference',
              'Department Name',
              'Total Members',
              'Action',
            ]"
          >
            <template #body-content>
              <tr
                v-for="dept in filteredDept"
                :key="dept.id"
                class="group hover:bg-zinc-50/50 transition-all duration-300 border-b border-gray-50 last:border-0"
              >
                <td class="p-6 whitespace-nowrap">
                  <span
                    class="px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg group-hover:bg-zinc-900 group-hover:text-[var(--gold-main)] transition-all"
                  >
                    #DEPT-{{ String(dept.id).padStart(3, "0") }}
                  </span>
                </td>

                <td class="p-6 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span
                      class="text-sm font-black text-zinc-800 uppercase tracking-tight"
                      >{{ dept.name }}</span
                    >
                    <span
                      class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter"
                      >Corporate Division</span
                    >
                  </div>
                </td>

                <td class="p-6 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-black text-zinc-900">{{
                      getTotalMembers(dept.id)
                    }}</span>
                    <span
                      class="text-[10px] text-gray-400 font-bold uppercase italic"
                      >Members</span
                    >
                  </div>
                </td>

                <td class="p-6 whitespace-nowrap">
                  <NuxtLink
                    :to="`/admin/department/${dept.id}`"
                    class="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-[var(--gold-main)] group-hover:text-white transition-all cursor-pointer shadow-sm shadow-transparent group-hover:shadow-amber-200"
                  >
                    <span
                      class="text-[10px] font-black uppercase tracking-widest"
                      >View Detail</span
                    >
                    <svg
                      xmlns="http://www.w3.org/2003/svg"
                      class="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </NuxtLink>
                </td>
              </tr>
            </template>
          </OvertimeTable>
        </div>

        <div v-else class="p-20 text-center">
          <div class="text-4xl mb-4">📂</div>
          <p class="text-sm font-black text-gray-400 uppercase tracking-widest">
            No Department Records Found
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
