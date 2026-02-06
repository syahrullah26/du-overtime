<script setup lang="ts">
defineProps<{
  label?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
}>();
</script>
<template>
  <button
    :type="type || 'button'"
    class="px-4 py-2 rounded-lg font-medium transition-all active:scale-95 hover:scale-105 duration-300 hover:text-black"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-700':
        variant === 'primary' || !variant,
      'bg-red-600 text-white hover:bg-red-700': variant === 'secondary',
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50':
        variant === 'outline',
    }"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
