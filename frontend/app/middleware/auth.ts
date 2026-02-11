export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { isAuthenticated, getCurrentUser } = useAuth()

    //cek usernya udah ke autentikasi blm
    if (!isAuthenticated()) {
        //redirect ke login kalo belum
        if (to.path.startsWith('/dashboard')) {
            return navigateTo('/')
        }
        return
    }

    //dah login tp akses login page lg? sung ke dashboard
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
})