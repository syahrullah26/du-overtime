// composables/useOvertime.ts
import type { OvertimeSubmission } from "~/types/auth";

export const useOvertime = () => {
  const { getToken } = useAuth();
  const config = useRuntimeConfig();
  const API_URL = config.public.apiBase || "http://localhost:8000/api";

  const submissions = useState<OvertimeSubmission[]>(
    "overtime_submissions",
    () => [],
  );
  const loading = useState<boolean>("overtime_loading", () => false);

  //get submissions
  const fetchSubmissions = async () => {
    const token = getToken();
    if (!token) return;

    loading.value = true;
    try {
      const data = await $fetch<OvertimeSubmission[]>(
        `${API_URL}/overtime-submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      submissions.value = data;
    } catch (error) {
      console.error("Failed to fetch overtime:", error);
    } finally {
      loading.value = false;
    }
  };

  //create overtime
  const submitOvertime = async (payload: Partial<OvertimeSubmission>) => {
    try {
      return await $fetch(`${API_URL}/overtime-submissions`, {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    submissions,
    loading,
    fetchSubmissions,
    submitOvertime,
  };
};
