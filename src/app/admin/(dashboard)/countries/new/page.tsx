import Link from "next/link";
import { CountryForm } from "@/components/admin/CountryForm";

export const dynamic = "force-dynamic";

export default function NewCountryPage() {
  return (
    <div className="mx-auto">
      <Link
        href="/admin/countries"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách quốc gia
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Thêm quốc gia mới
      </h1>
      <div className="mt-6">
        <CountryForm />
      </div>
    </div>
  );
}
