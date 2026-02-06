<script setup lang="ts"></script>
<template>
  <main
    class="min-h-screen bg-white-900/50 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      data-aos="fade-up"
    >
      <div class="text-center mb-8">
        <img src="/du-universal.png" alt="Logo" class="w-32 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-800">Login Dewa Overtime</h1>
        <p class="text-gray-500">Silakan masuk ke akun Anda</p>
      </div>
      <slot />
    </div>
  </main>
</template>
