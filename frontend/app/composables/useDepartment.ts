import type { Department } from "~/types/auth";

export const useDepartment = () => {
  const loading = ref(false);
  const detailDept = ref<Department[]>([]);

  const getDepartmentById = async (id: string) => {
    try {
      loading.value = true;
      const response = await useApiFetch<any>(`/departments/${id}`);
      detailDept.value = response.data || response;
    } catch (error: any) {
      console.error(
        "Error fetching detail department :",
        error.data || error.message,
      );
    } finally {
      loading.value = false;
    }
  };
  const createDepartment = async (formData: { name: string }) => {
    try {
      loading.value = true;
      const response = await useApiFetch<any>(`/departments`, {
        method: "POST",
        body: formData,
      });
      return response;
    } catch (error: any) {
      console.error("Service Error:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
    getDepartmentById,
    createDepartment,
    detailDept,
    loading,
  };
};
