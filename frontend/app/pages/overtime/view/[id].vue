<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import type { OvertimeSubmission } from "~/types/auth";
import Stepper from "~/components/ui/Stepper.vue";
import StatsCard from "~/components/ui/StatsCard.vue";

const { userState } = useAuth();
const route = useRoute();
const { getOvertimeById, loading, approveOvertime, rejectOvertime } =
  useOvertime();

const submission = ref<OvertimeSubmission | null>(null);

const canApprove = computed(() => {
  if (!submission.value || !userState.value) return false;
  const role = userState.value.role;
  const status = submission.value.status;
  const picId = submission.value.pic_id;

  if (
    role === "EMPLOYEE" &&
    picId === userState.value.id &&
    status === "PENDING_PIC"
  ) {
    return true;
  } else {
    const allowedTransitions: Record<string, string> = {
      PENDING_PIC: "PIC",
      PENDING_C_LEVEL: "C_LEVEL",
      PENDING_HRD: "HRD",
    };

    return allowedTransitions[status] === role;
  }
});

const handleApprove = async () => {
  if (!submission.value) return;
  if (!confirm("Are you sure you want to approve this overtime?")) return;
  try {
    await approveOvertime(submission.value.id);
    await fetchDetail();
    alert("Overtime approved successfully");
  } catch (error) {
    console.error("Failed to approve overtime:", error);
    alert("Failed to approve overtime");
  }
};

const handleReject = async () => {
  if (!submission.value) return;
  const reason = prompt("Enter rejection reason:");
  if (reason === null) return;
  if (!reason.trim()) {
    alert("Reason is required for rejection");
    return;
  }
  try {
    await rejectOvertime(submission.value.id, reason);
    await fetchDetail();
    alert("Overtime rejected");
  } catch (error) {
    console.error("Failed to reject overtime:", error);
    alert("Failed to reject overtime");
  }
};

const fetchDetail = async () => {
  const id = route.params.id as string;
  const data = await getOvertimeById(id);
  if (data) {
    submission.value = data;
  }
};

console.log(submission);

const getStepperStatus = (
  item: OvertimeSubmission,
  level: "PIC" | "CLEVEL" | "HRD",
) => {
  const status = item.status;
  if (status === "COMPLETED") return "done";
  if (status === "REJECTED") return "error";

  if (level === "PIC") return status === "PENDING_PIC" ? "process" : "done";
  if (level === "CLEVEL") {
    if (status === "PENDING_PIC") return "pending";
    return status === "PENDING_C_LEVEL" ? "process" : "done";
  }
  if (level === "HRD") {
    if (status === "PENDING_HRD") return "process";
    return "pending";
  }
  return "pending";
};
onMounted(fetchDetail);

const stats = computed(() => {
  if (!submission.value) return [];
  return [
    {
      label: "Duration",
      value: `${Math.floor(submission.value.duration_min / 60)}h ${submission.value.duration_min % 60}m`,
      icon: "⏱️",
    },
    {
      label: "Status",
      value: submission.value.status.replace(/_/g, " "),
      icon: "📄",
    },
    {
      label: "Total Pay",
      value: formatCurrency(submission.value.total_pay),
      icon: "💰",
    },
  ];
});
</script>

