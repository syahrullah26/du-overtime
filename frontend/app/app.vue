<script setup lang="ts">
const { initUser } = useAuth();
onMounted(() => {
  initUser();
});
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
