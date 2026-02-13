export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, userState } = useAuth();

  //cek role dari meta yang ada di layouts/default.vue
  const allowedRoles = to.meta.roles as string[];

  //cek login
  if (!isAuthenticated()) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
    return;
  }

  //kalo udah login
  if (isAuthenticated()) {
    if (to.path === "/") {
      return navigateTo("/dashboard");
    }

    // cek role
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = userState.value?.role;

      // kalo role tidak sesuai
      if (!userRole || !allowedRoles.includes(userRole)) {
        console.warn("Akses ditolak: Role tidak sesuai");
        return navigateTo("/dashboard");
      }
    }
  }
});
