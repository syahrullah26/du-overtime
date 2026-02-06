// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  debug: true,
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
    },
  },
  ssr: true,
  app: {
    head: {
      title: "Dewa United Overtime",
      titleTemplate: "%s | Dewa United Overtime",
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/du-universal.png",
        },
      ],
      meta: [
        {
          name: "description",
          content: "Official Dewa United Overtime",
        },
      ],
    },
  },
});
