<script setup lang="ts">
import { useUser } from "~/composables/useUser";

const { userState } = useAuth();
const { fetchUsersByRole } = useUser();

const picOptions = ref([]);
const clevelOptions = ref([]);

const { pending } = useAsyncData("load-roles", async () => {
  if (userState.value) {
    const [pics, clevels] = await Promise.all([
      fetchUsersByRole("pic"),
      fetchUsersByRole("c-level"),
    ]);
    picOptions.value = pics;
    clevelOptions.value = clevels;
  }
  return true;
});

//ambil data user login
const name = computed(() => userState.value?.name);
const role = computed(() => userState.value?.role);

const form = ref({
  name: "",
  position: "",
  date: "",
  startTime: "",
  endTime: "",
  reason: "",
  pic: "",
  clevel: "",
});
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
          />
        </div>
        <div class="group">
          <BaseLabel label="Jam Mulai" />
          <BaseInput label="jam mulai" type="time" placeholder="Jam Mulai" />
        </div>
        <div class="group">
          <BaseLabel label="Jam Selesai" />
          <BaseInput
            label="jam selesai"
            type="time"
            placeholder="Jam Selesai"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mx-4 my-4">
        <BaseTextArea label="alasan" placeholder="Alasan" class="mb-4 mr-4" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 my-4">
        <BaseSelect
          v-model="form.pic"
          label="Pilih PIC"
          placeholder="Pilih PIC Overtime"
          :options="picOptions"
        />
        <BaseSelect
          v-model="form.clevel"
          label="Pilih C-Level"
          placeholder="Pilih C-Level Overtime"
          :options="clevelOptions"
        />
      </div>
      <div class="flex justify-center items-center gap-2 my-4">
        <BaseButton label="Submit" variant="primary" type="submit" />
        <BaseButton label="Cancel" variant="secondary" type="button" />
      </div>
    </div>
  </div>
</template>
