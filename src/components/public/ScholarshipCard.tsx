import Link from "next/link";
import type { Scholarship } from "@/server/types";
import { countryRepository } from "@/server/repositories/countryRepository";
import { daysUntil, formatDate } from "@/lib/format";
import { Flag } from "./Flag";

export async function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  // findAll() được cache theo request — tránh N+1 findUnique theo từng card
  const countries = await countryRepository.findAll();
  const country = countries.find((c) => c.slug === scholarship.countrySlug);
  const remaining = daysUntil(scholarship.deadline);

  return (
    <Link
      href={`/hoc-bong/${scholarship.slug}`}
      className="group flex flex-col rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        {country && (
          <span className="flex items-center gap-1.5 font-semibold text-slate-500">
            <Flag country={country.slug} className="h-3 w-[18px] rounded-[2px]" />
            {country.name}
          </span>
        )}
        <span
          className={`font-bold ${
            remaining <= 30 ? "text-red-600" : "text-slate-400"
          }`}
        >
          {remaining > 0 ? `Còn ${remaining} ngày` : "Đã hết hạn"}
        </span>
      </div>

      <h3 className="mt-3 font-bold leading-snug text-slate-900 group-hover:text-[#1e4fa3]">
        {scholarship.name}
      </h3>

      <p className="mt-3 border-l-2 border-[#f5c451] pl-3 text-sm font-bold text-amber-700">
        {scholarship.value}
      </p>

      <p className="mb-4 mt-3 line-clamp-2 text-sm text-slate-600">
        {scholarship.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">
          Hạn: <strong className="text-slate-700">{formatDate(scholarship.deadline)}</strong>
        </span>
        <span className="text-sm font-semibold text-[#1e4fa3] transition group-hover:translate-x-0.5">
          Chi tiết →
        </span>
      </div>
    </Link>
  );
}
