<script setup lang="ts">
// Gunakan variabel emas kamu di sini jika diperlukan lewat script
</script>

<template>
  <div
    class="min-h-screen bg-[#050505] text-white font-sans selection:bg-[var(--gold-main)]/30"
  >
    <div
      class="relative h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop"
          class="w-full h-full object-cover opacity-30 scale-105 animate-subtle-zoom"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#050505]"
        ></div>
      </div>

      <div class="relative z-10 mt-10">
        <div
          class="inline-block px-4 py-1 border border-[var(--gold-main)]/30 rounded-full bg-[var(--gold-main)]/10 backdrop-blur-md mb-6"
        >
          <span
            class="text-[var(--gold-main)] text-[10px] font-black tracking-[0.4em] uppercase"
            >Basketball Champions League</span
          >
        </div>

        <h1
          class="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]"
        >
          THE <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-b from-[var(--gold-main)] to-[var(--gold-dark)]"
            >SHOWDOWN</span
          >
        </h1>

        <p
          class="mt-4 text-zinc-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase max-w-xl mx-auto leading-relaxed"
        >
          Saksikan perjuangan Dewa United Banten di kancah <br />
          Internasional.
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto -mt-20 relative z-20 px-4 pb-20">
      <div
        class="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
      >
        <div class="flex flex-col md:flex-row">
          <div
            class="flex-1 p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/5"
          >
            <div class="space-y-8">
              <div class="space-y-2">
                <p
                  class="text-[10px] font-black text-[var(--gold-main)] uppercase tracking-[0.3em]"
                >
                  Venue
                </p>
                <h2 class="text-2xl md:text-3xl font-black uppercase">
                  Dewa United Arena
                </h2>
              </div>

              <div
                class="flex justify-between items-end pt-4 border-t border-white/5"
              >
                <div class="space-y-1">
                  <p
                    class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]"
                  >
                    Time
                  </p>
                  <p class="text-xl font-bold">19:30 WIB</p>
                </div>
                <div class="space-y-1 text-right">
                  <p
                    class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]"
                  >
                    Date
                  </p>
                  <p class="text-xl font-bold uppercase">15 Mar 2026</p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex-[1.2] p-10 md:p-14 bg-gradient-to-br from-white/[0.02] to-transparent flex flex-col justify-between"
          >
            <div class="flex items-center justify-between gap-4 mb-10">
              <div class="flex-1 text-center">
                <div
                  class="w-20 h-20 mx-auto mb-4 bg-black rounded-2xl border border-[var(--gold-main)]/20 p-3 flex items-center justify-center shadow-[0_0_20px_rgba(var(--gold-main),0.1)]"
                >
                  <img
                    src="https://dwunss.com/storage/images/uploads/du_image_20210614101222829543_du_image_du-logo-basketball.png"
                    class="w-full h-full object-contain"
                  />
                </div>
                <p
                  class="text-[10px] font-black uppercase tracking-widest leading-tight"
                >
                  Dewa United <br />
                  <span class="text-[var(--gold-main)] text-[8px]"
                    >Banten BC</span
                  >
                </p>
              </div>

              <div class="text-2xl font-black italic text-zinc-700">VS</div>

              <div class="flex-1 text-center">
                <div
                  class="w-20 h-20 mx-auto mb-4 bg-zinc-800 rounded-2xl border border-white/5 p-3 flex items-center justify-center"
                >
                  <span class="text-3xl">🏀</span>
                </div>
                <p
                  class="text-[10px] font-black uppercase tracking-widest leading-tight"
                >
                  Al-Riyadi <br />
                  <span class="text-zinc-500 text-[8px]">Lebanon</span>
                </p>
              </div>
            </div>

            <NuxtLink
              to="/bcl/register"
              class="group relative w-full bg-[var(--gold-main)] hover:bg-[var(--gold-dark)] text-black py-4 rounded-xl font-black tracking-[0.2em] transition-all flex items-center justify-center gap-3 overflow-hidden shadow-[0_10px_30px_rgba(234,179,8,0.2)]"
            >
              <span class="relative z-10 uppercase">Book Now</span>
              <span
                class="relative z-10 group-hover:translate-x-2 transition-transform"
                >→</span
              >
              <div
                class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              ></div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes subtle-zoom {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
.animate-subtle-zoom {
  animation: subtle-zoom 20s ease-in-out infinite;
}
</style>
