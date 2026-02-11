<script setup lang="ts">
import type { User } from '~/types/auth';
definePageMeta({
  middleware: 'auth',
})

const { getCurrentUser } = useAuth()

//get user dari localstorage
const user = ref<User | null>(null)

onMounted(() => {
  //get current usern
  user.value = getCurrentUser()

  if (user.value?.role) {
    //map role ke route
    const roleRoutes: Record<string, string> = {
      'FINANCE': '/dashboard/finance',
      'HRD': '/dashboard/hrd',
      'PIC': '/dashboard/pic',
      'C_LEVEL': '/dashboard/clevel',
      'EMPLOYEE': '/dashboard/employee',
    }

    const targetRoute = roleRoutes[user.value.role] || '/dashboard/employee'
    
    setTimeout(() => {
      navigateTo(targetRoute)
    }, 800)
  } else {
    //kl ga ada user data balik lg ke login
    navigateTo('/')
  }
})

</script>

<template>
  <div
    class="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#C5A059] mb-4"
    ></div>
    <p class="text-gray-500 font-medium animate-pulse">
      Menyiapkan Dashboard Dewa Overtime...
    </p>
    <!-- opsional, jd ada nama user ny -->
    <p v-if="user" class="text-gray-400 text-sm mt-2">
      Selamat datang, {{ user.name }}
    </p>
  </div>
</template>
