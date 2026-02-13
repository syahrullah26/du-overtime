export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')

    if (token) {
      // Call Laravel logout API
      const config = useRuntimeConfig()
      
      try {
        await $fetch(`${config.public.apiBase}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      } catch (error) {
        //meskipun gagal logout, cookie ttp ke hapus
        console.error('Laravel logout error:', error)
      }
    }

    
    deleteCookie(event, 'auth_token', {
      path: '/',
    })
    
    deleteCookie(event, 'user_data', {
      path: '/',
    })

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error: any) {
    console.error('Logout error:', error)
    
    deleteCookie(event, 'auth_token', { path: '/' })
    deleteCookie(event, 'user_data', { path: '/' })
    
    throw createError({
      statusCode: 500,
      message: 'Logout failed',
    })
  }
})