import type { User } from "~/types/auth";

export const useUser = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();
  const API_URL = config.public.apiBase || "http://localhost:8000/api";

  const fetchUsersByRole = async (role: string) => {
    try {
      const response = await $fetch<any>(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: { role },
      });
      const userData = response.data || response;

      return userData.map((user: any) => ({
        label: user.name,
        value: user.id,
      }));
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      return [];
    }
  };

  return {
    fetchUsersByRole,
  };
};
