import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { daysUntil, formatDate } from "@/lib/format";

export async function generateStaticParams() {
  const scholarships = await scholarshipRepository.findAll();
  return scholarships.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await scholarshipRepository.findBySlug(slug);
  if (!s) return {};
  return {
    title: `${s.name} — Giá trị, điều kiện, deadline`,
    description: s.description,
    alternates: { canonical: `/hoc-bong/${s.slug}` },
  };
}

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scholarship = await scholarshipRepository.findBySlug(slug);
  if (!scholarship) notFound();

  const [country, university, activeScholarships] = await Promise.all([
    scholarship.countrySlug
      ? countryRepository.findBySlug(scholarship.countrySlug)
      : undefined,
    scholarship.universitySlug
      ? universityRepository.findBySlug(scholarship.universitySlug)
      : undefined,
    scholarshipRepository.findActive(),
  ]);
  const remaining = daysUntil(scholarship.deadline);
  const related = activeScholarships
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-br from-amber-50 via-white to-[#e8f0fc]/60 py-10">
        <div className="mx-auto max-w-4xl px-4">
          <Breadcrumb
            items={[
              { label: "Học bổng", href: "/hoc-bong" },
              { label: scholarship.name },
            ]}
          />
          <div className="mt-6 flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#f5c451] text-2xl shadow">
              🎓
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {scholarship.name}
              </h1>
              <p className="mt-2 text-lg font-bold text-amber-700">
                💰 {scholarship.value}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {country && (
              <Link
                href={`/quoc-gia/${country.slug}`}
                className="rounded-full bg-white px-3.5 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-[#1e4fa3]"
              >
                🌍 {country.name}
              </Link>
            )}
            {university && (
              <Link
                href={`/truong/${university.slug}`}
                className="rounded-full bg-white px-3.5 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-[#1e4fa3]"
              >
                🏛 {university.name}
              </Link>
            )}
            <span
              className={`rounded-full px-3.5 py-1.5 font-bold ${
                remaining <= 30
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              ⏰ Hạn {formatDate(scholarship.deadline)} (
              {remaining > 0 ? `còn ${remaining} ngày` : "đã hết hạn"})
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose-content">
            <p>{scholarship.description}</p>
          </div>

          <h2 className="mt-8 text-xl font-extrabold text-slate-900">
            Điều kiện ứng tuyển
          </h2>
          <ul className="mt-4 space-y-3">
            {scholarship.conditions.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {i + 1}
                </span>
                <span className="text-slate-700">{c}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-slate-100 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Đăng ký tư vấn săn học bổng này
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Mentor học bổng sẽ đánh giá hồ sơ của bạn và xây dựng chiến lược
              ứng tuyển — hỗ trợ bài luận, thư giới thiệu và phỏng vấn.
            </p>
            <div className="mt-6">
              <ConsultationForm
                prefillCountry={scholarship.countrySlug ?? undefined}
                prefillUniversity={scholarship.universitySlug ?? undefined}
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Học bổng khác đang mở
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ScholarshipCard key={s.slug} scholarship={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
