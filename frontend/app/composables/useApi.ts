export const useApiFetch = async <T = any>(
  url: string,
  options: Parameters<typeof $fetch>[1] = {},
): Promise<T> => {
  const config = useRuntimeConfig();

  try {
    const response = await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      credentials: "include",
      ...options,
    });

    return response as T;
  } catch (error: any) {
    const isAuthUrl = url.includes('/login') || url.includes('/logout')

    if ((error.response?.status === 401 || error.statusCode === 401) && !isAuthUrl) {
      const { logout } = useAuth()
      await logout()
    }

    throw error;
  }
};