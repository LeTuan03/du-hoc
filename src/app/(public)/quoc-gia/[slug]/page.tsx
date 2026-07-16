import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { articleRepository } from "@/server/repositories/articleRepository";
import { UniversityCard } from "@/components/public/UniversityCard";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { Flag } from "@/components/public/Flag";
import { JsonLd } from "@/components/public/JsonLd";
import { gradientFor } from "@/lib/format";

export async function generateStaticParams() {
  const countries = await countryRepository.findAll();
  return countries.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await countryRepository.findBySlug(slug);
  if (!country) return {};
  return {
    title: `Du học ${country.name} — Điều kiện, chi phí, học bổng ${new Date().getFullYear() + 1}`,
    description: country.description,
    alternates: { canonical: `/quoc-gia/${country.slug}` },
  };
}

const countryImages: Record<string, string> = {
  my: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop",
  canada: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=1200&auto=format&fit=crop",
  uc: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200&auto=format&fit=crop",
  anh: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
  "han-quoc": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
  "nhat-ban": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop",
  "new-zealand": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
};

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await countryRepository.findBySlug(slug);
  if (!country) notFound();

  const [countryUniversities, activeScholarships, articles] = await Promise.all([
    universityRepository.filter({ country: slug }),
    scholarshipRepository.findActive(),
    articleRepository.findAll(),
  ]);
  const countryScholarships = activeScholarships.filter(
    (s) => s.countrySlug === slug,
  );
  const relatedArticles = articles.slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: "/" },
            { "@type": "ListItem", position: 2, name: "Quốc gia", item: "/quoc-gia" },
            { "@type": "ListItem", position: 3, name: `Du học ${country.name}` },
          ],
        }}
      />

      {/* Banner */}
      <section
        className={`relative overflow-hidden text-white`}
      >
        <img
          src={countryImages[slug] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop"}
          alt={`Cảnh quan ${country.name}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <Breadcrumb
            items={[
              { label: "Quốc gia", href: "/quoc-gia" },
              { label: country.name },
            ]}
          />
          <div className="mt-6 flex items-center gap-5">
            <Flag
              country={slug}
              className="h-14 w-[84px] rounded-lg shadow-xl ring-2 ring-white/60"
            />
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Du học {country.name}
              </h1>
              <p className="mt-1 text-white/80">
                {country.universityCount} trường đối tác · Tỷ lệ visa{" "}
                {country.visaRate}
              </p>
            </div>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-white/90">
            {country.description}
          </p>
        </div>
      </section>

      {/* Thông tin nhanh */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Học phí trung bình
            </p>
            <p className="mt-1 font-bold text-slate-900">{country.avgTuition}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quyền làm thêm
            </p>
            <p className="mt-1 font-bold text-slate-900">{country.workRights}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tỷ lệ đậu visa (học viên GlobalEdu)
            </p>
            <p className="mt-1 font-bold text-emerald-600">{country.visaRate}</p>
          </div>
        </div>
      </section>

      {/* Lý do chọn */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Vì sao chọn du học {country.name}?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {country.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8f0fc] text-sm font-bold text-[#1e4fa3]">
                  {i + 1}
                </span>
                <p className="font-medium text-slate-700">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trường tại quốc gia */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Trường nổi bật tại {country.name}
            </h2>
            <Link
              href={`/truong?quoc_gia=${slug}`}
              className="text-sm font-bold text-[#1e4fa3] hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countryUniversities.map((u) => (
              <UniversityCard key={u.slug} university={u} />
            ))}
          </div>
        </div>
      </section>

      {/* Học bổng */}
      {countryScholarships.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Học bổng du học {country.name}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {countryScholarships.map((s) => (
                <ScholarshipCard key={s.slug} scholarship={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bài viết liên quan */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Cẩm nang du học
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Form đăng ký prefill quốc gia */}
      <section className="py-16">
        <div className="mx-auto px-4">
          <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-slate-100 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Nhận lộ trình du học {country.name} miễn phí
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Chuyên gia về {country.name} sẽ liên hệ tư vấn trong 24h.
            </p>
            <div className="mt-6">
              <ConsultationForm prefillCountry={slug} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
