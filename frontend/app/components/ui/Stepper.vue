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
    <div class="relative group inline-block">
      <div
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
      >
        Status PIC: {{ picStatus }}
        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
        ></div>
      </div>

      <div
        :class="getStatusClass(picStatus)"
        class="w-4 h-4 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-all"
      ></div>
    </div>
    <div class="w-10 h-[2px] bg-gray-100"></div>
    <div class="relative group inline-block">
      <div
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
      >
        Status C-Level: {{ clevelStatus }}
        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
        ></div>
      </div>

      <div
        :class="getStatusClass(clevelStatus)"
        class="w-4 h-4 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-all"
      ></div>
    </div>
    <div class="w-10 h-[2px] bg-gray-100"></div>
    <div class="relative group inline-block">
      <div
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
      >
        Status HRD: {{ hrdStatus }}
        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
        ></div>
      </div>

      <div
        :class="getStatusClass(hrdStatus)"
        class="w-4 h-4 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-all"
      ></div>
    </div>
  </div>
</template>
