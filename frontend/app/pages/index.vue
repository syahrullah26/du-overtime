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
      <div class="grid grid-cols-3 gap-4"> <!--Nanti di Hapus -->
        <NuxtLink to="/dashboard">
          <BaseButton label="Sign In Finance" variant="primary" type="submit" />
        </NuxtLink>
        <NuxtLink to="/dashboard/hrd">
          <BaseButton label="Sign In HRD" variant="primary" type="submit" />
        </NuxtLink>
        <NuxtLink to="/dashboard/pic">
          <BaseButton label="Sign In PIC" variant="primary" type="submit" />
        </NuxtLink>
        <NuxtLink to="/dashboard/clevel">
          <BaseButton label="Sign In C-Level" variant="primary" type="submit" />
        </NuxtLink>
        <NuxtLink to="/dashboard/employee">
          <BaseButton
            label="Sign In Employee"
            variant="primary"
            type="submit"
          />
        </NuxtLink>
      </div>
      <!-- <div class="flex justify-center items-center"></div>  PINDAHIN KESINI -->
    </form>
  </section>
</template>
