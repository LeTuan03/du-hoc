import Link from "next/link";
import { notFound } from "next/navigation";
import { testimonialRepository } from "@/server/repositories/testimonialRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [testimonial, countries] = await Promise.all([
    testimonialRepository.findById(id),
    countryRepository.findAll(),
  ]);
  if (!testimonial) notFound();

  return (
    <div className="mx-auto">
      <Link
        href="/admin/testimonials"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách chia sẻ
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Sửa chia sẻ học viên
      </h1>
      <div className="mt-6">
        <TestimonialForm
          testimonial={testimonial}
          countries={countries.map((c) => ({ name: c.name, slug: c.slug }))}
        />
      </div>
    </div>
  );
}
