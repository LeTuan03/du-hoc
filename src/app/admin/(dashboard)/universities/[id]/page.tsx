import Link from "next/link";
import { notFound } from "next/navigation";
import { universityRepository } from "@/server/repositories/universityRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { UniversityForm } from "@/components/admin/UniversityForm";

export const dynamic = "force-dynamic";

export default async function EditUniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [university, countries] = await Promise.all([
    universityRepository.findById(id),
    countryRepository.findAll(),
  ]);
  if (!university) notFound();

  return (
    <div className="mx-auto">
      <Link
        href="/admin/universities"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách trường
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Sửa thông tin trường
      </h1>
      <div className="mt-6">
        <UniversityForm
          university={university}
          countries={countries.map((c) => ({ name: c.name, slug: c.slug }))}
        />
      </div>
    </div>
  );
}
