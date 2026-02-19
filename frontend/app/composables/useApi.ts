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
    const status = error.response?.status || error.statusCode;

    if (status === 401) {
      const requestUrl = error.response?._data?.url || "";
      const isAuthRoute =
        requestUrl.includes("/login") || requestUrl.includes("/logout");
      if (!isAuthRoute) {
        const { logout } = useAuth();
        await logout();
      }
    }

    throw error;
  }
};
