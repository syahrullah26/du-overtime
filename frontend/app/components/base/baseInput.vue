<script setup lang="ts">
const model = defineModel();

defineProps<{
  label?: string;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time";
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <div class="w-full">
    <input
      v-model="model"
      :type="type || 'text'"
      :placeholder="placeholder || label"
      :readonly
      :disabled
      :class="{ 'cursor-not-allowed': disabled }"
      class="w-full border p-2 mb-4 rounded text-black transition-all hover:bg-gray-50 focus:bg-white focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold-main)] outline-none"
    />
  </div>
</template>
