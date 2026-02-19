<script setup lang="ts">
const route = useRoute();
const userId = computed(() => route.params.id as string);
const { fetchUserById, updateUser, userSelected, loading } = useUser();
const loadingForm = ref(false);

// form state
const form = reactive({
  id: userId.value || "",
  name: "",
  email: "",
  role: "",
});

const loadData = async () => {
  if (userId.value) {
    await fetchUserById(userId.value);
  }
};

// update form dari data yang ada sebelumnya
watch(
  userSelected,
  (newVal) => {
    if (newVal) {
      form.id = userId.value;
      form.name = newVal.name || "";
      form.email = newVal.email || "";
      form.role = newVal.role || "";
    }
  },
  { immediate: true },
);

// update profile
const updateProfile = async () => {
  loadingForm.value = true;
  try {
    const response = await updateUser(form);
    if (response) {
      await fetchUserById(userId.value);
      alert("Profile updated successfully!");
    }
  } catch (error: any) {
    console.error("Error updating profile:", error.data || error.message);
  } finally {
    loadingForm.value = false;
  }
};

onMounted(loadData);
watch(userId, loadData);
</script>

<template>
  <div
    class="min-h-screen bg-[#F8F9FD] p-4 md:p-12 font-inter overflow-x-hidden"
  >
    <div class="max-w-5xl mx-auto">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center min-h-[500px]"
      >
        <div class="relative w-20 h-20">
          <div
            class="absolute inset-0 border-4 border-amber-100 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-t-[var(--gold-dark)] rounded-full animate-spin"
          ></div>
        </div>
        <p
          class="mt-6 text-gray-400 font-bold tracking-widest uppercase text-[10px] animate-pulse"
        >
          Synchronizing Dewa Systems...
        </p>
      </div>

      <div v-else-if="userSelected" class="space-y-10">
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
                  >Profile</NuxtLink
                >
                <span class="mx-2 text-gray-300">/</span>
                <span
                  class="text-[10px] font-black text-gray-900 tracking-widest uppercase"
                  >Account Settings</span
                >
              </div>
              <h1
                class="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-[0.8]"
              >
                Profile
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-dark)] to-amber-500"
                  >Settings</span
                >
              </h1>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div
            class="lg:col-span-4 lg:sticky lg:top-12 h-fit"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div
              class="bg-white p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center group"
            >
              <div class="relative">
                <div
                  class="absolute -inset-4 bg-gradient-to-tr from-[var(--gold-dark)] to-amber-100 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-700"
                ></div>

                <div
                  class="relative w-48 h-48 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                >
                  <img
                    :src="
                      userSelected.avatar ||
                      `https://ui-avatars.com/api/?name=${userSelected.name}&background=111&color=fff&size=300`
                    "
                    class="w-full h-full object-cover"
                  />
                  <label
                    class="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <div
                      class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2"
                    >
                      <span class="text-2xl">📸</span>
                    </div>
                    <span
                      class="text-[10px] text-white font-black uppercase tracking-widest"
                      >Update Photo</span
                    >
                    <!-- <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleAvatarChange"
                    /> -->
                  </label>
                </div>
              </div>

              <div class="mt-8 text-center">
                <div
                  class="px-4 py-1 bg-amber-50 rounded-full mb-3 inline-block"
                >
                  <span
                    class="text-[10px] font-black text-amber-700 uppercase tracking-widest"
                    >{{ userSelected.role }}</span
                  >
                </div>
                <h3 class="text-2xl font-black text-gray-900 tracking-tight">
                  {{ userSelected.name }}
                </h3>
                <p class="text-sm font-medium text-gray-400 mt-1">
                  {{ userSelected.email }}
                </p>
              </div>

              <div class="w-full mt-8 pt-8 border-t border-gray-50">
                <div class="flex justify-between items-center mb-2">
                  <span
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                    >Profile Safety</span
                  >
                  <span
                    class="text-[10px] font-black text-green-500 uppercase font-inter"
                    >Verified</span
                  >
                </div>
                <div
                  class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-[var(--gold-dark)] w-full rounded-full transition-all duration-1000"
                    data-aos="slide-right"
                    data-aos-delay="600"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="lg:col-span-8 space-y-8"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div
              class="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
            >
              <form @submit.prevent="updateProfile" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div class="md:col-span-2">
                    <BaseLabel
                      label="Full Identification Name"
                      class="mb-3 block text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]"
                    />
                    <BaseInput
                      v-model="form.name"
                      placeholder="Type your official name..."
                    />
                  </div>

                  <div>
                    <BaseLabel
                      label="Registered Email"
                      class="mb-3 block text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]"
                    />
                    <BaseInput v-model="form.email" disabled />
                  </div>

                  <div>
                    <BaseLabel
                      label="Organizational Role"
                      class="mb-3 block text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]"
                    />
                    <BaseInput v-model="form.role" disabled />
                  </div>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4"
                >
                  <NuxtLink
                    to="/profile"
                    class="text-sm font-black text-gray-400 border border-black/50 hover:border-red-500 py-4 px-8 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all tracking-widest uppercase"
                  >
                    Discard Changes
                  </NuxtLink>

                  <div class="flex gap-4 w-full sm:w-auto">
                    <BaseButton
                      :label="loadingForm ? 'Updating...' : 'Update Profile'"
                      type="submit"
                      :disabled="loadingForm"
                      variant="primary"
                      class="!rounded-2xl !h-14 !px-12 !text-white !font-black !uppercase !tracking-widest !shadow-2xl shadow-gray-200 transition-transform active:scale-95 flex-1 sm:flex-none"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div
              class="p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] text-white flex items-center justify-between"
              data-aos="zoom-in-up"
              data-aos-delay="800"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl"
                >
                  🛡️
                </div>
                <div>
                  <p class="text-xs font-black uppercase tracking-widest">
                    Security Tip
                  </p>
                  <p
                    class="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter"
                  >
                    Maintain your cyber fortress.
                  </p>
                </div>
              </div>
              <NuxtLink
                :to="{
                  name: 'profile-password-id',
                  params: { id: userSelected.id },
                }"
              >
                <BaseButton
                  label="Update Pass"
                  variant="outline"
                  class="!border-white/20 !text-white !text-[10px] !h-10 !rounded-xl hover:!bg-white/10 !px-4"
                />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-32" data-aos="zoom-in">
        <div
          class="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-[2.5rem] mb-6 animate-bounce"
        >
          <span class="text-4xl text-red-500 italic font-black">!</span>
        </div>
        <h2 class="text-4xl font-black text-gray-900 tracking-tight uppercase">
          Access Denied
        </h2>
        <p
          class="text-gray-400 max-w-sm mx-auto mt-4 font-medium uppercase text-[10px] tracking-widest"
        >
          Digital Entity Not Found
        </p>
        <div class="mt-10">
          <BaseButton
            label="Return to Hub"
            @click="$router.push('/profile')"
            variant="primary"
            class="!rounded-2xl !bg-black !px-10"
          />
        </div>
      </div>
    </div>
  </div>
</template>
