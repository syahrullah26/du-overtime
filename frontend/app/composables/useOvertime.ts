import type { OvertimeSubmission } from "~/types/auth";

export const useOvertime = () => {
  const submitLoading = ref(false);
  const fetchSubmissions = async () => {
    try {
      const response = await useApiFetch<any>(`/overtime-submissions`);
      const overtimeData = response.data || response;
      if (!Array.isArray(overtimeData)) {
        console.warn(`Data untuk overtime bukan array:`, overtimeData);
        return [];
      }
      return overtimeData;
    } catch (error: any) {
      console.error(`Error Fetching Overtime:`, error.data || error.message);
    }
  };
  const submissions = async (payload: any) => {
    submitLoading.value = true;
    try {
      const response = await useApiFetch<any>(`/overtime-submissions`, {
        method: "POST",
        body: payload,
      });
      return { success: true, data: response };
    } catch (error: any) {
      console.error(`Error Submitting Overtime:`, error.data || error.message);
      return { success: false, error: error.data || error.message };
    } finally {
      submitLoading.value = false;
    }
  };
  return {
    fetchSubmissions,
    submissions,
    submitLoading,
  };
};
