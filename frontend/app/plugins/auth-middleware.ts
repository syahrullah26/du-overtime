export default defineNuxtPlugin(() => {
  const router = useRouter()

  //add globl middleware
  addRouteMiddleware('auth', (to, from) => {
    if (process.server) return

    const { isAuthenticated, getCurrentUser, redirectToDashboard } = useAuth()

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
      const user = getCurrentUser()
      if (user?.role) {
        redirectToDashboard(user.role)
        return
      }
    }

    //cek akses by role
    if (to.path.startsWith('/dashboard')) {
      const user = getCurrentUser()
      
      if (!user) {
        return navigateTo('/')
      }

      //mapping akses roleny
      const roleRoutes: Record<string, string[]> = {
        'FINANCE': ['/dashboard/finance'],
        'HRD': ['/dashboard/hrd'],
        'PIC': ['/dashboard/pic'],
        'C_LEVEL': ['/dashboard/clevel'],
        'EMPLOYEE': ['/dashboard/employee'],
      }

      const allowedRoutes = roleRoutes[user.role] || []
      
      //cek alur user
      const isAllowedRoute = allowedRoutes.some(route => to.path.startsWith(route))
      
      if (!isAllowedRoute) {
        //redirect ke dashboard masing masing
        redirectToDashboard(user.role)
        return
      }
    }
  }, { global: true })
})