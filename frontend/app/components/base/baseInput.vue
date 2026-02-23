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
    | "time"
    | "file";
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <div v-if="type != 'file'" class="w-full">
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
  <div v-else class="w-full mb-4">
    <label
      :class="[
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:border-[var(--gold-main)] hover:bg-gray-50',
        'relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl transition-all group',
      ]"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          class="w-8 h-8 mb-3 text-gray-400 group-hover:text-[var(--gold-main)] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>

        <p class="mb-2 text-sm text-gray-500">
          <span class="font-black text-[var(--gold-dark)]"
            >Click to upload</span
          >
          or drag and drop
        </p>
        <p class="text-xs text-gray-400 uppercase tracking-tighter">
          {{
            model && typeof model !== "string"
              ? (model as any).name
              : "PDF, PNG, JPG (MAX. 10MB)"
          }}
        </p>
      </div>

      <input
        type="file"
        class="hidden"
        :disabled="disabled"
        @change="(e: any) => (model = e.target.files[0])"
      />
    </label>
  </div>
</template>
