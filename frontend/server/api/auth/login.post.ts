interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    name: string
    email: string
    role: 'EMPLOYEE' | 'PIC' | 'C_LEVEL' | 'HRD' | 'FINANCE'
    dept_id: string | null
  }
  message: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginRequest>(event)
    const { email, password } = body

    //validasi input
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required',
      })
    }

    //call laravel apiny
    const config = useRuntimeConfig()
    const response = await $fetch<LoginResponse>(`${config.public.apiBase}/login`, {
      method: 'POST',
      body: { email, password },
    })

    //set httponly cookie pake token
    setCookie(event, 'auth_token', response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, //7 hri
      path: '/',
    })

    //set user data cookie buat fe
    setCookie(event, 'user_data', JSON.stringify(response.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, //7 hri
      path: '/',
    })


    return {
      success: true,
      user: response.user,
      message: 'Login successful',
    }
  } catch (error: any) {
    console.error('Login error:', error)

    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.message || error.message || 'Login failed',
    })
  }
})