export const useUser = () => {
  const fetchUsersByRole = async (role: string) => {
    try {
      const response = await useApiFetch<any>(`/users`, {
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
        `Error fetching role ${role}:`,
        error.data || error.message,
      );
      return [];
    }
  };

  return { fetchUsersByRole };
};