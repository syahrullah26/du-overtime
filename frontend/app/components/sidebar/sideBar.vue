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
  role?: string[];
  children?: Menu[];
}

const menus: Menu[] = [
  { name: "Dashboard", to: "/", icon: "🏠" },
  {
    name: "Overtime Submission",
    icon: "⏰",
    role: ["PIC", "EMPLOYEE", "SUPERADMIN"],
    children: [
      { name: "Overtime", to: "/overtime", icon: "📝" },
      { name: "View Overtime", to: "/overtime/view", icon: "📄" },
      {
        name: "Approval Overtime",
        to: "/overtime/view/ApprovalOvertime",
        icon: "📋",
        role: ["PIC", "EMPLOYEE"],
      },
      {
        name: "Overtime Logs",
        to: "/overtime/logs",
        icon: "📋",
        role: ["SUPERADMIN"],
      },
    ],
  },
  {
    name: "Approval Finance",
    icon: "💸",
    role: ["FINANCE", "SUPERADMIN"],
    children: [
      { name: "View Overtime", to: "/overtime/view", icon: "📋" },
      { name: "Overtime History", to: "/overtime/view/history", icon: "📄" },
    ],
  },
  {
    name: "Approval HRD",
    icon: "👨‍💼",
    role: ["HRD", "SUPERADMIN"],
    children: [{ name: "View Overtime", to: "/overtime/view", icon: "📄" }],
  },
  {
    name: "Data Master",
    icon: "📊",
    role: ["SUPERADMIN", "HRD"],
    children: [
      {
        name: "Data Employee",
        icon: "👥",
        role: ["SUPERADMIN", "HRD"],
        children: [
          { name: "Employee List", to: "/admin/user", icon: "📋" },
          { name: "Add Employee", to: "/admin/user/add", icon: "➕" },
        ],
      },
      {
        name: "Data Department",
        icon: "🏢",
        role: ["SUPERADMIN", "HRD"],
        children: [
          { name: "Department List", to: "/admin/department", icon: "📋" },
          { name: "Add Department", to: "/admin/department/add", icon: "➕" },
        ],
      },
    ],
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
    return items
      .filter((item) => {
        if (userRole === "SUPERADMIN") return true;
        return !item.role || item.role.includes(userRole);
      })
      .map((item) => {
        const newItem = { ...item };
        if (newItem.children) {
          newItem.children = filterByRole(newItem.children);
        }
        return newItem;
      });
  };

  return filterByRole(JSON.parse(JSON.stringify(menus)));
});

const isActive = (path: string | undefined) =>
  computed(() => {
    if (!path) return false;
    return route.path === path || route.path.startsWith(path + "/");
  });
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
      <div v-if="!isCollapsed" class="flex items-center gap-2">
        <img src="/du-universal.png" alt="Logo" class="h-8 object-contain" />
        <h1 class="text-sm font-bold text-white uppercase tracking-tighter">
          <span class="text-yellow-600">Dewa</span> Overtime
        </h1>
      </div>
      <div v-else class="mx-auto">
        <img src="/du-universal.png" alt="Logo" class="h-8 object-contain" />
      </div>

      <button
        @click="isSidebarOpen = !isSidebarOpen"
        class="hidden lg:flex text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
      >
        {{ isSidebarOpen ? "❮" : "☰" }}
      </button>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
      <template v-for="menu in filteredMenus" :key="menu.name">
        <NuxtLink
          v-if="!menu.children || menu.children.length === 0"
          :to="menu.to"
          @click="isOpen = false"
          class="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 transition-all duration-200"
          :class="
            isActive(menu.to).value
              ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/20'
              : 'hover:bg-zinc-800'
          "
        >
          <span class="text-xl transition-transform group-hover:scale-110">{{
            menu.icon
          }}</span>
          <span v-if="!isCollapsed" class="font-medium text-sm">{{
            menu.name
          }}</span>
        </NuxtLink>

        <div v-else class="space-y-1">
          <button
            @click="toggleMenu(menu.name)"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-zinc-800 transition-all"
            :class="openMenu === menu.name ? 'bg-zinc-800/50' : ''"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ menu.icon }}</span>
              <span v-if="!isCollapsed" class="font-medium text-sm">{{
                menu.name
              }}</span>
            </div>
            <span
              v-if="!isCollapsed"
              class="text-[10px] transition-transform duration-300"
              :class="openMenu === menu.name ? 'rotate-180' : ''"
              >▼</span
            >
          </button>

          <div
            v-if="openMenu === menu.name && !isCollapsed"
            class="ml-4 mt-1 space-y-1 border-l border-zinc-800 pl-2 transition-all"
          >
            <template v-for="child in menu.children" :key="child.name">
              <NuxtLink
                v-if="!child.children || child.children.length === 0"
                :to="child.to"
                class="block px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-zinc-800 transition-all"
                :class="
                  isActive(child.to).value
                    ? 'text-yellow-500 font-bold bg-zinc-800'
                    : ''
                "
              >
                <span class="mr-2">{{ child.icon }}</span> {{ child.name }}
              </NuxtLink>

              <div v-else class="py-1">
                <div
                  class="px-4 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"
                >
                  <span>{{ child.icon }}</span> {{ child.name }}
                </div>

                <div class="ml-4 space-y-1 border-l border-zinc-800/50 pl-2">
                  <NuxtLink
                    v-for="grandChild in child.children"
                    :key="grandChild.name"
                    :to="grandChild.to"
                    class="block px-4 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-zinc-800 transition-all"
                    :class="
                      isActive(grandChild.to).value
                        ? 'text-yellow-500 font-bold'
                        : ''
                    "
                  >
                    <span class="mr-1 opacity-70">{{ grandChild.icon }}</span>
                    {{ grandChild.name }}
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </nav>

    <div class="p-4 border-t border-zinc-800 bg-zinc-900/50">
      <div v-if="userState" class="mb-4">
        <NuxtLink
          to="/profile"
          class="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800 transition-all"
        >
          <img
            :src="
              getImageUrl(userState?.profile_picture) ||
              `https://ui-avatars.com/api/?name=${userState.name}`
            "
            class="w-10 h-10 rounded-full object-cover border border-zinc-700"
          />
          <div
            v-if="!isCollapsed"
            class="flex flex-col overflow-hidden text-left"
          >
            <span class="text-xs font-bold text-white truncate">{{
              userState.name
            }}</span>
            <span class="text-[10px] text-gray-500 truncate uppercase">{{
              userState.department?.name || userState.role
            }}</span>
          </div>
        </NuxtLink>
      </div>

      <button
        @click="logoutHandle"
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-500/5 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
      >
        <span>🚪</span>
        <span v-if="!isCollapsed">Sign Out</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