<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12"
    >
      <div class="flex items-center gap-5">
        <NuxtLink
          @click.prevent="$router.back()"
          class="group flex items-center justify-center w-12 h-12 bg-white border border-gray-200 text-gray-600 rounded-2xl shadow-sm hover:shadow-md hover:border-[var(--gold-main)] hover:text-[var(--gold-main)] transition-all duration-300"
          title="Kembali"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </NuxtLink>

        <div>
          <h1
            class="text-3xl md:text-4xl font-black tracking-tight text-gray-900 leading-tight"
          >
            Overtime <span class="text-[var(--gold-main)]">Detail</span>
          </h1>
          <div class="flex items-center gap-2 mt-1">
            <span class="w-8 h-[2px] bg-[var(--gold-main)] rounded-full"></span>
            <p
              class="text-sm font-bold text-gray-400 uppercase tracking-widest"
            >
              Review Submission Details
            </p>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold-main)]"
      ></div>
    </div>

    <div v-else-if="submission" class="max-w-4xl mx-auto space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
      </div>

      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">
              Submission Information
            </h3>
            <p class="text-gray-500">
              Submitted on {{ formatDate(submission.created_at) }}
            </p>
          </div>
          <div
            :class="[
              'px-4 py-2 rounded-full text-sm font-bold',
              submission.status === 'COMPLETED'
                ? 'bg-green-100 text-green-700'
                : submission.status === 'REJECTED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700',
            ]"
          >
            {{ submission.status }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label
                class="text-xs font-black uppercase tracking-wider text-gray-400"
                >Employee</label
              >
              <p class="text-lg font-bold text-gray-800">
                {{ submission.employee?.name }}
              </p>
              <p class="text-gray-500">
                {{ submission.employee?.department?.name }}
              </p>
            </div>
            <div>
              <label
                class="text-xs font-black uppercase tracking-wider text-gray-400"
                >Date & Time</label
              >
              <p class="text-lg font-bold text-gray-800">
                {{ formatDate(submission.date) }}
              </p>
              <p class="text-gray-500">
                {{ formatTime(submission.start_time) }} -
                {{ formatTime(submission.end_time) }}
              </p>
            </div>
            <div>
              <label
                class="text-xs font-black uppercase tracking-wider text-gray-400"
                >Reason</label
              >
              <p class="text-gray-700 mt-2 bg-gray-50 p-4 rounded-xl italic">
                "{{ submission.reason }}"
              </p>
            </div>
            <div class="grid grid-cols-2 gap-8 border-t border-gray-100 pt-6">
              <div class="flex flex-col space-y-2">
                <label
                  class="text-[10px] font-black uppercase tracking-widest text-gray-400"
                >
                  PIC Overtime
                </label>
                <p class="text-base font-bold text-gray-800 leading-tight">
                  {{ submission.pic?.name || "Unassigned" }}
                </p>

                <div class="h-16 flex items-center">
                  <div
                    v-if="submission.status === 'PENDING_PIC'"
                    class="flex items-center gap-2"
                  >
                    <div
                      class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    ></div>
                    <p
                      class="text-xs font-bold text-red-500 uppercase tracking-tighter"
                    >
                      Waiting for Approval
                    </p>
                  </div>

                  <template v-else>
                    <img
                      :src="
                        getImageUrl(submission.pic?.signature) ||
                        'https://cdn-icons-png.flaticon.com/512/190/190411.png'
                      "
                      :class="[
                        submission.pic?.signature
                          ? 'w-24 object-contain'
                          : 'w-8 h-8 object-contain',
                        'transition-all duration-500',
                      ]"
                      alt="PIC Signature"
                    />
                  </template>
                </div>
              </div>

              <div class="flex flex-col space-y-2 border-l border-gray-50 pl-8">
                <label
                  class="text-[10px] font-black uppercase tracking-widest text-gray-400"
                >
                  C Level
                </label>
                <p class="text-base font-bold text-gray-800 leading-tight">
                  {{ submission.clevel?.name || "Unassigned" }}
                </p>

                <div class="h-16 flex items-center">
                  <div
                    v-if="submission.status === 'PENDING_PIC'"
                    class="text-xs text-gray-300 italic"
                  >
                    Menunggu PIC...
                  </div>

                  <div
                    v-else-if="submission.status === 'PENDING_C_LEVEL'"
                    class="flex items-center gap-2"
                  >
                    <div
                      class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    ></div>
                    <p
                      class="text-xs font-bold text-red-500 uppercase tracking-tighter"
                    >
                      Pending Review
                    </p>
                  </div>

                  <template v-else>
                    <img
                      :src="
                        getImageUrl(submission.clevel?.signature) ||
                        'https://cdn-icons-png.flaticon.com/512/190/190411.png'
                      "
                      :class="[
                        submission.clevel?.signature
                          ? 'w-24 object-contain'
                          : 'w-8 h-8 object-contain',
                        'transition-all duration-500',
                      ]"
                      alt="C-Level Signature"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-8">
            <div>
              <label
                class="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 block"
                >Progress</label
              >
              <Stepper
                :pic-status="getStepperStatus(submission, 'PIC')"
                :clevel-status="getStepperStatus(submission, 'CLEVEL')"
                :hrd-status="getStepperStatus(submission, 'HRD')"
              />
            </div>

            <div
              v-if="submission.rejection_reason"
              class="p-4 bg-red-50 border border-red-100 rounded-2xl"
            >
              <label
                class="text-xs font-black uppercase text-red-400 mb-1 block"
                >Rejection Reason</label
              >
              <p class="text-red-700 font-medium">
                {{ submission.rejection_reason }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="canApprove"
          class="mt-10 pt-8 border-t border-gray-50 flex justify-end gap-4"
        >
          <button
            @click="handleReject"
            class="px-8 py-3 bg-white border-2 border-red-500 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all"
          >
            Reject Submission
          </button>
          <button
            @click="handleApprove"
            class="px-8 py-3 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all hover:scale-105"
          >
            Approve Overtime
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-400 italic">Submission not found.</p>
      <NuxtLink
        to="/overtime/view"
        class="text-[var(--gold-main)] font-bold mt-4 inline-block hover:underline"
      >
        Back to list
      </NuxtLink>
    </div>
  </div>
</template>
