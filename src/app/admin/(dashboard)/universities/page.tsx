import Link from "next/link";
import { universityRepository } from "@/server/repositories/universityRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { UniversitiesTable } from "@/components/admin/tables/UniversitiesTable";

export const dynamic = "force-dynamic";

export default async function AdminUniversitiesPage() {
  const [universities, countries] = await Promise.all([
    universityRepository.findAll(),
    countryRepository.findAll(),
  ]);
  const countryNames = Object.fromEntries(
    countries.map((c) => [c.slug, c.name]),
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý Trường
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {universities.length} trường
          </p>
        </div>
        <Link
          href="/admin/universities/new"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          + Thêm trường
        </Link>
      </div>
      <UniversitiesTable universities={universities} countryNames={countryNames} />
    </div>
  );
}
