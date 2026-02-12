<script setup lang="ts">
import { ref, reactive } from "vue";

interface Props {
  userAuth: any;
  picOptions?: Array<{ label: string; value: any }>;
  clevelOptions?: Array<{ label: string; value: any }>;
}

const props = defineProps<Props>();

const form = reactive({
  tanggal: "",
  jamMulai: "",
  jamSelesai: "",
  alasan: "",
  pic: "",
  clevel: "",
});

const emit = defineEmits(["submit", "cancel"]);

const handleSubmit = () => {
  emit("submit", { ...form });
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="w-full animate-in fade-in duration-500">
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
            label="Nama"
            type="text"
            placeholder="Nama"
            :model-value="props.userAuth.name"
            readonly
            disabled
          />
          <BaseInput
            label="Jabatan"
            type="text"
            placeholder="Jabatan"
            :model-value="props.userAuth.jabatan"
            readonly
            disabled
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 mx-4 mb-4">
          <div class="group">
            <BaseLabel label="Tanggal" />
            <BaseInput
              type="date"
              v-model="form.tanggal"
              placeholder="Tanggal Overtime"
            />
          </div>
          <div class="group">
            <BaseLabel label="Jam Mulai" />
            <BaseInput
              type="time"
              v-model="form.jamMulai"
              placeholder="Jam Mulai"
            />
          </div>
          <div class="group">
            <BaseLabel label="Jam Selesai" />
            <BaseInput
              type="time"
              v-model="form.jamSelesai"
              placeholder="Jam Selesai"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mx-4 my-4">
          <BaseTextArea
            label="Alasan"
            v-model="form.alasan"
            placeholder="Tuliskan alasan lembur..."
            class="mb-4 mr-4"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 my-4">
          <BaseSelect
            v-model="form.pic"
            label="Pilih PIC"
            placeholder="Pilih PIC Overtime"
            :options="props.picOptions || []"
          />
          <BaseSelect
            v-model="form.clevel"
            label="Pilih C-Level"
            placeholder="Pilih C-Level Overtime"
            :options="props.clevelOptions || []"
          />
        </div>

        <div class="flex justify-center items-center gap-2 my-8">
          <BaseButton
            label="Submit Pengajuan"
            variant="primary"
            type="submit"
          />
          <BaseButton
            label="Batal"
            variant="secondary"
            type="button"
            @click="handleCancel"
          />
        </div>
      </form>
    </div>
  </div>
</template>
