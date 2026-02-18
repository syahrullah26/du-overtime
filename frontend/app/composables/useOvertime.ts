import type { OvertimeSubmission } from "~/types/auth";
interface OvertimePayload {
  name: string;
  role: string;
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  pic_id: string;
  clevel_id: string;
}

export const useOvertime = () => {
  const submissions = useState<OvertimeSubmission[]>(
    "overtime_submissions",
    () => [],
  );
  const loading = useState<boolean>("overtime_loading", () => false);

  //get submissions
  const fetchSubmissions = async () => {
    loading.value = true;
    try {
      const data = await useApiFetch<any>(`/overtime-submissions`);
      submissions.value = data.data || data;
      const submissionsData = data.data || data;
      if (!Array.isArray(submissionsData)) {
        console.warn("Overtime data is not an array:", submissionsData);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch overtime:", error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  //pengajuan
  const submitOvertime = async (payload: OvertimePayload) => {
    try {
      const response = await useApiFetch<any>(`/overtime-submissions`, {
        method: "POST",
        body: payload,
      });
      return response;
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
