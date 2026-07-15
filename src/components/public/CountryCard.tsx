import Link from "next/link";
import type { Country } from "@/server/types";
import { Flag } from "./Flag";
import { gradientFor } from "@/lib/format";

export function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/quoc-gia/${country.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div
        className={`relative h-24 bg-gradient-to-br ${gradientFor(country.slug)}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
        <Flag
          country={country.slug}
          className="absolute bottom-3 left-4 h-10 w-[60px] rounded-md shadow-lg ring-2 ring-white/70"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1e4fa3]">
          Du học {country.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {country.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>🎓 {country.universityCount} trường đối tác</span>
          <span className="font-semibold text-emerald-600">
            Visa {country.visaRate}
          </span>
        </div>
      </div>
    </Link>
  );
}
