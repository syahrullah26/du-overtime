<script setup lang="ts">
const { userState } = useAuth();
const { submissions, fetchSubmissions, loading } = useOvertime();



onMounted(async () => {
  await fetchSubmissions();
});

// Mapping Actor ke Komponen
const activeDashboard = computed(() => {
  if (userState.value?.role === "EMPLOYEE")
    return resolveComponent("DashboardEmployeeDashboard");
  if (userState.value?.role === "PIC")
    return resolveComponent("DashboardPicDashboard");
  if (userState.value?.role === "FINANCE")
    return resolveComponent("DashboardFinanceDashboard");
  if (userState.value?.role === "HRD")
    return resolveComponent("DashboardHrdDashboard");
  if (userState.value?.role === "C_LEVEL")
    return resolveComponent("DashboardClevelDashboard");
  return null;
});
</script>

<template>
  <div class="w-full min-h-screen bg-[var(--white-bone)]">
    <ClientOnly>
      <div v-if="userState">
        <component
          :is="activeDashboard"
          :user="userState"
          :submissions="submissions"
        />
      </div>

      <template #fallback>
        <div class="flex items-center justify-center min-h-[60vh] w-full">
          <div class="flex flex-col items-center gap-4">
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold-main)]"
            ></div>
            <p class="text-gray-400 font-medium animate-pulse">
              Memuat Dashboard...
            </p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
