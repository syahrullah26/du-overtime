export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { isAuthenticated, getCurrentUser, redirectToDashboard } = useAuth()

    //cek usernya udah ke autentikasi blm
    if (!isAuthenticated()) {
        //redirect ke login kalo belum
        if (to.path.startsWith('/dashboard')) {
            return navigateTo('/')
        }
        return
    }

    //kalo ke autentikasi, redirect ke dashboard role masing masing
    if (to.path === '/' && isAuthenticated()) {
        const user = getCurrentUser()
        if (user?.role) {
            redirectToDashboard(user.role)
            return
        }
    }

    //cek role-based akses
    if (to.path.startsWith('/dashboard')) {
        const user = getCurrentUser()

        if (!user) {
            return navigateTo('/')
        }

        //role-based rute map ny
        const roleRoutes: Record<string, string[]> = {
            'FINANCE': ['/dashboard/finance'],
            'HRD': ['/dashboard/hrd'],
            'PIC': ['/dashboard/pic'],
            'C_LEVEL': ['/dashboard/clevel'],
            'EMPLOYEE': ['/dashboard/employee'],
        }

        const allowedRoutes = roleRoutes[user.role] || []

        //cek usernya lewat rute yg bener ga
        const isAllowedRoute = allowedRoutes.some(route => to.path.startsWith(route))

        if (!isAllowedRoute) {
            redirectToDashboard(user.role)
        }
    }
})