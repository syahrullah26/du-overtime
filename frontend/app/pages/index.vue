<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { login } = useAuth()

//state
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

//handle pengajuan
const handleLogin = async () => {
  //reset error
  errorMessage.value = ''

  //vallidasi
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  //email validasi
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  isLoading.value = true

  try {
    const result = await login(email.value, password.value)

    if (!result.success) {
      errorMessage.value = result.error || 'Login failed'
    }
    //kalo sukses otomatis redirect
  } catch (error) {
    errorMessage.value = 'error'
  } finally {
    isLoading.value = false
  }
}

//handle enter press
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>
<template>
  <section class="w-full max-w-md mx-auto">
    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Error Message -->
      <div 
        v-if="errorMessage" 
        class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Email Input -->
      <BaseInput 
        v-model="email"
        label="Email" 
        type="email" 
        placeholder="your.email@dewaunited.com"
        :disabled="isLoading"
        @keypress="handleKeyPress"
        required
      />

      <!-- Password Input -->
      <BaseInput 
        v-model="password"
        label="Password" 
        type="password" 
        placeholder="Enter your password"
        :disabled="isLoading"
        @keypress="handleKeyPress"
        required
      />

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input 
            type="checkbox" 
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" class="text-sm text-blue-600 hover:text-blue-800">
          Forgot password?
        </a>
      </div>

      <!-- Submit Button -->
      <BaseButton 
        :label="isLoading ? 'Signing in...' : 'Sign In'" 
        variant="primary" 
        type="submit"
        :disabled="isLoading"
        class="w-full"
      />

      <!-- Demo Credentials Info -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
        <div class="grid grid-cols-1 gap-2 text-xs text-blue-800">
          <div class="flex justify-between">
            <span class="font-medium">Finance:</span>
            <span>finance@dewaunited.com</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">HRD:</span>
            <span>hrd@dewaunited.com</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">C-Level:</span>
            <span>clevel@dewaunited.com</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">PIC:</span>
            <span>pic.it@dewaunited.com</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Employee:</span>
            <span>faris@dewaunited.com</span>
          </div>
          <div class="col-span-1 mt-2 pt-2 border-t border-blue-300">
            <span class="font-medium">Password (all):</span>
            <span class="ml-2">password123</span>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>