import type {
  ChangePasswordPayload,
  EditProfilePayload,
} from "~/types/payload";

export const useUser = () => {
  const userSelected = ref<any>(null);
  const loading = ref(false);

  const fetchAllUsers = async () => {
    try {
      loading.value = true;
      const response = await useApiFetch<any>(`/users`);
      return response.data || response;
    } catch (error: any) {
      console.error(
        "Error Fetching All Users Data:",
        error.data | error.message,
      );
    }
    return [];
  };
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

  const uploadProfilePicture = async (id: number, file: File) => {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await useApiFetch<any>(`/users/${id}/profile-picture`, {
        method: "POST",
        body: formData,
      });
      return response.data || response;
    } catch (error: any) {
      console.error(
        "Error uploading profile picture:",
        error.data || error.message,
      );
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const uploadSignature = async (id: number, file: File) => {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("signature", file);

      const response = await useApiFetch<any>(`/users/${id}/signature`, {
        method: "POST",
        body: formData,
      });
      return response.data || response;
    } catch (error: any) {
      console.error("Error uploading signature:", error.data || error.message);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (payload: ChangePasswordPayload) => {
    loading.value = true;
    try {
      const response = await useApiFetch<any>(`/users/${payload.id}/password`, {
        method: "PUT",
        body: payload,
      });
      return response.data || response;
    } catch (error: any) {
      console.error("Error updating password:", error.data || error.message);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    fetchAllUsers,
    fetchUserById,
    fetchUsersByRole,
    updatePassword,
    updateUser,
    uploadProfilePicture,
    uploadSignature,
    userSelected,
    loading,
  };
};
