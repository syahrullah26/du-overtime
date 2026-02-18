<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { type OvertimeLog, type PaginatedResponse } from "~/types/auth";

const { userState } = useAuth();

const logs = ref<OvertimeLog[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);

const fetchLogs = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await useApiFetch<PaginatedResponse<OvertimeLog>>(`/overtime-logs?page=${page}`);
    logs.value = response.data;
    currentPage.value = response.current_page;
    lastPage.value = response.last_page;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (userState.value?.role !== 'SUPERADMIN') {
    navigateTo('/');
    return;
  }
  fetchLogs();
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'SUBMIT': return 'text-blue-600 bg-blue-50';
    case 'APPROVE': return 'text-green-600 bg-green-50';
    case 'REJECT': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Overtime <span class="text-[var(--gold-main)]">Logs</span>
        </h1>
        <p class="text-gray-500 font-medium font-inter">
          History of all overtime submission activities
        </p>
      </div>
    </header>

    <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <div v-if="isLoading" class="p-20 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold-main)]"></div>
      </div>

      <div v-else-if="logs.length === 0" class="p-20 text-center text-gray-500">
        No logs found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Change</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(log.created_at) }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-800">{{ log.action_by_user?.name || log.action_by }}</span>
                  <span class="text-xs text-gray-500">{{ log.action_by_user?.role }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider', getActionColor(log.action)]">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-xs truncate max-w-[200px]">
                  <span v-if="log.old_status" class="text-gray-400">{{ log.old_status }}</span>
                  <span v-if="log.old_status" class="text-gray-300">→</span>
                  <span class="font-semibold text-gray-700">{{ log.new_status }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-500 max-w-xs truncate" :title="log.note || ''">{{ log.note || '-' }}</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
          <button 
            @click="fetchLogs(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            @click="fetchLogs(currentPage + 1)" 
            :disabled="currentPage === lastPage"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
