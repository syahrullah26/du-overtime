<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>
<template>
  <section>
    <form>
      <BaseInput label="Email" type="email" />
      <BaseInput label="Password" type="password" />
      <div class="flex justify-center items-center">
        <BaseButton label="Sign In" variant="primary" type="submit" />
      </div>
    </form>
  </section>
</template>
