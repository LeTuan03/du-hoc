import Link from "next/link";
import { testimonialRepository } from "@/server/repositories/testimonialRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { TestimonialsTable } from "@/components/admin/tables/TestimonialsTable";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const [testimonials, countries] = await Promise.all([
    testimonialRepository.findAll(),
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
            Cảm nhận học viên
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {testimonials.length} chia sẻ
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          + Thêm chia sẻ
        </Link>
      </div>
      <TestimonialsTable testimonials={testimonials} countryNames={countryNames} />
    </div>
  );
}
