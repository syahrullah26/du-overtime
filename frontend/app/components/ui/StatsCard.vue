<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  icon: string;
}>();
</script>
<template>
  <div
    class="bg-white border-b-4 border-[#C5A059] p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="text-gray-400 text-xs uppercase font-bold tracking-widest">
          {{ label }}
        </p>
        <h2 class="text-2xl font-black mt-2 text-gray-800">{{ value }}</h2>
      </div>
      <span class="text-2xl opacity-50">{{ icon }}</span>
    </div>
  </div>
</template>
