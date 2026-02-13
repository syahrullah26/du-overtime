// Di useUser.ts
export const useUser = () => {
  const config = useRuntimeConfig();
  const API_URL = config.public.apiBase || "http://localhost:8000/api";

  const fetchUsersByRole = async (role: string) => {
    try {
      const headers = useRequestHeaders(["cookie"]) as Record<string, string>;

      const response = await $fetch<any>(`${API_URL}/users`, {
        method: "GET",
        headers,
        params: { role },
      });

      const userData = response.data || response;
      return userData.map((user: any) => ({
        label: user.name,
        value: user.id,
      }));
    } catch (error) {
      console.error(`Error fetching role ${role}:`, error);
      return [];
    }
  };

  return { fetchUsersByRole };
};
