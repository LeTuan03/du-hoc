import Link from "next/link";
import type { Country } from "@/server/types";
import { Flag } from "./Flag";

const countryImages: Record<string, string> = {
  my: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=600&auto=format&fit=crop",
  canada: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=600&auto=format&fit=crop",
  uc: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop",
  anh: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
  "han-quoc": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
  "nhat-ban": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=600&auto=format&fit=crop",
  "new-zealand": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
};

export function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/quoc-gia/${country.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative h-32 w-full overflow-hidden bg-slate-100">
        <img
          src={countryImages[country.slug] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"}
          alt={`Du học ${country.name}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/40 transition duration-300 group-hover:bg-slate-900/30" />
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
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500 border-t border-slate-50 pt-3">
          <span>🎓 {country.universityCount} trường đối tác</span>
          <span className="font-semibold text-emerald-600">
            Visa {country.visaRate}
          </span>
        </div>
      </div>
    </Link>
  );
}
