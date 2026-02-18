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
      const response = await useApiFetch<any>("/overtime-submissions");
      // backend return paginate response data nya
      const submissionsData = response.data || response;

      if (!Array.isArray(submissionsData)) {
        console.warn("Overtime data is not an array:", submissionsData);
        submissions.value = [];
        return [];
      }

      submissions.value = submissionsData;
    } catch (error) {
      console.error("Failed to fetch overtime:", error);
      submissions.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  //pengajuan
  const submitOvertime = async (payload: OvertimePayload) => {
    try {
      return await useApiFetch("/overtime-submissions", {
        method: "POST",
        body: payload,
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