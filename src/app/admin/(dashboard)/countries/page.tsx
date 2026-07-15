import Link from "next/link";
import { countryRepository } from "@/server/repositories/countryRepository";
import { CountriesTable } from "@/components/admin/tables/CountriesTable";

export const dynamic = "force-dynamic";

export default async function AdminCountriesPage() {
  const countries = await countryRepository.findAll();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý Quốc gia
          </h1>
          <p className="mt-1 text-sm text-slate-500">{countries.length} quốc gia</p>
        </div>
        <Link
          href="/admin/countries/new"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          + Thêm quốc gia
        </Link>
      </div>
      <CountriesTable countries={countries} />
    </div>
  );
}
