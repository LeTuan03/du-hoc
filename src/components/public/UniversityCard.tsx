import Link from "next/link";
import { Star } from "lucide-react";
import type { University } from "@/server/types";
import { countryRepository } from "@/server/repositories/countryRepository";
import { formatTuitionRange, gradientFor } from "@/lib/format";
import { Flag } from "./Flag";

const universityCampusImages: Record<string, string> = {
  my: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
  canada: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=600&auto=format&fit=crop",
  uc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
  anh: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=600&auto=format&fit=crop",
  "han-quoc": "https://images.unsplash.com/photo-1607242792481-37f27e1ef14e?q=80&w=600&auto=format&fit=crop",
  "nhat-ban": "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop",
  singapore: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=600&auto=format&fit=crop",
  "new-zealand": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
};

export async function UniversityCard({ university }: { university: University }) {
  // findAll() được cache theo request — mọi card dùng chung 1 query
  // thay vì mỗi card một findUnique riêng (N+1)
  const countries = await countryRepository.findAll();
  const country = countries.find((c) => c.slug === university.countrySlug);
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
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        <img
          src={universityCampusImages[university.countrySlug] || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"}
          alt={university.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/40 transition duration-300 group-hover:bg-slate-900/30" />
        <span className="absolute left-4 top-4 select-none rounded bg-white/20 px-2.5 py-1 text-2xl font-extrabold tracking-tight text-white backdrop-blur ring-1 ring-white/20">
          {initials}
        </span>
        {university.ranking && (
          <span className="absolute right-3 top-3 rounded-full bg-[#f5c451] px-2.5 py-1 text-xs font-bold text-[#123a7a] shadow">
            #{university.ranking} {university.rankingSource.split(" ")[0]}
          </span>
        )}
        {university.isFeatured && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            <Star size={11} className="fill-[#f5c451] text-[#f5c451]" aria-hidden />
            Nổi bật
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
