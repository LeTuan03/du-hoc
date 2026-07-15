import Link from "next/link";
import type { University } from "@/server/types";
import { getCountryBySlug } from "@/server/data/countries";
import { formatTuitionRange, gradientFor } from "@/lib/format";
import { Flag } from "./Flag";

export function UniversityCard({ university }: { university: University }) {
  const country = getCountryBySlug(university.countrySlug);
  const initials = university.name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join("");

  return (
    <Link
      href={`/truong/${university.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      {/* Banner gradient thay ảnh */}
      <div className={`relative h-32 bg-gradient-to-br ${gradientFor(university.countrySlug)}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_55%)]" />
        <span className="absolute left-4 top-4 select-none text-3xl font-extrabold tracking-tight text-white/90">
          {initials}
        </span>
        {university.ranking && (
          <span className="absolute right-3 top-3 rounded-full bg-[#f5c451] px-2.5 py-1 text-xs font-bold text-[#123a7a] shadow">
            #{university.ranking} {university.rankingSource.split(" ")[0]}
          </span>
        )}
        {university.isFeatured && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            ⭐ Nổi bật
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-slate-900 leading-snug group-hover:text-[#1e4fa3]">
          {university.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          {country && <Flag country={country.slug} className="h-3 w-[18px] rounded-[2px]" />}
          {university.city}, {country?.name}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {university.majors.slice(0, 3).map((m) => (
            <span
              key={m}
              className="rounded-full bg-[#e8f0fc] px-2.5 py-0.5 text-[11px] font-medium text-[#1e4fa3]"
            >
              {m}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="mt-3 font-semibold text-slate-700">
            {formatTuitionRange(university.tuitionMin, university.tuitionMax)}
          </span>
          <span className="mt-3 font-semibold text-[#1e4fa3] transition group-hover:translate-x-0.5">
            Chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}
