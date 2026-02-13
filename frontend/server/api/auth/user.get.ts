interface UserResponse {
  user: {
    id: string
    name: string
    email: string
    role: 'EMPLOYEE' | 'PIC' | 'C_LEVEL' | 'HRD' | 'FINANCE'
    dept_id: string | null
    department?: {
      id: string
      name: string
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')

    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated',
      })
    }

    // Get user from Laravel API
    const config = useRuntimeConfig()
    const response = await $fetch<UserResponse>(`${config.public.apiBase}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return {
      success: true,
      user: response.user,
    }
  } catch (error: any) {
    console.error('Get user error:', error)

    throw createError({
      statusCode: error.statusCode || 401,
      message: 'Failed to get user data',
    })
  }
})