import Link from "next/link";
import { countryRepository } from "@/server/repositories/countryRepository";
import { UniversityForm } from "@/components/admin/UniversityForm";

export const dynamic = "force-dynamic";

export default async function NewUniversityPage() {
  const countries = await countryRepository.findAll();

  return (
    <div className="mx-auto">
      <Link
        href="/admin/universities"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách trường
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Thêm trường mới
      </h1>
      <div className="mt-6">
        <UniversityForm
          countries={countries.map((c) => ({ name: c.name, slug: c.slug }))}
        />
      </div>
    </div>
  );
}
