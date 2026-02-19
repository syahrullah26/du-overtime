<script setup lang="ts">
const { userState, logout } = useAuth();

// Menghitung persentase kelengkapan profil (contoh)
const profileCompletion = ref(85);

const stats = computed(() => [
  {
    label: "Total Lembur",
    value: "24.5h",
    icon: "⏱️",
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Status",
    value: "Active",
    icon: "🛡️",
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Level",
    value: userState.value?.role || "Staff",
    icon: "👑",
    color: "bg-amber-50 text-amber-600",
  },
]);

// Menangani Logout dengan animasi simpel
const handleLogout = async () => {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    await logout();
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FD] p-4 md:p-12 font-inter">
    <div class="max-w-6xl mx-auto">
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
            Account
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-main)] to-[var(--gold-dark)]"
              >Center</span
            >
          </h1>
        </div>
        <div class="hidden md:block text-right">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Local Time
          </p>
          <p class="text-lg font-black text-gray-800">
            {{
              new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
            WIB
          </p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-8 space-y-8">
          <div
            class="relative bg-white rounded-[2.5rem] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden group"
          >
            <div
              class="absolute -top-24 -left-24 w-64 h-64 bg-[var(--gold-main)] opacity-[0.03] blur-[80px] rounded-full"
            ></div>

            <div
              class="relative bg-white rounded-[2.4rem] p-10 flex flex-col md:flex-row gap-10 items-center"
            >
              <div class="relative flex-shrink-0">
                <svg class="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="transparent"
                    class="text-gray-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="transparent"
                    :stroke-dasharray="440"
                    :stroke-dashoffset="440 - (440 * profileCompletion) / 100"
                    stroke-linecap="round"
                    class="text-[var(--gold-main)] transition-all duration-1000 ease-out"
                  />
                </svg>
                <div
                  class="absolute inset-0 flex items-center justify-center p-4"
                >
                  <div
                    class="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl"
                  >
                    <img
                      :src="`https://ui-avatars.com/api/?name=${userState?.name}&background=111&color=fff&size=200`"
                      class="w-full h-full object-cover shadow-inner"
                    />
                  </div>
                </div>
                <div
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-1 rounded-full font-bold"
                >
                  {{ profileCompletion }}% Complete
                </div>
              </div>

              <div class="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h2
                    class="text-4xl font-black text-gray-900 leading-tight tracking-tight"
                  >
                    {{ userState?.name }}
                  </h2>
                  <p
                    class="text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2 text-lg"
                  >
                    {{ userState?.email }}
                  </p>
                </div>

                <div
                  class="flex flex-wrap gap-3 justify-center md:justify-start pt-2"
                >
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="flex items-center gap-3 px-5 py-3 rounded-2xl border border-gray-50 bg-white shadow-sm hover:shadow-md transition-all group/stat cursor-default"
                  >
                    <span class="text-xl">{{ stat.icon }}</span>
                    <div>
                      <p
                        class="text-[10px] font-black text-gray-400 uppercase tracking-tighter"
                      >
                        {{ stat.label }}
                      </p>
                      <p class="text-sm font-bold text-gray-800">
                        {{ stat.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <NuxtLink
              :to="{
                name: 'profile-edit-id',
                params: { id: userState?.id },
              }"
              class="group relative p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div
                class="absolute top-0 left-0 w-1 h-full bg-[var(--gold-main)]"
              ></div>
              <div
                class="text-3xl mb-4 group-hover:scale-110 transition-transform"
              >
                📝
              </div>
              <p class="text-left font-black text-gray-800">Edit Profile</p>
              <p class="text-left text-xs text-gray-400 mt-1 font-medium">
                Update data diri & foto
              </p>
            </NuxtLink>

            <NuxtLink
              :to="{
                name: 'profile-password-id',
                params: { id: userState?.id },
              }"
              class="group relative p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div
                class="text-3xl mb-4 group-hover:scale-110 transition-transform"
              >
                🔑
              </div>
              <p class="text-left font-black text-gray-800">Security</p>
              <p class="text-left text-xs text-gray-400 mt-1 font-medium">
                Ubah password & akses
              </p>
            </NuxtLink>

            <NuxtLink
              @click="handleLogout"
              class="group relative p-6 bg-red-50 rounded-3xl border border-red-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div
                class="text-3xl mb-4 group-hover:scale-110 transition-transform"
              >
                🚪
              </div>
              <p class="text-left font-black text-red-600">Logout</p>
              <p class="text-left text-xs text-red-400 mt-1 font-medium">
                Keluar dari sesi ini
              </p>
            </NuxtLink>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-8">
          <div
            class="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
          >
            <div class="relative z-10 space-y-6">
              <div class="flex justify-between items-start">
                <div
                  class="w-12 h-12 bg-[var(--gold-main)] rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                >
                  🥇
                </div>
                <span
                  class="text-[10px] font-black tracking-widest text-gray-500 uppercase"
                  >Loyalty Status</span
                >
              </div>

              <div>
                <h3 class="text-2xl font-black">Elite Member</h3>
                <p class="text-gray-400 text-xs font-medium mt-1">
                  Dewa United Official Crew
                </p>
              </div>

              <div class="pt-4 space-y-2">
                <div
                  class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                  <span>Performance</span>
                  <span class="text-[var(--gold-main)]">Excellent</span>
                </div>
                <div
                  class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-[var(--gold-main)] to-amber-300 w-[90%] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  ></div>
                </div>
              </div>
            </div>

            <div
              class="absolute -bottom-10 -right-6 text-white opacity-[0.03] select-none italic font-black text-[12rem] rotate-12"
            >
              DU
            </div>
          </div>

          <div
            class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
          >
            <h4
              class="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2"
            >
              <span class="w-1.5 h-4 bg-[var(--gold-main)] rounded-full"></span>
              Recent Activity
            </h4>
            <div class="space-y-6">
              <div v-for="i in 3" :key="i" class="flex gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm border border-gray-100"
                >
                  {{ ["📝", "✅", "🕒"][i - 1] }}
                </div>
                <div>
                  <p class="text-xs font-black text-gray-800 leading-none mb-1">
                    {{
                      ["Update Profile", "Overtime Approved", "Login Session"][
                        i - 1
                      ]
                    }}
                  </p>
                  <p class="text-[10px] text-gray-400 font-medium">
                    Today, 12:45 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap");

.font-inter {
  font-family: "Inter", sans-serif;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Scrollbar for better UI if needed */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
