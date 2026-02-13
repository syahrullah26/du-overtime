export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const { isAuthenticated, getCurrentUser } = useAuth()

  //cek user autentikasi
  if (!isAuthenticated()) {
    //balik ke login page kalo ga terautentikasi
    if (to.path.startsWith('/dashboard')) {
      return navigateTo('/')
    }
    return
  }

  if (to.path === '/' && isAuthenticated()) {
    //redirect ke dashboard kalo coba akses login page padahal dah login
    return navigateTo('/dashboard')
  }
  if (to.path === '/dashboard') {
    return
  }

 
  //dapet akses kl user pny role
  //kl salah role, diredirect ke dashboard/index.vue
  if (to.path.startsWith('/dashboard/')) {
    const user = getCurrentUser()
    
    if (!user) {
      return navigateTo('/')
    }
    return
  }
})