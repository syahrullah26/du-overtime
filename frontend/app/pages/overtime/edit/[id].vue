<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { OvertimeSubmission } from "~/types/auth";
import OvertimeForm from "~/components/ui/OvertimeForm.vue";

const route = useRoute();
const { getOvertimeById, loading } = useOvertime();
const submission = ref<OvertimeSubmission | null>(null);

const fetchDetail = async () => {
  const id = route.params.id as string;
  const data = await getOvertimeById(id);
  if (data) {
    submission.value = data;
  }
};

onMounted(fetchDetail);

const handleUpdateSuccess = () => {
  navigateTo("/overtime/view");
};

const handleCancel = () => {
  navigateTo("/overtime/view");
};
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Edit <span class="text-[var(--gold-main)]">Overtime</span>
        </h1>
        <p class="text-gray-500 font-medium">
          Update your overtime submission details
        </p>
      </div>
    </header>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold-main)]"
      ></div>
    </div>

    <div v-else-if="submission" class="max-w-4xl mx-auto">
      <OvertimeForm
        :initial-data="submission"
        :is-edit="true"
        @submit="handleUpdateSuccess"
        @cancel="handleCancel"
      />
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-400 italic">Submission not found.</p>
      <NuxtLink to="/overtime/view" class="text-[var(--gold-main)] font-bold mt-4 inline-block hover:underline">
        Back to list
      </NuxtLink>
    </div>
  </div>
</template>