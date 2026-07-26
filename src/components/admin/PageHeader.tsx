import Link from "next/link";
import { Plus } from "lucide-react";

/**
 * Header dùng chung cho mọi trang admin: tiêu đề, mô tả ngắn và vùng hành
 * động bên phải. Gom về một chỗ để 12 module có cùng nhịp khoảng cách.
 */
export function PageHeader({
  title,
  description,
  createHref,
  createLabel = "Thêm mới",
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  createHref?: string;
  createLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {createHref && (
          <Link
            href={createHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e4fa3] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#123a7a]"
          >
            <Plus size={15} aria-hidden />
            {createLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

/** Khung thẻ trắng bo góc — nền chung của mọi bảng/biểu đồ trong admin */
export function Panel({
  title,
  extra,
  children,
  className = "",
}: {
  title?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 ${className}`}
    >
      {(title || extra) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="font-bold text-slate-900">{title}</h2>}
          {extra}
        </div>
      )}
      {children}
    </section>
  );
}

/** Thẻ số liệu dùng ở Dashboard và Báo cáo chuyển đổi */
export function StatCard({
  label,
  value,
  icon,
  tone = "text-[#1e4fa3]",
  hint,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  tone?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {icon && (
          <span aria-hidden className={tone}>
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-2 text-3xl font-extrabold ${tone}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/** Trạng thái rỗng nhất quán cho các bảng/danh sách */
export function EmptyState({
  message,
  hint,
}: {
  message: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
      <p className="text-sm font-semibold text-slate-500">{message}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
