import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { universityRepository } from "@/server/repositories/universityRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { PROGRAM_LEVEL_LABELS } from "@/server/types";
import { UniversityCard } from "@/components/public/UniversityCard";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { Tabs } from "@/components/public/Tabs";
import { Flag } from "@/components/public/Flag";
import { JsonLd } from "@/components/public/JsonLd";
import { formatTuitionRange, formatUSD, gradientFor } from "@/lib/format";

export async function generateStaticParams() {
  const universities = await universityRepository.findAll();
  return universities.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = await universityRepository.findBySlug(slug);
  if (!u) return {};
  const country = await countryRepository.findBySlug(u.countrySlug);
  return {
    title: `${u.name} — Học phí, học bổng, điều kiện tuyển sinh`,
    description: `Thông tin tuyển sinh ${u.name} (${u.city}, ${country?.name}): học phí ${formatTuitionRange(u.tuitionMin, u.tuitionMax)}, yêu cầu ${u.englishRequirements}. Tư vấn hồ sơ miễn phí.`,
    alternates: { canonical: `/truong/${u.slug}` },
  };
}

const universityCampusImages: Record<string, string> = {
  my: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
  canada: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1200&auto=format&fit=crop",
  uc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
  anh: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=1200&auto=format&fit=crop",
  "han-quoc": "https://images.unsplash.com/photo-1607242792481-37f27e1ef14e?q=80&w=1200&auto=format&fit=crop",
  "nhat-ban": "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200&auto=format&fit=crop",
  singapore: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=1200&auto=format&fit=crop",
  "new-zealand": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
};

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const university = await universityRepository.findBySlug(slug);
  if (!university) notFound();

  const [country, activeScholarships, sameCountry] = await Promise.all([
    countryRepository.findBySlug(university.countrySlug),
    scholarshipRepository.findActive(),
    universityRepository.filter({ country: university.countrySlug }),
  ]);
  const universityScholarships = activeScholarships.filter(
    (s) => s.universitySlug === slug,
  );
  const related = sameCountry.filter((u) => u.slug !== slug).slice(0, 3);

  const initials = university.name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join("");

  const tabs = [
    {
      label: "Giới thiệu",
      content: (
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: university.description }}
        />
      ),
    },
    {
      label: "Chương trình & Học phí",
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Chương trình</th>
                <th className="py-3 pr-4">Bậc học</th>
                <th className="py-3 pr-4">Thời gian</th>
                <th className="py-3">Học phí/năm</th>
              </tr>
            </thead>
            <tbody>
              {university.programs.map((p, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="rounded-full bg-[#e8f0fc] px-2.5 py-1 text-xs font-semibold text-[#1e4fa3]">
                      {PROGRAM_LEVEL_LABELS[p.level]}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    {p.durationMonths} tháng
                  </td>
                  <td className="py-3.5 font-semibold text-slate-900">
                    {formatUSD(p.tuitionPerYear)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      label: "Điều kiện tuyển sinh",
      content: (
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-slate-900">Yêu cầu học thuật</h3>
            <ul className="mt-2 space-y-2">
              {university.admissionRequirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700">
                  <span className="mt-1 text-emerald-600">✓</span> {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Yêu cầu ngoại ngữ</h3>
            <p className="mt-2 text-slate-700">{university.englishRequirements}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Chi phí & Ký túc xá",
      content: (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Học phí
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatTuitionRange(university.tuitionMin, university.tuitionMax)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sinh hoạt phí
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {university.livingCost}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Ký túc xá</h3>
            <p className="mt-2 leading-relaxed text-slate-700">
              {university.dormitoryInfo}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          name: university.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: university.city,
            addressCountry: country?.name,
          },
          description: `${university.name} tại ${university.city}, ${country?.name}`,
        }}
      />

      {/* Banner */}
      <section
        className={`relative overflow-hidden text-white`}
      >
        <img
          src={universityCampusImages[university.countrySlug] || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"}
          alt={`Khuôn viên ${university.name}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <Breadcrumb
            items={[
              { label: "Trường", href: "/truong" },
              { label: university.name },
            ]}
          />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white text-2xl font-extrabold text-[#1e4fa3] shadow-xl">
                {initials}
              </span>
              <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                  {university.name}
                </h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
                  <span className="flex items-center gap-1.5">
                    {country && (
                      <Flag country={country.slug} className="h-3.5 w-[21px] rounded-[2px]" />
                    )}
                    {university.city}, {country?.name}
                  </span>
                  {university.ranking && (
                    <span className="rounded-full bg-[#f5c451] px-2.5 py-0.5 text-xs font-bold text-[#123a7a]">
                      ⭐ #{university.ranking} {university.rankingSource}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <a
              href="#dang-ky"
              className="rounded-xl bg-[#f5c451] px-6 py-3 font-bold text-[#123a7a] shadow-lg transition hover:bg-[#ffd97a]"
            >
              Đăng ký tư vấn ngay
            </a>
          </div>
        </div>
      </section>

      {/* Nội dung tabs */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs items={tabs} />

              {/* Học bổng của trường */}
              {universityScholarships.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Học bổng tại {university.name}
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {universityScholarships.map((s) => (
                      <ScholarshipCard key={s.slug} scholarship={s} />
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ riêng của trường */}
              {university.faqs.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Câu hỏi thường gặp về {university.name}
                  </h2>
                  <div className="mt-5">
                    <FaqAccordion items={university.faqs} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar tóm tắt + CTA */}
            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                <h2 className="font-bold text-slate-900">Thông tin nhanh</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Học phí</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {formatTuitionRange(university.tuitionMin, university.tuitionMax)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Sinh hoạt phí</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {university.livingCost}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Ngoại ngữ</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {university.englishRequirements.split("(")[0].trim()}
                    </dd>
                  </div>
                  {university.ranking && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Xếp hạng</dt>
                      <dd className="text-right font-semibold text-slate-900">
                        #{university.ranking} ({university.rankingSource})
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Chuyên ngành thế mạnh
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {university.majors.map((m) => (
                      <Link
                        key={m}
                        href={`/truong?nganh=${encodeURIComponent(m)}`}
                        className="rounded-full bg-[#e8f0fc] px-2.5 py-1 text-xs font-medium text-[#1e4fa3] hover:bg-[#d5e5fa]"
                      >
                        {m}
                      </Link>
                    ))}
                  </div>
                </div>
                <a
                  href="#dang-ky"
                  className="mt-5 block w-full rounded-lg bg-[#1e4fa3] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#123a7a]"
                >
                  Nhận tư vấn về trường này
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Form prefill trường */}
      <section id="dang-ky" className="bg-slate-50 py-14">
        <div className="mx-auto px-4">
          <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Đăng ký tư vấn — {university.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Chuyên gia phụ trách {country?.name} sẽ phân tích hồ sơ của bạn và
              tư vấn lộ trình vào {university.name}.
            </p>
            <div className="mt-6">
              <ConsultationForm
                prefillCountry={university.countrySlug}
                prefillUniversity={university.slug}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trường liên quan */}
      {related.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Trường khác tại {country?.name}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((u) => (
                <UniversityCard key={u.slug} university={u} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
