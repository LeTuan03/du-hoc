import Link from "next/link";
import type { Scholarship } from "@/server/types";
import { getCountryBySlug } from "@/server/data/countries";
import { daysUntil, formatDate } from "@/lib/format";
import { Flag } from "./Flag";

export function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const country = scholarship.countrySlug
    ? getCountryBySlug(scholarship.countrySlug)
    : undefined;
  const remaining = daysUntil(scholarship.deadline);

  return (
    <Link
      href={`/hoc-bong/${scholarship.slug}`}
      className="group flex flex-col rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/60 to-white p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f5c451] text-xl shadow-sm">
          🎓
        </span>
        {country && (
          <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            <Flag country={country.slug} className="h-3 w-[18px] rounded-[2px]" />
            {country.name}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-bold leading-snug text-slate-900 group-hover:text-[#1e4fa3]">
        {scholarship.name}
      </h3>

      <p className="mt-2 text-sm font-bold text-amber-700">
        💰 {scholarship.value}
      </p>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
        {scholarship.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-amber-100 pt-3 text-xs">
        <span className="mt-2 text-slate-500">
          Hạn: <strong>{formatDate(scholarship.deadline)}</strong>
        </span>
        <span
          className={`mt-2 rounded-full px-2.5 py-1 font-bold ${
            remaining <= 30
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {remaining > 0 ? `Còn ${remaining} ngày` : "Đã hết hạn"}
        </span>
      </div>
    </Link>
  );
}
