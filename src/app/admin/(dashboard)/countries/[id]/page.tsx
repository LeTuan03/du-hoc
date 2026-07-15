import Link from "next/link";
import { notFound } from "next/navigation";
import { countryRepository } from "@/server/repositories/countryRepository";
import { CountryForm } from "@/components/admin/CountryForm";

export const dynamic = "force-dynamic";

export default async function EditCountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const country = await countryRepository.findById(id);
  if (!country) notFound();

  return (
    <div className="mx-auto">
      <Link
        href="/admin/countries"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách quốc gia
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Sửa quốc gia
      </h1>
      <div className="mt-6">
        <CountryForm country={country} />
      </div>
    </div>
  );
}
