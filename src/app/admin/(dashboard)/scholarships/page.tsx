import Link from "next/link";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { ScholarshipsTable } from "@/components/admin/tables/ScholarshipsTable";

export const dynamic = "force-dynamic";

export default async function AdminScholarshipsPage() {
  const [scholarships, countries] = await Promise.all([
    scholarshipRepository.findAll(),
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
            Quản lý Học bổng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {scholarships.length} học bổng
          </p>
        </div>
        <Link
          href="/admin/scholarships/new"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          + Thêm học bổng
        </Link>
      </div>
      <ScholarshipsTable scholarships={scholarships} countryNames={countryNames} />
    </div>
  );
}
