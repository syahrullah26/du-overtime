<script setup lang="ts">
defineProps<{
  label?: string;
  placeholder?: string;
  rows?: number;
}>();
</script>
<template>
  <textarea
    class="w-full block border p-4 rounded-xl text-black transition-all hover:bg-gray-50 focus:bg-white focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold-main)] outline-none box-border"
    :placeholder="placeholder"
    :rows="rows"
  ></textarea>
</template>
