import type { O } from "vue-router/dist/router-CWoNjPRp.mjs";
import type { OvertimeSubmission } from "~/types/auth";
// STATUS BADGE ATAU CLASS NYA
export const statusClass = (status: string) => {
  const base = "px-2 py-1 rounded-md text-xs font-bold ";
  if (status.startsWith("PENDING"))
    return base + "bg-yellow-100 text-yellow-700";
  if (status === "COMPLETED") return base + "bg-green-100 text-green-700";
  if (status === "REJECTED") return base + "bg-red-100 text-red-700";
  return base + "bg-gray-100 text-gray-700";
};

//FORMAT RUPIAH
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// FORMAT TANGGAL
export const formatDate = (date: string | Date | number) => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

//FORMAT JAM
export const formatTime = (date: string | Date | number): string => {
  if (!date) return "-";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch (error) {
    console.error("FormatTime Error:", error);
    return "-";
  }
};

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};

/**
 * menghitung persentase profile completion
 * @param user
 * @returns
 */
export const calculateProfileCompletion = (user: any): number => {
  if (!user) return 0;

  const fields = [user.name, user.profile_picture, user.signature];

  const completedFields = fields.filter(
    (field) => field !== null && field !== undefined && field !== "",
  ).length;

  const percentage = (completedFields / fields.length) * 100;

  return Math.round(percentage);
};

// Menentukan class untuk completion
export const completionClass = (percentage: number) => {
  if (percentage < 50) {
    return "bg-red-500 text-white shadow-red-100";
  }

  if (percentage < 100) {
    return "bg-slate-800 text-slate-100";
  }

  return "bg-[var(--gold-main)] text-black shadow-[var(--gold-main)] shadow-sm";
};

// Menentukan badge status overtime pada component stepper
export const getStepperStatus = (item: OvertimeSubmission, level: string) => {
  const status = item.status;
  if (status === "COMPLETED") return "done";
  if (status === "REJECTED") return "error";

  if (level === "PIC") return status === "PENDING_PIC" ? "process" : "done";
  if (level === "CLEVEL") {
    if (status === "PENDING_PIC") return "pending";
    return status === "PENDING_C_LEVEL" ? "process" : "done";
  }
  if (level === "HRD") {
    return status === "PENDING_HRD" ? "process" : "pending";
  }
  return "pending";
};
//filter data overtime untuk history
export const filterHistorySubmissions = (
  submissions: OvertimeSubmission[],
  selectedPeriod: string,
  selectedDept: string,
  searchQuery: string = "",
) => {
  if (!submissions) return [];

  return submissions.filter((item) => {
    const itemPeriod = getPayrollPeriod(item.created_at);
    const matchesPeriod = itemPeriod === selectedPeriod;
    const matchesStatus = item.status === "COMPLETED";

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = item.employee?.name
      ?.toLowerCase()
      .includes(searchTerm);
    const matchesDept =
      selectedDept.toUpperCase() === "ALL" ||
      item.employee?.department?.name === selectedDept;

    return matchesPeriod && matchesStatus && matchesSearch && matchesDept;
  });
};

//filter data overtime pada halaman index overtime.
export const filteredDataSubmissions = (
  submissions: OvertimeSubmission[],
  userId: string | number | undefined,
  role: string | undefined,
  searchTerm: string | "",
  activeTab: string,
) => {
  if (!submissions || !userId) return [];
  return submissions.filter((item) => {
    const isOwner = item.employee_id === userId;
    let matchTab = false;
    if (activeTab === "PENDING_PIC") {
      if (isOwner) return false;

      if (item.status === "PENDING_PIC" && item.pic_id === userId)
        matchTab = true;
      else if (item.status === "PENDING_C_LEVEL" && item.clevel_id === userId)
        matchTab = true;
      else if (item.status === "PENDING_HRD" && role === "HRD") matchTab = true;
      else if (
        role === "SUPERADMIN" &&
        ["PENDING_PIC", "PENDING_C_LEVEL", "PENDING_HRD"].includes(item.status)
      )
        matchTab = true;
    } else if (activeTab === "COMPLETED") {
      matchTab = isOwner && item.status === "COMPLETED";
    } else if (activeTab === "REJECTED") {
      matchTab = isOwner && item.status === "REJECTED";
    } else if (activeTab === "APPROVAL_HISTORY") {
      if (isOwner) return false;

      if (role === "HRD" || role === "SUPERADMIN") {
        matchTab = ["COMPLETED", "REJECTED"].includes(item.status);
      } else {
        const isAssignedPic =
          item.pic_id === userId && item.status !== "PENDING_PIC";
        const isAssignedCLevel =
          item.clevel_id === userId &&
          !["PENDING_PIC", "PENDING_C_LEVEL"].includes(item.status);
        matchTab = isAssignedPic || isAssignedCLevel;
      }
    }

    const employeeName = item.employee?.name?.toLowerCase() || "";
    const submissionDate = item.date?.toLowerCase() || "";
    const matchSearch =
      employeeName.includes(searchTerm) || submissionDate.includes(searchTerm);

    return matchTab && matchSearch;
  });
};

//filter data overtime untuk halaman approval
export const filterPendingApprovals = (
  submissions: OvertimeSubmission[],
  userId: string | number | undefined,
  role: string | undefined,
): OvertimeSubmission[] => {
  if (!submissions || !userId) return [];

  const currentUserId = String(userId);

  return submissions.filter((item) => {
    const isOwner = String(item.employee_id) === currentUserId;
    if (isOwner) return false;
    if (
      item.status === "PENDING_PIC" &&
      String(item.pic_id) === currentUserId
    ) {
      return true;
    }
    if (
      item.status === "PENDING_C_LEVEL" &&
      String(item.clevel_id) === currentUserId
    ) {
      return true;
    }
    if (item.status === "PENDING_HRD" && role === "HRD") {
      return true;
    }

    return false;
  });
};

// get availabel periods dari payroll
export const getAvailablePeriods = (submissions: OvertimeSubmission[]) => {
  if (!submissions) return [];
  const periods = submissions.map((s) => getPayrollPeriod(s.created_at));
  return [...new Set(periods)].sort().reverse();
};
// Periode Payroll
export const getPayrollPeriod = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let periodMonth = day > 20 ? month + 1 : month;
  let periodYear = year;

  if (periodMonth > 11) {
    periodMonth = 0;
    periodYear++;
  }

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${monthNames[periodMonth]} ${periodYear}`;
};
// get totalLembur per periode pada profile
export const getTotalHoursByPeriod = (
  submissions: any[],
  targetUserId: number | string | undefined,
): string => {
  if (!targetUserId || !submissions || !Array.isArray(submissions))
    return "0.0";
  const currentPeriod = getPayrollPeriod(new Date().toISOString());

  const totalMinutes = submissions.reduce((total, item) => {
    if (Number(item.employee_id) !== Number(targetUserId)) return total;

    if (item.status !== "COMPLETED") return total;

    const itemPeriod = getPayrollPeriod(item.created_at);
    if (itemPeriod === currentPeriod) {
      const start = new Date(item.start_time).getTime();
      const end = new Date(item.end_time).getTime();

      const diffMs = end - start;
      if (diffMs > 0) {
        const minutes = diffMs / (1000 * 60);
        return total + minutes;
      }
    }

    return total;
  }, 0);

  return (totalMinutes / 60).toFixed(1);
};

// get action button color pada log overtime
export const getActionColor = (action: string) => {
  switch (action) {
    case "SUBMIT":
      return "text-blue-600 bg-blue-50";
    case "APPROVE":
      return "text-green-600 bg-green-50";
    case "REJECT":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
