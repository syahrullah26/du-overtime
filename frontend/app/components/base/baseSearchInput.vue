<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  widthClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search data...",
  widthClass: "w-full md:w-72",
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div :class="['group relative', widthClass]">
    <div
      class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="w-4 h-4 text-gray-400 group-focus-within:text-amber-500 transition-colors"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </div>

    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder:text-gray-400 text-gray-700 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all duration-200 shadow-sm"
    />

    <button
      v-if="modelValue"
      @click="emit('update:modelValue', '')"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
