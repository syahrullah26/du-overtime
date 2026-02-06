<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>
<template>
  <section>
    <form @submit.prevent="handleLogin">
      <input
        type="text"
        placeholder="Email"
        class="w-full border p-2 mb-4 rounded"
      />
      <div class="flex justify-center items-center">
        <BaseButton label="Sign In" variant="primary" type="submit" />
      </div>
    </form>
  </section>
</template>
