export default defineEventHandler((event) => {

  if (!event.path.startsWith('/api/')) {
    return
  }

  const publicRoutes = ['/api/auth/login', '/api/auth/logout']
  if (publicRoutes.includes(event.path)) {
    return
  }

  const token = getCookie(event, 'auth_token')
  
  if (!token && event.path.startsWith('/api/')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - No token provided',
    })
  }

  event.context.auth = {
    token,
  }
})