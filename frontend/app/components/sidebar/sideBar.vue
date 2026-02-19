<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { ref, computed } from "vue";

const route = useRoute();
const isOpen = ref(false);
const isSidebarOpen = useState("sidebar-toggle", () => true);

const isCollapsed = computed({
  get: () => !isSidebarOpen.value,
  set: (val) => (isSidebarOpen.value = !val),
});

const openMenu = ref<string | null>(null);

const toggleMenu = (name: string) => {
  openMenu.value = openMenu.value === name ? null : name;
};

const { logout, userState } = useAuth();

const logoutHandle = async () => {
  await logout();
};

export interface Menu {
  name: string;
  to?: string;
  icon: string;
  roles?: string[];
  children?: Menu[];
}
const menus = [
  { name: "Dashboard", to: "/", icon: "🏠" },
  {
    name: "Overtime Submission",
    icon: "⏰",
<<<<<<< HEAD
    role: ["EMPLOYEE"],
=======
    role: ["PIC", "EMPLOYEE", "SUPERADMIN"],
>>>>>>> b3d3cb2c39221f1ca37ef8c870b04f851120111c
    children: [
      { name: "Overtime", to: "/overtime", icon: "📝" },
      { name: "View Overtime", to: "/overtime/view", icon: "📄" },
      {
        name: "Overtime Logs",
        to: "/overtime/logs",
        icon: "📋",
        role: ["SUPERADMIN"],
      },
    ],
  },
  {
    name: "Approval PIC",
    icon: "👨‍💼",
    role: ["PIC"],
    children: [
      { name: "Overtime", to: "/overtime", icon: "📝" },
      {
        name: "Approval Overtime",
        to: "/overtime/view/PicOvertime",
        icon: "📝",
      },
      { name: "View Overtime", to: "/overtime/view", icon: "📄" },
    ],
  },
  {
    name: "Approval Finance",
    icon: "💸",
    role: ["FINANCE", "SUPERADMIN"],
    children: [{ name: "View Overtime", to: "/overtime/view", icon: "📄" }],
  },
  {
    name: "Approval HRD",
    icon: "👨‍💼",
    role: ["HRD", "SUPERADMIN"],
    children: [{ name: "View Overtime", to: "/overtime/view", icon: "📄" }],
  },
  {
    name: "Approval C-Level",
    icon: "👨‍💼",
    role: ["C_LEVEL", "SUPERADMIN"],
    children: [{ name: "View Overtime", to: "/overtime/view", icon: "📄" }],
  },
];

const filteredMenus = computed(() => {
  if (!userState.value) return [];
  const userRole = userState.value.role;

  const filterByRole = (items: any[]) => {
    return items.filter((item) => {
      //superadmin liat semua
      if (userRole === "SUPERADMIN") return true;

      const hasAccess = !item.role || item.role.includes(userRole);

      if (hasAccess && item.children) {
        //filter child
        item.children = filterByRole(item.children);
      }

      return hasAccess;
    });
  };

  // clone menu
  const menusClone = JSON.parse(JSON.stringify(menus));
  return filterByRole(menusClone);
});

const isActive = (path: string) =>
  computed(() => route.path === path || route.path.startsWith(path + "/"));
</script>

