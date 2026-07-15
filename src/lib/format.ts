export function formatUSD(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function formatTuitionRange(min: number, max: number): string {
  return `${formatUSD(min)} - ${formatUSD(max)}/năm`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Số ngày còn lại tới deadline; âm nếu đã qua */
export function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  return Math.ceil((target - Date.now()) / (24 * 60 * 60 * 1000));
}

/** Gradient nền theo quốc gia cho banner/card không dùng ảnh */
export const countryGradients: Record<string, string> = {
  my: "from-blue-700 via-indigo-700 to-red-600",
  canada: "from-red-600 via-rose-600 to-red-800",
  uc: "from-blue-800 via-indigo-800 to-sky-600",
  anh: "from-indigo-900 via-blue-800 to-red-700",
  "han-quoc": "from-sky-600 via-blue-700 to-rose-600",
  "nhat-ban": "from-rose-500 via-red-600 to-slate-700",
  singapore: "from-red-500 via-rose-600 to-slate-600",
  "new-zealand": "from-blue-900 via-indigo-800 to-slate-700",
};

export function gradientFor(slug: string): string {
  return countryGradients[slug] ?? "from-[#1e4fa3] to-[#123a7a]";
}
