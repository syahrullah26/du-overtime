<script setup lang="ts">
defineProps<{
  picStatus: string;
  clevelStatus: string;
  hrdStatus: string;
}>();

const getStatusClass = (status: string) => {
  if (status === "done")
    return "bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.5)]";
  if (status === "process")
    return "bg-amber-200 animate-pulse border-2 border-[#C5A059]";
  return "bg-gray-200";
};
</script>
<template>
  <div class="flex items-center">
    <div
      :class="getStatusClass(picStatus)"
      class="w-4 h-4 rounded-full border-2 border-white"
      title="PIC"
    ></div>
    <div class="w-10 h-[2px] bg-gray-100"></div>
    <div
      :class="getStatusClass(clevelStatus)"
      class="w-4 h-4 rounded-full border-2 border-white"
      title="C-Level"
    ></div>
    <div class="w-10 h-[2px] bg-gray-100"></div>
    <div
      :class="getStatusClass(hrdStatus)"
      class="w-4 h-4 rounded-full border-2 border-white"
      title="HRD"
    ></div>
  </div>
</template>
