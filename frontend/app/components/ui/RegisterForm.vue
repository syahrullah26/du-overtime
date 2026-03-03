<script setup lang="ts">
import { error } from "node:console";
import { roleOptions } from "~/constants/user";
import type { RegisterPayload } from "~/types/payload";

const emit = defineEmits(["submit", "cancel"]);
const router = useRouter();
const errorMessage = ref("");
const isLoading = ref(false);
const { fetchAllDept, registerUser, allDept } = useUser();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const EyeIcon = h(
  "svg",
  {
    xmlns: "http://www.w3.org/2003/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
  },
  [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    }),
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    }),
  ],
);

const EyeOffIcon = h(
  "svg",
  {
    xmlns: "http://www.w3.org/2003/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
  },
  [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.22 4.22m13.89 13.89l5.66 5.66",
    }),
  ],
);
onMounted(() => {
  fetchAllDept();
});

const deptOptions = computed(() => {
  return allDept.value.map((dept) => ({
    label: dept.name,
    value: dept.id,
  }));
});

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  dept_id: "" as string | number,
});
const resetForm = () => {
  form.value = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    dept_id: "",
  };
};

const handleSubmit = async () => {
  if (
    !form.value.name ||
    !form.value.email ||
    !form.value.password ||
    !form.value.confirmPassword ||
    !form.value.role ||
    !form.value.dept_id
  ) {
    errorMessage.value = "Please fill in all fields";
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "Password and Confirm Password do not match";
  }
  isLoading.value = true;
  try {
    const payload: RegisterPayload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword,
      role: form.value.role,
      dept_id: Number(form.value.dept_id),
    };
    let result = await registerUser(payload);
    emit("submit", result);
    errorMessage.value = "Registration Successful! Redirecting...";
    resetForm();
    setTimeout(() => {
      router.push("/admin/user");
    }, 1500);
  } catch (error: any) {
    errorMessage.value =
      error.response?._data?.message ||
      "Failed to Register. Please check your data.";
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div
    class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
  >
    <div
      v-if="errorMessage"
      class="p-8 border-b border-gray-50 flex justify-between items-center"
    >
      <h3 class="font-bold text-xl text-gray-800">
        {{ errorMessage }}
      </h3>
    </div>
    <div class="bg-white border p-8 md:p-12 transition-all">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <section class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <BaseLabel label="Full Name" class="text-[10px] ml-1" />
              <BaseInput
                v-model="form.name"
                placeholder="Full Name"
                class="modern-input"
                required
              />
            </div>
            <div class="space-y-1.5">
              <BaseLabel label="Email" class="text-[10px] ml-1" />
              <BaseInput
                v-model="form.email"
                type="email"
                placeholder="example@dewaunited.com"
                class="modern-input"
                required
              />
            </div>
          </div>
        </section>

        <section
          class="space-y-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2 group">
              <div class="flex justify-between items-center px-1">
                <BaseLabel
                  label="Password"
                  class="text-[10px] uppercase tracking-widest"
                />
              </div>

              <div
                class="relative transition-transform duration-300 focus-within:-translate-y-0.5"
              >
                <BaseInput
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-[var(--gold-main)] transition-all duration-300"
                >
                  <component
                    :is="showPassword ? EyeOffIcon : EyeIcon"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>

            <div class="space-y-2 group">
              <div class="flex justify-between items-center px-1">
                <BaseLabel
                  label="Confirm Password"
                  class="text-[10px] uppercase tracking-widest"
                />
                <span
                  v-if="form.confirmPassword"
                  class="text-[9px] font-bold uppercase tracking-tighter transition-all duration-300"
                  :class="
                    form.password === form.confirmPassword
                      ? 'text-emerald-500'
                      : 'text-red-400'
                  "
                >
                  {{
                    form.password === form.confirmPassword
                      ? "✓ Match"
                      : "× Mismatch"
                  }}
                </span>
              </div>

              <div
                class="relative transition-transform duration-300 focus-within:-translate-y-0.5"
              >
                <BaseInput
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :class="{
                    'border-red-100 bg-red-50/30':
                      form.confirmPassword &&
                      form.password !== form.confirmPassword,
                  }"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-[var(--gold-main)] transition-all duration-300"
                >
                  <component
                    :is="showConfirmPassword ? EyeOffIcon : EyeIcon"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <BaseLabel label="Department" class="text-[10px] ml-1" />
              <BaseSelect
                v-model="form.dept_id"
                :options="deptOptions"
                class="modern-select"
              />
            </div>
            <div class="space-y-1.5">
              <BaseLabel label="Role" class="text-[10px] ml-1" />
              <BaseSelect
                v-model="form.role"
                :options="roleOptions"
                class="modern-select"
              />
            </div>
          </div>
        </section>

        <div class="pt-8 flex flex-col gap-4">
          <BaseButton
            :label="isLoading ? 'Processing...' : 'Register Account'"
            type="submit"
            :disabled="isLoading"
            class="!h-14 !rounded-2xl !bg-zinc-900 !text-[var(--gold-main)] hover:!bg-black !font-black !uppercase !tracking-widest !border-none shadow-lg shadow-zinc-200 transition-all duration-300"
          />
          <button
            type="button"
            @click="emit('cancel')"
            class="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-all"
          >
            Cancel Registration
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
