export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const { isAuthenticated, getCurrentUser } = useAuth()

  //set publicPages, cm login page yg gaperlu login
  const publicPages = ['/']
  const isPublicPage = publicPages.includes(to.path)

  //cek user autentikasi, semua yg belum login cm bisa akses publicPages
  if (!isAuthenticated() && !isPublicPage) {
    return navigateTo('/')
  }

  //redirect ke dashboard kl dah login
  if (to.path === '/' && isAuthenticated()) {
    return navigateTo('/dashboard')
  }

  //cek role di logic dashboard
  if (to.path.startsWith('/dashboard/')) {
    const user = getCurrentUser()

    if (!user) {
      return navigateTo('/')
    }
    return
  }
})