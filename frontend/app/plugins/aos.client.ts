import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-in-out",
    });
  }
  return {
    provide: {
      aos: AOS,
    },
  };
});
