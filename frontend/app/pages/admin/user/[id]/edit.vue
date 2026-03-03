<script setup lang="ts">
import type { EditProfilePayload } from "~/types/payload";
import { roleOptions } from "~/constants/user";

const route = useRoute();
const userId = computed(() => route.params.id as string);

const {
  fetchUserById,
  updateUser,
  fetchAllDept,
  allDept,
  userSelected,
  loading,
} = useUser();
const loadingForm = ref(false);

const form = reactive({
  id: Number(userId.value) || null,
  dept_id: userSelected.value?.dept_id || null,
  role: userSelected.value?.role || "",
});

watch(
  userSelected,
  (newVal) => {
    if (newVal) {
      form.dept_id = newVal.dept_id || null;
      form.role = newVal.role || "";
    }
  },
  { immediate: true },
);

const updateProfile = async () => {
  if (!userSelected.value) return;
  loadingForm.value = true;
  try {
    const payload: Partial<EditProfilePayload> & { id: number } = {
      id: Number(form.id),
    };

    if (form.role !== userSelected.value.role) {
      payload.role = form.role;
    }

    if (Number(form.dept_id) !== Number(userSelected.value.dept_id)) {
      payload.dept_id = Number(form.dept_id);
    }

    if (Object.keys(payload).length > 1) {
      const response = await updateUser(payload as EditProfilePayload);

      if (response) {
        alert("Update successful!");
        await fetchUserById(userId.value);
      }
    } else {
      alert("No changes detected.");
    }
  } catch (error: any) {
    console.error("Error updating profile:", error.data || error.message);
    alert("An Error Occured :" + error.message || "Failed to update profile.");
  } finally {
    loadingForm.value = false;
  }
};

onMounted(() => {
  fetchUserById(userId.value);
  fetchAllDept();
});
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
                  to="/admin/user"
                  class="text-[10px] font-black text-gray-400 hover:text-[var(--gold-dark)] transition-colors tracking-widest uppercase"
                  >Data List</NuxtLink
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
                  class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-main)]"
                  >Settings</span
                >
              </h1>
            </div>
          </div>
        </header>
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
                    label="Select Department"
                    class="mb-3 block text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]"
                  />
                  <BaseSelect
                    v-model="form.dept_id"
                    :options="
                      allDept.map((d) => ({ value: d.id, label: d.name }))
                    "
                    placeholder="Select Department"
                  />
                </div>
                <div class="md:col-span-2">
                  <BaseLabel
                    label="Select Role"
                    class="mb-3 block text-gray-400 uppercase tracking-[0.2em] font-black text-[10px]"
                  />
                  <BaseSelect
                    v-model="form.role"
                    :options="roleOptions"
                    placeholder="Select Role"
                  />
                  <div
                    class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4"
                  >
                    <NuxtLink
                      @click.prevent="$router.back()"
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
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
