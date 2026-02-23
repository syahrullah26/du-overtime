<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { OvertimeSubmission } from "~/types/auth";

interface SelectOption {
  label: string;
  value: string | number;
}

const props = defineProps<{
  initialData?: OvertimeSubmission;
  isEdit?: boolean;
}>();

const emit = defineEmits(["submit", "cancel"]);

const { userState } = useAuth();
const { fetchUsersByRole, fetchAllUsers } = useUser();
const { submitOvertime, updateOvertime } = useOvertime();

const isLoading = ref(false);
const errorMessage = ref("");

const picOptions = ref<SelectOption[]>([]);
const clevelOptions = ref<SelectOption[]>([]);

//get nama dan role
const name = computed(() => userState.value?.name || "");
const role = computed(() => userState.value?.role || "");

//state form
const form = ref({
  name: userState.value?.name || "",
  position: userState.value?.role || "",
  date: "",
  startTime: "",
  endTime: "",
  reason: "",
  pic: "" as string | number,
  clevel: "" as string | number,
  otherPicId: "" as string | number,
  otherClevelId: "" as string | number,
});

//Fetch data pic dan clevel
// Tambahkan state untuk kontrol UI
const isOtherPic = ref(false);
const isOtherClevel = ref(false);

// State untuk menyimpan daftar semua user untuk pencarian manual
const allUsers = ref<SelectOption[]>([]);

// Fetch user data dan select option manual
const fetchRoles = async () => {
  try {
    const response = await fetchAllUsers();

    const allDataRaw = response?.users || response || [];

    const pics = allDataRaw.filter((u: any) => u.role === "PIC");
    const clevels = allDataRaw.filter(
      (u: any) => u.role === "CLEVEL" || u.role === "C_LEVEL",
    );

    const otherOption = {
      label: "--- LAINNYA (Pilih Manual) ---",
      value: "OTHER",
    };

    const mapToOption = (users: any[]) =>
      users.map((u) => ({ label: u.name, value: u.id }));

    picOptions.value = [...mapToOption(pics), otherOption];
    clevelOptions.value = [...mapToOption(clevels), otherOption];

    allUsers.value = mapToOption(allDataRaw);

    return true;
  } catch (err) {
    console.error("Error loading roles:", err);
    return false;
  }
};
const { pending } = await useAsyncData("load-roles", () => fetchRoles(), {
  server: false,
  lazy: true,
});

//initial data di edit mode
onMounted(() => {
  if (props.initialData) {
    const data = props.initialData;
    form.value = {
      name: data.employee?.name || userState.value?.name || "",
      position: data.employee?.role || userState.value?.role || "",
      date: data.date?.split("T")[0] || "",
      startTime: data.start_time?.split(" ")?.[1]?.substring(0, 5) || "",
      endTime: data.end_time?.split(" ")?.[1]?.substring(0, 5) || "",
      reason: data.reason || "",
      pic: data.pic_id ? Number(data.pic_id) : "",
      clevel: data.clevel_id ? Number(data.clevel_id) : "",
      otherPicId: "",
      otherClevelId: "",
    };
  }
});

const handleSubmit = async () => {
  errorMessage.value = "";
  const finalPicId =
    form.value.pic === "OTHER" ? form.value.otherPicId : form.value.pic;
  const finalClevelId =
    form.value.clevel === "OTHER"
      ? form.value.otherClevelId
      : form.value.clevel;
  //validasi form
  if (
    !form.value.date ||
    !form.value.startTime ||
    !form.value.endTime ||
    !form.value.reason ||
    !finalPicId ||
    !finalClevelId
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
      start_time: `${form.value.date} ${form.value.startTime}:00`,
      end_time: `${form.value.date} ${form.value.endTime}:00`,
      reason: form.value.reason,
      pic_id: Number(finalPicId),
      clevel_id: Number(finalClevelId),
    };

    let result;
    if (props.isEdit && props.initialData?.id) {
      result = await updateOvertime(props.initialData.id, overtimePayload);
    } else {
      result = await submitOvertime(overtimePayload);
    }

    if (result) {
      emit("submit", result);
    }
  } catch (error: any) {
    console.error("Submit error:", error);
    errorMessage.value =
      error.response?._data?.message ||
      "Failed to submit overtime. Please check your data.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
  >
    <div class="p-8 border-b border-gray-50 flex justify-between items-center">
      <h3 class="font-bold text-xl text-gray-800">
        {{ isEdit ? "Edit Pengajuan" : "Form Pengajuan" }}
      </h3>
    </div>
    <form @submit.prevent="handleSubmit">
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg w-auto mx-4 mt-4"
      >
        <p class="text-sm">⚠️ {{ errorMessage }} !</p>
      </div>
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
        <div class="flex flex-col gap-2">
          <BaseSelect
            v-model="form.pic"
            label="Pilih PIC"
            placeholder="Pilih PIC Overtime"
            :options="picOptions"
            required
          />
          <BaseSelect
            v-if="form.pic === 'OTHER'"
            v-model="form.otherPicId"
            label="Cari PIC Pengganti"
            placeholder="Ketik nama user..."
            :options="allUsers"
            required
            class="mt-2 border-l-4 border-[var(--gold-main)] pl-2"
          />
        </div>

        <div class="flex flex-col gap-2">
          <BaseSelect
            v-model="form.clevel"
            label="Pilih C-Level"
            placeholder="Pilih C-Level Overtime"
            :options="clevelOptions"
            required
          />
          <BaseSelect
            v-if="form.clevel === 'OTHER'"
            v-model="form.otherClevelId"
            label="Cari C-Level Pengganti"
            placeholder="Ketik nama C-Level..."
            :options="allUsers"
            required
            class="mt-2 border-l-4 border-[var(--gold-main)] pl-2"
          />
        </div>
      </div>
      <div class="flex justify-center items-center gap-2 my-4">
        <BaseButton
          :label="isLoading ? 'Loading...' : isEdit ? 'Update' : 'Submit'"
          variant="primary"
          :disabled="isLoading"
          type="submit"
        />
        <BaseButton
          label="Cancel"
          variant="secondary"
          type="button"
          @click="emit('cancel')"
        />
      </div>
    </form>
  </div>
</template>
