<script setup lang="ts">
import ProfileCard from "~/components/ui/ProfileCard.vue";

const { userState } = useAuth();
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

    <div v-if="userState">
      <ProfileCard v-bind="userState" />
    </div>
  </div>
</template>
