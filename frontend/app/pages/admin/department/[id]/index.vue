<!-- <script setup lang="ts">
const route = useRoute();
const deptId = computed(() => route.params.id as string);

const allUser = ref<any[]>([]);

const { fetchAllUsers } = useUser();

onMounted(() => {
  fetchAllUsers().then((response) => {
    allUser.value = response;
  });
});

const filterMember = computed(() => {
  if (!allUser.value) return [];
  return allUser.value.filter(
    (user) => Number(user.dept_id) === Number(deptId.value),
  );
});
</script>

<template></template> -->

<script setup lang="ts">
import { roleOptions } from "@/constants/user";
import OvertimeTable from "~/components/ui/OvertimeTable.vue";
import { useDepartment } from "~/composables/useDepartment";

const route = useRoute();
const deptId = computed(() => route.params.id as string);

const allUser = ref<any[]>([]);
const departmentDetail = ref<any>(null);
const isLoading = ref(true);

const { fetchAllUsers } = useUser();
const { getDepartmentById, detailDept } = useDepartment();

onMounted(async () => {
  isLoading.value = true;
  try {
    const [usersResponse] = await Promise.all([
      fetchAllUsers(),
      getDepartmentById(deptId.value),
    ]);
    allUser.value = usersResponse;
    departmentDetail.value = detailDept.value;
  } catch (error) {
    console.error("Failed to load data", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
});

const filterMember = computed(() => {
  if (!allUser.value) return [];
  return allUser.value.filter(
    (user) => Number(user.dept_id) === Number(deptId.value),
  );
});

const getRoleLabel = (roleValue: string) => {
  return roleOptions.find((r) => r.value === roleValue)?.label || roleValue;
};
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] p-6 md:p-10 font-inter">
    <header class="max-w-6xl mx-auto mb-10">
      <NuxtLink
        @click.prevent="$router.back()"
        class="group flex items-center justify-center w-12 h-12 bg-white border border-gray-200 text-gray-600 rounded-2xl shadow-sm hover:shadow-md hover:border-[var(--gold-main)] hover:text-[var(--gold-main)] transition-all duration-300"
        title="Kembali"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-5 h-5 group-hover:-translate-x-1 transition-transform"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </NuxtLink>
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span
              class="px-3 py-1 bg-[var(--gold-main)] text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-amber-200/50"
            >
              Department
            </span>
            <span
              class="text-[10px] font-bold text-gray-300 tracking-tighter italic"
              >ID: #DEPT-{{ deptId.padStart(3, "0") }}</span
            >
          </div>
          <h1
            class="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase italic"
          >
            {{ departmentDetail?.name || "Loading..." }}
          </h1>
        </div>

        <div class="flex gap-4">
          <div
            class="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm min-w-[160px]"
          >
            <p
              class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1"
            >
              Total Members
            </p>
            <div class="flex items-end gap-2">
              <span class="text-3xl font-black text-zinc-900 leading-none">{{
                filterMember.length
              }}</span>
              <span
                class="text-xs font-bold text-zinc-400 uppercase italic mb-1"
                >Personnel</span
              >
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto">
      <div
        class="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100"
      >
        <div
          class="p-8 border-b border-gray-50 flex justify-between items-center"
        >
          <h3
            class="font-black text-sm text-zinc-800 uppercase tracking-widest"
          >
            Member Directory
          </h3>
        </div>

        <div v-if="isLoading" class="p-20 text-center">
          <div
            class="inline-block w-8 h-8 border-4 border-zinc-100 border-t-[var(--gold-main)] rounded-full animate-spin"
          ></div>
          <p
            class="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]"
          >
            Synchronizing Data...
          </p>
        </div>

        <div v-else-if="filterMember.length > 0" class="overflow-x-auto">
          <OvertimeTable :headers="['Name', 'Role', 'Actions']">
            <template #body-content class="divide-y divide-gray-50">
              <tr
                v-for="user in filterMember"
                :key="user.id"
                class="group hover:bg-zinc-50/50 transition-all duration-300"
              >
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-4">
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
                    <div class="flex flex-col">
                      <span
                        class="text-sm font-black text-zinc-800 uppercase tracking-tight"
                        >{{ user.name }}</span
                      >
                      <span
                        class="text-[10px] text-gray-400 font-medium lowercase"
                        >{{ user.email }}</span
                      >
                    </div>
                  </div>
                </td>

                <td class="px-8 py-5 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100 bg-amber-50 text-amber-700"
                  >
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>

                <td class="px-8 py-5 text-right">
                  <NuxtLink
                    :to="`/admin/user/${user.id}`"
                    class="inline-flex items-center bg-gray-100 gap-2 border-b border-[var(--gold-main)] text-[10px] hover:bg-[var(--gold-dark)] space-y-4 py-1.5 px-3 rounded-lg font-black uppercase tracking-widest text-zinc-800 hover:text-zinc-900 transition-colors"
                  >
                    View Profile <span>→</span>
                  </NuxtLink>
                </td>
              </tr>
            </template>
          </OvertimeTable>
        </div>

        <div v-else class="p-20 text-center">
          <div class="text-5xl mb-6">👥</div>
          <h4 class="text-sm font-black text-zinc-800 uppercase mb-1">
            No Members Found
          </h4>
          <p class="text-xs text-gray-400 font-medium">
            There are currently no users assigned to this department.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
