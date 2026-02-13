export const useUser = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();
  const API_URL = config.public.apiBase || "http://localhost:8000/api";

  const fetchUsersByRole = async (role: string) => {
    try {
      //get token
      const token = getToken();
      const headers = useRequestHeaders(["cookie"]) as Record<string, string>;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      headers["Accept"] = "application/json";
      const response = await $fetch<any>(`${API_URL}/users`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { role },
      });
      const userData = response.data || response;

      if (!Array.isArray(userData)) {
        console.warn(`Data untuk role ${role} bukan array:`, userData);
        return [];
      }

      return userData.map((user: any) => ({
        label: user.name,
        value: user.id,
      }));
    } catch (error: any) {
      console.error(
        `Error fetching role ${role}}:`,
        error.data || error.message,
      );
      return [];
    }
  };

  return { fetchUsersByRole };
};
