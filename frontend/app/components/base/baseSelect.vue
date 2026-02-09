<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
}

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array as () => Option[],
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Pilih opsi",
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="w-full flex flex-col gap-2">
    <label v-if="label" class="text-sm font-bold text-[var(--gold-dark)]">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :value="modelValue"
        @change="
          emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
        :disabled="disabled"
        :class="[
          'w-full appearance-none bg-white text-black border p-4 rounded-xl outline-none transition-all',
          'hover:bg-grey-400 focus:ring-2 focus:ring-[var(--gold-main)] focus:border-[var(--gold-dark)]',
          error ? 'border-red-500' : 'border-gray-200',
          disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-60'
            : 'cursor-pointer',
        ]"
      >
        <option value="" disabled selected>{{ placeholder }}</option>

        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          class="hover:bg-[var(--gold-main)]"
        >
          {{ opt.label }}
        </option>
        <option value="other">Lainnya</option>
      </select>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>
