<script setup lang="ts">
const route = useRoute();
const userId = route.params.id;

const { fetchUserById, userSelected } = useUser();
const { fetchSubmissions, submissions } = useOvertime();

onMounted(() => {
  fetchUserById(userId as string);
  fetchSubmissions();
});

const totalSubmissionsById = computed(() => {
  if (!userSelected.value) return 0;
  return submissions.value.filter(
    (s) => Number(s.employee_id) === Number(userSelected.value?.id),
  ).length;
});

const totalHours = computed(() => {
  if (!userSelected.value) return "0.0";
  const userSubmissions = submissions.value.filter(
    (s) =>
      Number(s.employee_id) === Number(userSelected.value?.id) &&
      s.status === "COMPLETED",
  );
  const totalMin = userSubmissions.reduce(
    (acc, curr) => acc + (curr.duration_min || 0),
    0,
  );
  return (totalMin / 60).toFixed(1);
});
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-4 md:p-8">
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-3">
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
          <span
            class="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest"
          >
            Employee Profile
          </span>
        </div>
        <h1
          class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none"
        >
          Data <span class="text-[var(--gold-dark)]">Karyawan</span>
        </h1>
      </div>

      <div class="flex gap-2">
        <NuxtLink
          :to="`/admin/user/${userId}/edit`"
          class="px-6 py-3 bg-[var(--gold-dark)] hover:bg-[var(--gold-main)] text-white font-bold rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-95 text-sm"
        >
          Edit Profile 📝
        </NuxtLink>
      </div>
    </header>

    <div v-if="userSelected" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-full h-24 bg-zinc-900"></div>

          <div class="relative mt-8">
            <div
              class="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl mx-auto bg-white"
            >
              <img
                :src="
                  getImageUrl(userSelected.profile_picture) ||
                  `https://ui-avatars.com/api/?name=${userSelected.name}&background=fde68a&color=b45309&bold=true&size=200`
                "
                class="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <div class="mt-4">
              <h2 class="text-2xl font-black text-gray-900 tracking-tight">
                {{ userSelected.name }}
              </h2>
              <span
                class="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full uppercase border border-amber-100"
              >
                {{
                  userSelected.department?.name ||
                  userSelected.role ||
                  "Not Set"
                }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
            <div>
              <p
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
              >
                Total Overtime
              </p>
              <p class="text-xl font-black text-gray-900">
                {{ totalSubmissionsById }}
                <span class="text-xs text-gray-400">Log</span>
              </p>
            </div>
            <div>
              <p
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
              >
                Total Jam
              </p>
              <p class="text-xl font-black text-gray-900">
                {{ totalHours }} <span class="text-xs text-gray-400">Hrs</span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2.5rem] text-white">
          <h3
            class="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-4"
          >
            Contact Info
          </h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="p-2 bg-zinc-800 rounded-lg text-sm">📧</span>
              <p class="text-sm font-medium opacity-80 truncate text-black">
                {{ userSelected.email }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="p-2 bg-zinc-800 rounded-lg text-sm">🏢</span>
              <p class="text-sm font-medium opacity-80 text-black">
                {{
                  userSelected.department?.name ||
                  userSelected.role ||
                  "Not Set"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <div class="flex items-center justify-between mb-8">
            <h3
              class="text-xl font-black text-gray-900 uppercase tracking-tighter"
            >
              Informasi <span class="text-[var(--gold-dark)]">Detail</span>
            </h3>
            <span class="text-[10px] font-bold text-gray-400 uppercase"
              >Last Update: {{ formatDate(userSelected.updated_at) }}</span
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div
              v-for="info in [
                { label: 'Role Access', value: userSelected.role, icon: '🔑' },
                {
                  label: 'Department',
                  value: userSelected.department?.name || '-',
                  icon: '🏛️',
                },
                {
                  label: 'Join Date',
                  value: formatDate(userSelected.created_at),
                  icon: '📅',
                },
                { label: 'Status Account', value: 'Active', icon: '✅' },
              ]"
              :key="info.label"
              class="group border-b border-gray-50 pb-4 transition-all hover:border-amber-200"
            >
              <p
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[var(--gold-dark)] transition-colors"
              >
                {{ info.icon }} {{ info.label }}
              </p>
              <p class="text-sm font-bold text-gray-800">
                {{ info.value || "Not Set" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div class="text-6xl mb-4">🔍</div>
      <h2 class="text-2xl font-black text-gray-800 tracking-tight">
        Karyawan tidak ditemukan
      </h2>
      <p class="text-gray-500 mb-8">
        Data yang Anda cari tidak tersedia atau telah dihapus.
      </p>
      <NuxtLink
        to="/admin/user"
        class="px-8 py-3 bg-zinc-900 text-white font-bold rounded-2xl"
        >Kembali ke Daftar</NuxtLink
      >
    </div>
  </div>
</template>