<template>
  <div
    v-if="isOpen"
    @click="isOpen = false"
    class="fixed inset-0 bg-black/60 z-30 lg:hidden"
  />

  <aside
    class="fixed top-0 left-0 h-screen z-40 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300"
    :class="[
      isCollapsed ? 'w-20' : 'w-64',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <div
      class="h-16 flex items-center justify-between px-4 border-b border-zinc-800"
    >
      <div class="flex items-center justify-center gap-4">
        <div class="flex-1 h-px bg-[#7b5902]"></div>
        <img
          src="/du-universal.png"
          alt="Dewa United"
          class="h-10 object-contain"
        />
        <div class="flex-1 h-px bg-[#7b5902]"></div>
      </div>
      <h1 v-if="!isCollapsed" class="text-lg font-bold text-white">
        <span class="text-yellow-600">Dewa</span> Overtime
      </h1>

      <button
        @click="isSidebarOpen = !isSidebarOpen"
        class="hidden lg:flex text-gray-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
      >
        {{ isSidebarOpen ? "❮" : "☰" }}
      </button>

      <button
        @click="isOpen = false"
        class="lg:hidden text-gray-400 hover:text-white"
      >
        ✕
      </button>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <template v-for="menu in filteredMenus" :key="menu.name">
        <NuxtLink
          v-if="!menu.children"
          :to="menu.to"
          @click="isOpen = false"
          class="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 transition-all duration-200"
          :class="
            isActive(menu.to).value
              ? 'bg-[var(--gold-dark)] text-white shadow-inner'
              : 'hover:bg-yellow-600/20'
          "
        >
          <span
            class="text-xl transition-transform duration-200 group-hover:scale-110"
          >
            {{ menu.icon }}
          </span>
          <span v-if="!isCollapsed" class="font-medium transition-colors">
            {{ menu.name }}
          </span>
        </NuxtLink>

        <div v-else class="space-y-1">
          <button
            @click="toggleMenu(menu.name)"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-yellow-600/20 transition-all"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ menu.icon }}</span>
              <span v-if="!isCollapsed" class="font-medium">{{
                menu.name
              }}</span>
            </div>
            <span
              v-if="!isCollapsed"
              class="text-[10px] transition-transform duration-300"
              :class="openMenu === menu.name ? 'rotate-180' : ''"
            >
              ▼
            </span>
          </button>

          <div
            v-if="openMenu === menu.name && !isCollapsed"
            class="ml-10 mt-2 space-y-1 border-l border-zinc-700/50 pl-3"
          >
            <NuxtLink
              v-for="child in menu.children"
              :key="child.name"
              :to="child.to"
              class="block px-3 py-2 rounded-lg text-gray-400 text-sm hover:text-white hover:bg-yellow-600/40 transition-all"
              :class="
                isActive(child.to).value
                  ? 'text-[var(--gold-dark)] font-bold'
                  : ''
              "
            >
              {{ child.icon }} {{ child.name }}
            </NuxtLink>
          </div>
        </div>
      </template>
    </nav>
    <div
      class="p-4 border-t border-zinc-800 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold"
    >
      <div
        v-if="!isCollapsed"
        class="bg-zinc-800 rounded-xl hover:bg-yellow-600/20 hover:shadow-inner hover:scale-110 hover:text-white hover:font-bold transition-all"
      >
        <div v-if="userState">
          <NuxtLink class="cursor-pointer" to="/profile">
            <div class="grid grid-cols-2 gap-2">
              <img
                :src="
                  userState?.avatar ||
                  'https://ui-avatars.com/api/?name=' + userState.name
                "
                class="rounded-full w-10 mx-auto my-2 object-cover aspect-square"
              />
              <div class="group flex flex-col items-center justify-center">
                <span class="text-[var(--gold-dark)]">{{
                  userState.name
                }}</span>
                <span>{{ userState.role }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="flex items-center justify-center">
        <NuxtLink
          to="/profile"
          class="rounded-full shadow-md shadow-zinc-900 hover:shadow-lg hover:shadow-yellow/20 hover:shadow-inner hover:scale-110 hover:text-white hover:font-bold transition-all"
        >
          <img
            :src="
              userState?.avatar ||
              'https://ui-avatars.com/api/?name=' + userState?.name
            "
            class="rounded-full w-10 mx-auto my-2 object-cover aspect-square"
          />
        </NuxtLink>
      </div>
    </div>

    <div
      class="p-4 border-t border-zinc-800 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold"
    >
      <span v-if="!isCollapsed">DU-OVERTIME 2026</span>
      <span v-else>DU</span>
      <button
        @click="logoutHandle"
        class="w-full flex items-center cursor-pointer justify-center mt-4 gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-zinc-700/50 border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 active:scale-[0.98]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
          />
        </svg>
        <span v-if="!isCollapsed">Logout</span>
        <span v-else>
          <div class="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
              />
            </svg>
          </div>
        </span>
      </button>
    </div>
  </aside>

  <header
    class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 z-20"
  >
    <button @click="isOpen = true" class="text-gray-300 text-xl">☰</button>
    <h1 class="ml-4 font-semibold text-white">
      <span class="text-yellow-600 font-bold">DU</span>-Overtime
    </h1>
  </header>
</template>
