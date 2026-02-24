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
