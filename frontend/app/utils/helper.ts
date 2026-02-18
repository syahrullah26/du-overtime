
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
