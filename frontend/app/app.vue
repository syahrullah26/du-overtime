<script setup lang="ts">
const { initUser } = useAuth();
onBeforeMount(() => {
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
