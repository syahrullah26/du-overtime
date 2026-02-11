export default defineNuxtPlugin(() => {
  const router = useRouter()

  //add globl middleware
  addRouteMiddleware('auth', (to, from) => {
    if (process.server) return

    const { isAuthenticated, getCurrentUser } = useAuth()

    //cek autentikasi user
    if (!isAuthenticated()) {
      //redirect ke login page kl ga lolos
      if (to.path.startsWith('/dashboard')) {
        return navigateTo('/')
      }
      return
    }

    //kalo lolos lanjut ke dashboard sesuai role
    if (to.path === '/' && isAuthenticated()) {
        return navigateTo('/dashboard')
    }

    //allow aksesny
    if (to.path === '/dashboard') {
        return
    }

    //protection role
    if (to.path.startsWith('/dashboard/')) {
        const user = getCurrentUser()

        if (!user) {
            //kl ga ada user data sung ke login
            return navigateTo('/')
        }
        //kl ada role dpt akses
        //kl salah role sung balik ke dashboard/index.vue
        return
    }
  }, { global: true })
})