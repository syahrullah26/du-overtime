<script setup lang="ts">
import RegisterForm from "~/components/ui/RegisterForm.vue";

const handleSubmit = () => {
  navigateTo("/admin/user/register");
};

const handleCancel = () => {
  navigateTo("/admin/user/register");
};
</script>

<template>
  <div
    class="min-h-screen bg-[#F8F9FD] p-4 md:p-12 font-inter overflow-x-hidden"
  >
    <div class="max-w-5xl mx-auto">
      <div class="space-y-10">
        <header class="relative" data-aos="fade-down" data-aos-duration="800">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div class="space-y-2">
              <div
                class="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white shadow-sm mb-4"
              >
                <NuxtLink
                  to="/profile"
                  class="text-[10px] font-black text-gray-400 hover:text-[var(--gold-dark)] transition-colors tracking-widest uppercase"
                  >Data List</NuxtLink
                >
                <span class="mx-2 text-gray-300">/</span>
                <span
                  class="text-[10px] font-black text-gray-900 tracking-widest uppercase"
                  >Register Account</span
                >
              </div>
              <h1
                class="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-[0.8]"
              >
                Register New
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-main)]"
                  >Employee</span
                >
              </h1>
            </div>
          </div>
        </header>
        <RegisterForm @submit="handleSubmit" @cancel="handleCancel" />
      </div>
    </div>
  </div>
</template>
