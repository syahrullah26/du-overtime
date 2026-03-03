<script setup lang="ts">
const logoUrl =
  "https://dwunss.com/storage/images/uploads/du_image_20210614101222829543_du_image_du-logo-basketball.png";
const user = ref({
  fullName: "Nama User",
  email: "user@dewaunitedfans.id",
  phone: "+62 812-3456-7890",
});
const nik = ref("");
</script>

<template>
  <div
    class="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden"
  >
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--gold-main)]/10 blur-[150px] -z-10"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zinc-800/20 blur-[150px] -z-10"
    ></div>

    <div class="w-full max-w-xl relative z-10">
      <NuxtLink
        to="/"
        class="group inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--gold-main)] transition-colors mb-8 font-black uppercase text-[10px] tracking-widest"
      >
        <span
          class="w-7 h-7 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-[var(--gold-main)] transition-colors"
          >←</span
        >
        Kembali
      </NuxtLink>

      <div
        class="bg-zinc-900/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
      >
        <div class="p-10 pb-0 flex justify-between items-start">
          <div>
            <h2
              class="text-4xl font-black italic uppercase tracking-tighter leading-none"
            >
              REGISTRATION <br />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-main)] to-[var(--gold-dark)]"
                >PASS</span
              >
            </h2>
            <div class="h-1 w-12 bg-[var(--gold-main)] mt-4"></div>
          </div>
          <img
            :src="logoUrl"
            class="h-16 w-auto object-contain drop-shadow-xl"
          />
        </div>

        <form @submit.prevent="" class="p-10 space-y-8">
          <div
            class="bg-black/50 border border-white/10 rounded-3xl p-6 relative group transition-all hover:border-[var(--gold-main)]/30"
          >
            <div
              class="absolute top-4 right-4 text-[9px] font-black text-zinc-700 uppercase tracking-widest"
            >
              Official Fan Pass
            </div>

            <div class="space-y-6">
              <div>
                <p
                  class="text-[9px] font-black text-[var(--gold-main)] uppercase tracking-[0.2em] mb-1"
                >
                  Full Name
                </p>
                <p class="text-lg font-bold tracking-tight">
                  {{ user.fullName }}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <p
                    class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1"
                  >
                    Phone Number
                  </p>
                  <p class="text-xs font-bold">{{ user.phone }}</p>
                </div>
                <div>
                  <p
                    class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1"
                  >
                    Email Address
                  </p>
                  <p class="text-xs font-bold truncate">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <label
                class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1"
                >Input NIK (KTP)</label
              >
              <span
                class="text-[10px] font-mono text-[var(--gold-main)] tracking-widest"
                >{{ nik.length }}/16</span
              >
            </div>
            <input
              v-model="nik"
              type="text"
              maxlength="16"
              placeholder="0000 0000 0000 0000"
              class="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl focus:border-[var(--gold-main)] focus:ring-1 focus:ring-[var(--gold-main)] outline-none transition-all text-xl font-mono text-center tracking-[0.4em] text-[var(--gold-main)] placeholder:text-zinc-800 placeholder:tracking-normal"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-[var(--gold-main)] hover:bg-[var(--gold-dark)] text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(234,179,8,0.2)]"
          >
            KONFIRMASI PENDAFTARAN
          </button>
        </form>

        <div class="bg-black/40 p-6 text-center border-t border-white/5">
          <p
            class="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed px-10"
          >
            E-Ticket akan dikirimkan maksimal 1x24 jam setelah proses verifikasi
            identitas selesai.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
