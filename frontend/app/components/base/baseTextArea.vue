<script setup lang="ts">
const model = defineModel<string>();

interface Props {
  label?: string;
  placeholder?: string;
  rows?: number | string;
}

withDefaults(defineProps<Props>(), {
  rows: 4,
  placeholder: "Tuliskan Alasan...",
});
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <label
      v-if="label"
      class="text-sm font-semibold text-[var(--gold-dark)] capitalize"
    >
      {{ label }}
    </label>

    <textarea
      v-model="model"
      class="w-full block border p-4 rounded-xl text-black transition-all hover:bg-gray-50 focus:bg-white focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold-main)] outline-none box-border resize-y"
      :placeholder="placeholder"
      :rows="rows"
    ></textarea>
  </div>
</template>
