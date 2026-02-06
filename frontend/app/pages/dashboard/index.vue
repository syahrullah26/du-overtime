<script setup lang="ts">
// Kita asumsikan Anda memiliki store atau composable untuk mengelola Auth
// Jika belum, ini adalah simulasi logika pengecekan role
const auth = {
  user: {
    role: "EMPLOYEE", // Ini nantinya dinamis dari API NestJS/JWT
  },
};

// Gunakan definePageMeta untuk memastikan user harus login sebelum masuk sini
// definePageMeta({
//   middleware: "auth", // Pastikan Anda sudah membuat middleware auth
// });

onMounted(() => {
  const role = auth.user.role;

  // Logika Redirect berdasarkan Role
  if (role === "EMPLOYEE") {
    navigateTo("/dashboard/employee");
  } else if (role === "PIC") {
    navigateTo("/dashboard/pic");
  } else if (role === "C_LEVEL") {
    navigateTo("/dashboard/clevel");
  } else if (role === "HRD") {
    navigateTo("/dashboard/hrd");
  } else if (role === "FINANCE") {
    navigateTo("/dashboard/finance");
  } else {
    navigateTo("/login");
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#C5A059] mb-4"
    ></div>
    <p class="text-gray-500 font-medium animate-pulse">
      Menyiapkan Dashboard Dewa Trident...
    </p>
  </div>
</template>
