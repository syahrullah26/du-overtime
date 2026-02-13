<script setup lang="ts">
import sideBar from "../components/sidebar/sideBar.vue";
import footerDefault from "../components/footer/footerDefault.vue";
const isSidebarOpen = useState("sidebar-toggle", () => true);
definePageMeta({
  roles: ["EMPLOYEE", "HRD", "FINANCE", "PIC", "C_LEVEL"],
});
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] text-zinc-100">
    <sideBar />

    <div
      class="transition-all duration-300 min-h-screen"
      :class="[isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20', 'pt-16 lg:pt-0']"
    >
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
        <footerDefault />
      </main>
    </div>
  </div>
</template>
