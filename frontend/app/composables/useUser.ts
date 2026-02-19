import type {
  ChangePasswordPayload,
  EditProfilePayload,
} from "~/types/interface";

export const useUser = () => {
  const userSelected = ref<any>(null);
  const loading = ref(false);
  const fetchUserById = async (id: string) => {
    try {
      loading.value = true;
      const response = await useApiFetch<any>(`/users/${id}`);
      userSelected.value = response.data || response;
    } catch (error: any) {
      console.error(`Error fetching role ${id}:`, error.data || error.message);
      return [];
    } finally {
      loading.value = false;
    }
  };
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

  const updateUser = async (payload: EditProfilePayload) => {
    loading.value = true;
    try {
      const response = await useApiFetch<any>(`/users/${payload.id}`, {
        method: "PUT",
        body: payload,
      });
      return response.data || response;
    } catch (error: any) {
      console.log("Error Update Profile :", error.data || error.message);
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (payload: ChangePasswordPayload) => {
    loading.value = true;
    try {
      const response = await useApiFetch<any>(
        `/users/${payload.id}/change-password`,
        {
          method: "PUT",
          body: payload,
        },
      );
      return response.data || response;
    } catch (error: any) {
      console.error("Error updating password:", error.data || error.message);
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    fetchUserById,
    fetchUsersByRole,
    updatePassword,
    updateUser,
    userSelected,
    loading,
  };
};
