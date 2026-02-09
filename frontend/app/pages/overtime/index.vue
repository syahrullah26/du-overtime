<script setup lang="ts">
const userAuth = {
  id: 1,
  name: "Manusia 1",
  jabatan: "Jabatan 1",
};

const pic = [
  {
    id: 1,
    label: "Manusia 1",
    value: "manusia1",
  },
  {
    id: 2,
    label: "Manusia 2",
    value: "manusia2",
  },
  {
    id: 3,
    label: "Manusia 4",
    value: "manusia4",
  },
  {
    id: 4,
    label: "Manusia 4",
    value: "manusia4",
  },
];

const clevel = [
  {
    id: 1,
    label: "C-Level 1",
    value: "clevel1",
  },
  {
    id: 2,
    label: "C-Level 2",
    value: "clevel2",
  },
  {
    id: 3,
    label: "C-Level 3",
    value: "clevel3",
  },
];
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
          v-model="userAuth.name"
          readonly
          disabled
        />
        <BaseInput
          label="jabatan"
          type="text"
          placeholder="Jabatan"
          v-model="userAuth.jabatan"
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
          :options="pic"
        />
        <BaseSelect
          v-model="form.clevel"
          label="Pilih C-Level"
          placeholder="Pilih C-Level Overtime"
          :options="clevel"
        />
      </div>
      <div class="flex justify-center items-center gap-2 my-4">
        <BaseButton label="Submit" variant="primary" type="submit" />
        <BaseButton label="Cancel" variant="secondary" type="button" />
      </div>
    </div>
  </div>
</template>
