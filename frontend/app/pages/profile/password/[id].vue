<script setup lang="ts">
const route = useRoute();
const userId = computed(() => route.params.id as string);
const { fetchUserById, updatePassword, userSelected, loading } = useUser();

const passwordForm = reactive({
  id: userId.value || "",
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const resetForm = () => {
  passwordForm.current_password = "";
  passwordForm.new_password = "";
  passwordForm.new_password_confirmation = "";
};

const handleChangePassword = async () => {
  try {
    const response = await updatePassword(passwordForm);
    if (response) {
      resetForm();
      alert("Password Update Successfully");
    }
  } catch (error: any) {
    console.error("Error Update Password:", error.data || error.message);
    const message = error.data?.message || "Failed to update password. Please try again.";
    alert(message);
  }
};
</script>
<template>
  <div class="space-y-8">
    <div class="relative" data-aos="fade-down" data-aos-duration="1000">
      <h2
        class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none"
      >
        Change
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-main)]"
          >Password</span
        >
      </h2>
      <p
        class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2"
      >
        Update your digital credentials
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-4" data-aos="fade-right" data-aos-delay="200">
        <div
          class="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-full"
        >
          <div
            class="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-[var(--gold-dark)] opacity-10 rounded-full blur-3xl"
          ></div>

          <div class="relative z-10 flex flex-col h-full">
            <div
              class="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl mb-6"
            >
              🛡️
            </div>
            <h3 class="text-xl font-black uppercase tracking-tight mb-4">
              Account Protection
            </h3>
            <p class="text-gray-400 text-xs leading-relaxed mb-8">
              A strong password helps prevent unauthorized access to your
              account and personal information.
            </p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8" data-aos="fade-left" data-aos-delay="400">
        <div
          class="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
        >
          <form @submit.prevent="handleChangePassword" class="space-y-10">
            <div class="space-y-3">
              <BaseLabel
                label="Verify Current Password"
                class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1"
              />
              <div class="relative group">
                <BaseInput
                  v-model="passwordForm.current_password"
                  type="password"
                  placeholder="••••••••••••"
                />
                <span
                  class="absolute right-5 top-4 opacity-30 group-focus-within:opacity-100 transition-opacity"
                  >🔒</span
                >
              </div>
            </div>

            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-gray-100"></div>
              <span
                class="flex-shrink mx-4 text-gray-300 text-xs tracking-widest font-black uppercase"
                >New Credentials</span
              >
              <div class="flex-grow border-t border-gray-100"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <BaseLabel
                  label="New Secure Password"
                  class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1"
                />
                <BaseInput
                  v-model="passwordForm.new_password"
                  type="password"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div class="space-y-3">
                <BaseLabel
                  label="Re-type New Password"
                  class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1"
                />
                <BaseInput
                  v-model="passwordForm.new_password_confirmation"
                  type="password"
                  placeholder="Match password"
                />
              </div>
            </div>

            <div
              class="bg-amber-50 rounded-2xl p-4 border border-amber-100/50 flex items-start gap-4"
            >
              <span class="text-xl">💡</span>
              <p
                class="text-[10px] text-amber-800 font-medium leading-relaxed uppercase tracking-tight"
              >
                Changing your password will log you out from all other active
                sessions for security reasons.
              </p>
            </div>

            <div
              class="flex flex-col sm:flex-row items-center justify-end gap-6 pt-6 border-t border-gray-50"
            >
              <button
                type="button"
                @click="resetForm"
                class="text-[10px] font-black text-red-400 hover:text-red-500 border border-red-500 hover:border-red-600 px-4 py-4 hover:bg-red-50 rounded-2xl uppercase tracking-widest transition-all"
              >
                Clear Form
              </button>

              <BaseButton
                label="Confirm Change"
                type="submit"
                class="!rounded-2xl !h-14 !px-12 !bg-black hover:!bg-gray-800 !text-white !font-black !uppercase !tracking-widest !shadow-2xl shadow-gray-200 transition-all active:scale-95 w-full sm:w-auto"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
