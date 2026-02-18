<script setup lang="ts">
interface SelectOption {
  label: string;
  value: string | number;
}

const { userState } = useAuth();
const { fetchUsersByRole } = useUser();
const { submitOvertime } = useOvertime();

// form utils
const isLoading = ref(false);
const errorMessage = ref("");

const picOptions = ref<SelectOption[]>([]);
const clevelOptions = ref<SelectOption[]>([]);

//get name dan role
const name = computed(() => userState.value?.name || "");
const role = computed(() => userState.value?.role || "");

// Form State
const form = ref({
  name: userState.value?.name || "",
  position: userState.value?.role || "",
  date: "",
  startTime: "",
  endTime: "",
  reason: "",
  pic: "",
  clevel: "",
});

// Fetch data PIC dan C-Level
const { pending } = useAsyncData(
  "load-roles",
  async () => {
    if (userState.value) {
      const [pics, clevels] = await Promise.all([
        fetchUsersByRole("PIC"),
        fetchUsersByRole("C_LEVEL"),
      ]);
      picOptions.value = pics;
      clevelOptions.value = clevels;
    }
    return true;
  },
  {
    server: false,
  },
);

const handleSubmit = async () => {
  console.log("Data yang akan dikirim:", form.value);
  errorMessage.value = "";
  //validasi form
  if (
    !form.value.date ||
    !form.value.startTime ||
    !form.value.endTime ||
    !form.value.reason ||
    !form.value.clevel ||
    !form.value.pic
  ) {
    errorMessage.value = "Please fill in all fields";
    return;
  }
  isLoading.value = true;
  try {
    //buat payload
    const overtimePayload = {
      name: form.value.name,
      role: form.value.position,
      date: form.value.date,
      start_time: form.value.startTime,
      end_time: form.value.endTime,
      reason: form.value.reason,
      pic_id: form.value.pic,
      clevel_id: form.value.clevel,
    };
    const result = await submitOvertime(overtimePayload);

    if (!result.success) {
      errorMessage.value = result.error || "Submission failed";
    }
  } catch (error) {
    errorMessage.value = "error";
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="min-h-screen bg-[var(--white-bone)] p-8">
    <header class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
          Dewa <span class="text-[var(--gold-main)]">Overtime</span>
        </h1>
        <p class="text-gray-500 font-medium font-inter">
          Sistem Pengajuan Lembur - Dewa United Indonesia
        </p>
      </div>
    </header>

    <div
      class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div
        class="p-8 border-b border-gray-50 flex justify-between items-center"
      >
        <h3 class="font-bold text-xl text-gray-800">Form Pengajuan</h3>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 my-4">
          <BaseInput
            label="nama"
            type="text"
            placeholder="Nama"
            v-model="name"
            readonly
            disabled
          />
          <BaseInput
            label="jabatan"
            type="text"
            placeholder="Jabatan"
            v-model="role"
            readonly
            disabled
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 mx-4 mb-4">
          <div class="group">
            <BaseLabel label="Tanggal" />
            <BaseInput
              label="tanggal"
              type="date"
              placeholder="Tanggal Overtime"
              v-model="form.date"
              required
            />
          </div>
          <div class="group">
            <BaseLabel label="Jam Mulai" />
            <BaseInput
              label="jam mulai"
              type="time"
              placeholder="Jam Mulai"
              v-model="form.startTime"
              required
            />
          </div>
          <div class="group">
            <BaseLabel label="Jam Selesai" />
            <BaseInput
              label="jam selesai"
              type="time"
              placeholder="Jam Selesai"
              v-model="form.endTime"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 mx-4 my-4">
          <BaseTextArea
            label="alasan"
            placeholder="Alasan"
            class="mb-4 mr-4"
            v-model="form.reason"
            :disabled="isLoading"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 my-4">
          <BaseSelect
            v-model="form.pic"
            label="Pilih PIC"
            placeholder="Pilih PIC Overtime"
            :options="picOptions"
            required
          />
          <BaseSelect
            v-model="form.clevel"
            label="Pilih C-Level"
            placeholder="Pilih C-Level Overtime"
            :options="clevelOptions"
            required
          />
        </div>
        <div class="flex justify-center items-center gap-2 my-4">
          <BaseButton
            :label="isLoading ? 'Loading...' : 'Submit'"
            variant="primary"
            :disabled="isLoading"
            type="submit"
          />
          <BaseButton label="Cancel" variant="secondary" type="button" />
        </div>
      </form>
    </div>
  </div>
</template>
