<script setup lang="ts">
const { userState, initUser } = useAuth();
const { submissions, fetchSubmissions, loading } = useOvertime();

definePageMeta({ middleware: "auth" });

onMounted(async () => {
  initUser();
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
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <component
      :is="activeDashboard"
      v-if="userState"
      :user="userState"
      :submissions="submissions"
      :loading="loading"
    />
    <div v-else class="flex justify-center p-20">
      <p class="animate-pulse">Menyiapkan Dashboard...</p>
    </div>
  </div>
</template>
