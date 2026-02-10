<script setup lang="ts">
defineProps<{
  userName: string;
  position: string;
  imageUrl: string;
}>();
</script>
<template>
  <section>
    <div
      class="grid grid-cols-1 gap-4 bg-white border-b-4 border-[var(--gold-main)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-default mb-5"
    >
      <div class="flex justify-center items-center">
        <img :src="imageUrl" class="rounded-full w-32 mx-auto mb-4" />
      </div>
      <div class="text-center">
        <h2 class="text-2xl font-black mt-2 text-gray-800">
          {{ userName }}
        </h2>
        <div class="flex items-center justify-center gap-4">
          <div class="flex-1 h-px bg-[#7b5902]"></div>
          <p class="text-gray-400 text-xs uppercase font-bold tracking-widest">
            {{ position }}
          </p>
          <div class="flex-1 h-px bg-[#7b5902]"></div>
        </div>
      </div>
    </div>
  </section>
</template>
