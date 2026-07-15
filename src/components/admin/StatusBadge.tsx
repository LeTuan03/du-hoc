import { LEAD_STATUS_LABELS, type LeadStatus } from "@/server/types";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  consulting: "bg-violet-50 text-violet-700 ring-violet-200",
  preparing_documents: "bg-amber-50 text-amber-700 ring-amber-200",
  submitted: "bg-orange-50 text-orange-700 ring-orange-200",
  visa_approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  discontinued: "bg-slate-100 text-slate-500 ring-slate-200",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusStyles[status]}`}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
