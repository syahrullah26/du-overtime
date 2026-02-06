<script setup lang="ts">
defineProps<{
  headers: string[];
}>();
</script>
<template>
  <div
    class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-[#FCF9F3] text-[#C5A059] text-xs uppercase font-bold">
          <tr>
            <th v-for="header in headers" :key="header" class="p-6">
              {{ header }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-50">
          <slot name="body-content"></slot>
        </tbody>
      </table>
    </div>

    <div v-if="$slots.footer" class="p-4 border-t border-gray-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
