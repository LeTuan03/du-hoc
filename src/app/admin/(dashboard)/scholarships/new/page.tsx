import Link from "next/link";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { ScholarshipForm } from "@/components/admin/ScholarshipForm";

export const dynamic = "force-dynamic";

export default async function NewScholarshipPage() {
  const [countries, universities] = await Promise.all([
    countryRepository.findAll(),
    universityRepository.findAll(),
  ]);

  return (
    <div className="mx-auto">
      <Link
        href="/admin/scholarships"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách học bổng
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Thêm học bổng mới
      </h1>
      <div className="mt-6">
        <ScholarshipForm
          countries={countries.map((c) => ({ name: c.name, slug: c.slug }))}
          universities={universities.map((u) => ({ name: u.name, slug: u.slug }))}
        />
      </div>
    </div>
  );
}
