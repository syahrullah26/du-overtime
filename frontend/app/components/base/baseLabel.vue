<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>
<template>
  <label class="block text-[var(--gold-dark)] font-semibold">{{ label }}</label>
</template>
