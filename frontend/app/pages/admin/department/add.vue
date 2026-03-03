<script setup lang="ts">
const router = useRouter();
const { createDepartment } = useDepartment();
const loadingForm = ref(false);
const errorMessage = ref("");

const form = ref({
  name: "",
});

const handleSubmit = async () => {
  try {
    loadingForm.value = true;
    errorMessage.value = "";

    const response = await createDepartment(form.value);
    if (response) {
      errorMessage.value = "Created Successfully!";
      form.value.name = "";

      setTimeout(() => {
        router.push("/admin/department");
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Error creating department";
    console.error("Full Error:", error);
  } finally {
    loadingForm.value = false;
  }
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
                  to="/admin/department"
                  class="text-[10px] font-black text-gray-400 hover:text-[var(--gold-dark)] transition-colors tracking-widest uppercase"
                  >Data List</NuxtLink
                >
                <span class="mx-2 text-gray-300">/</span>
                <span
                  class="text-[10px] font-black text-gray-900 tracking-widest uppercase"
                  >Create Department</span
                >
              </div>
              <h1
                class="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-[0.8]"
              >
                Create New
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-main)]"
                  >Department</span
                >
              </h1>
            </div>
          </div>
          
        </header>

        <div
          class="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div class="p-8 md:p-14">
            <form @submit.prevent="handleSubmit" class="space-y-10">
              <div class="space-y-8">
                <div class="space-y-3">
                  <BaseLabel
                    label="Department Name"
                    hint="Official identifier for the new business entity"
                  />
                  <BaseInput
                    v-model="form.name"
                    placeholder="e.g. Creative & Development"
                    :disabled="loadingForm"
                    required
                  />
                </div>
              </div>

              <Transition name="slide-up">
                <div
                  v-if="errorMessage"
                  class="p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border"
                  :class="
                    errorMessage.includes('Successfully')
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-red-50 text-red-600 border-red-100'
                  "
                >
                  {{ errorMessage }}
                </div>
              </Transition>

              <div class="pt-4">
                <BaseButton
                  type="submit"
                  :loading="loadingForm"
                  :disabled="!form.name"
                >
                  Initialize Department
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
