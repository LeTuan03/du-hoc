import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { articleRepository } from "@/server/repositories/articleRepository";
import { testimonialRepository } from "@/server/repositories/testimonialRepository";
import { faqRepository } from "@/server/repositories/faqRepository";
import { PROGRAM_LEVEL_LABELS, type ProgramLevel } from "@/server/types";
import { SectionHeading } from "@/components/public/SectionHeading";
import { StatCounter } from "@/components/public/StatCounter";
import { CountryCard } from "@/components/public/CountryCard";
import { UniversityCard } from "@/components/public/UniversityCard";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { TestimonialSlider } from "@/components/public/TestimonialSlider";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import { daysUntil } from "@/lib/format";
import heroStudents from "@/assets/images/hero_students_1784108044388.jpg";

export const revalidate = 3600;

// Thứ tự theo lộ trình học tập, kèm mô tả ngắn cho từng bậc
const programPathway: {
  level: ProgramLevel;
  description: string;
  duration: string;
}[] = [
  {
    level: "du-bi-dai-hoc",
    description: "Củng cố ngoại ngữ và kiến thức nền trước khi vào chính khóa",
    duration: "6–12 tháng",
  },
  {
    level: "cao-dang",
    description: "Thiên về thực hành, học phí thấp, dễ liên thông lên đại học",
    duration: "2–3 năm",
  },
  {
    level: "chuyen-tiep",
    description: "Bắt đầu tại Việt Nam, nhận bằng tốt nghiệp của trường nước ngoài",
    duration: "2+2 · 1+3",
  },
  {
    level: "dai-hoc",
    description: "Chương trình cử nhân tại hơn 500 trường đối tác",
    duration: "3–4 năm",
  },
  {
    level: "sau-dai-hoc",
    description: "Văn bằng và chứng chỉ sau đại học ngắn hạn",
    duration: "8–12 tháng",
  },
  {
    level: "thac-si",
    description: "Nâng cao chuyên môn, mở rộng cơ hội ở lại làm việc",
    duration: "1–2 năm",
  },
  {
    level: "tien-si",
    description: "Nghiên cứu chuyên sâu với nhiều học bổng toàn phần",
    duration: "3–5 năm",
  },
];

export default async function HomePage() {
  const [countries, universities, activeScholarships, articles, testimonials, globalFaqs] =
    await Promise.all([
      countryRepository.findAll(),
      universityRepository.findAll(),
      scholarshipRepository.findActive(),
      articleRepository.findAll(),
      testimonialRepository.findAll(),
      faqRepository.findAll(),
    ]);

  const featuredUniversities = universities
    .filter((u) => u.isFeatured)
    .slice(0, 6);
  // findActive sắp theo deadline gần nhất — loại học bổng đã quá hạn
  // để chúng không chiếm các vị trí đầu của khối nổi bật
  const featuredScholarships = activeScholarships
    .filter((s) => daysUntil(s.deadline) > 0)
    .slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: siteConfig.fullName,
          url: siteConfig.url,
          description: siteConfig.description,
          telephone: siteConfig.hotline,
          email: siteConfig.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address,
            addressCountry: "VN",
          },
        }}
      />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#123a7a] via-[#1e4fa3] to-[#2563c9] text-white">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_80%_20%,rgba(245,196,81,0.3),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              ✨ 12 năm kinh nghiệm — Tỷ lệ đậu visa 95%
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Chắp cánh ước mơ{" "}
              <span className="text-[#f5c451]">du học quốc tế</span> của bạn
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
              Tư vấn miễn phí lộ trình du học Mỹ, Canada, Úc, Anh, Hàn, Nhật,
              Singapore, New Zealand — từ chọn trường, săn học bổng đến visa và
              ổn định cuộc sống.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dang-ky-tu-van"
                className="rounded-xl bg-[#f5c451] px-7 py-3.5 text-base font-bold text-[#123a7a] shadow-lg transition hover:bg-[#ffd97a] hover:shadow-xl"
              >
                Đăng ký tư vấn miễn phí
              </Link>
              <Link
                href="/truong"
                className="rounded-xl border-2 border-white/40 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:border-white hover:bg-white/10"
              >
                Khám phá 500+ trường →
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-blue-100">
              <div className="flex -space-x-2">
                {["N", "T", "L", "P"].map((c, i) => (
                  <span
                    key={i}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#1e4fa3] bg-white text-xs font-bold text-[#1e4fa3]"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p>
                <strong className="text-white">5.000+ học viên</strong> đã tin
                tưởng đồng hành
              </p>
            </div>
          </div>

          {/* Visual bên phải */}
          <div className="relative hidden lg:block animate-fade-in">
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-4 overflow-hidden rounded-3xl bg-slate-100 shadow-2xl border-4 border-white/10 ring-1 ring-white/20">
                <img
                  src={heroStudents.src}
                  alt="Du học sinh thành công tại GlobalEdu"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123a7a]/50 via-transparent to-transparent" />
              </div>
              {/* Floating cards */}
              <div className="absolute -left-4 top-10 rounded-2xl bg-white/95 backdrop-blur p-4 text-slate-900 shadow-xl ring-1 ring-black/5 transition duration-300 hover:-translate-y-1">
                <p className="text-2xl font-extrabold text-[#1e4fa3]">95%</p>
                <p className="text-xs font-semibold text-slate-500">Tỷ lệ đậu visa</p>
              </div>
              <div className="absolute -right-4 top-32 rounded-2xl bg-white/95 backdrop-blur p-4 text-slate-900 shadow-xl ring-1 ring-black/5 transition duration-300 hover:-translate-y-1">
                <p className="text-2xl font-extrabold text-amber-600">200+</p>
                <p className="text-xs font-semibold text-slate-500">Suất học bổng/năm</p>
              </div>
              <div className="absolute bottom-6 left-4 rounded-2xl bg-white/95 backdrop-blur p-4 text-slate-900 shadow-xl ring-1 ring-black/5 transition duration-300 hover:-translate-y-1">
                <p className="text-2xl font-extrabold text-emerald-600">12</p>
                <p className="text-xs font-semibold text-slate-500">Quốc gia đối tác</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THỐNG KÊ ===== */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-3 lg:grid-cols-5">
          <StatCounter value={siteConfig.stats.universities} label="Trường đối tác" />
          <StatCounter value={siteConfig.stats.countries} label="Quốc gia" />
          <StatCounter value={siteConfig.stats.students} label="Học viên thành công" />
          <StatCounter value={siteConfig.stats.scholarships} label="Học bổng mỗi năm" />
          <StatCounter value={siteConfig.stats.visaRate} label="Tỷ lệ đậu visa" />
        </div>
      </section>

      {/* ===== QUỐC GIA ===== */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Điểm đến du học"
              title="Chọn quốc gia phù hợp với bạn"
              description="Mỗi quốc gia có thế mạnh riêng về chi phí, chính sách làm việc và định cư — khám phá để tìm điểm đến lý tưởng."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {countries.map((country, i) => (
              <Reveal key={country.slug} delay={i * 60}>
                <CountryCard country={country} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRƯỜNG NỔI BẬT ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Trường đối tác"
                title="Trường đại học nổi bật"
                description="Các trường hàng đầu được học viên GlobalEdu lựa chọn nhiều nhất."
              />
              <Link
                href="/truong"
                className="rounded-lg border-2 border-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-[#1e4fa3] transition hover:bg-[#e8f0fc]"
              >
                Xem tất cả →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredUniversities.map((u, i) => (
              <Reveal key={u.slug} delay={i * 60}>
                <UniversityCard university={u} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHƯƠNG TRÌNH HỌC ===== */}
      <section className="bg-[#123a7a] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#f5c451]">
                Chương trình học
              </p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Lộ trình cho mọi bậc học
              </h2>
              <p className="mt-3 text-blue-100">
                Từ dự bị đại học đến tiến sĩ — chúng tôi thiết kế lộ trình phù
                hợp với học lực và ngân sách của bạn.
              </p>
              <Link
                href="/chuong-trinh-hoc"
                className="mt-8 inline-block rounded-lg border-2 border-white/40 px-5 py-2.5 text-sm font-bold transition hover:border-white hover:bg-white/10"
              >
                Xem tất cả chương trình →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {programPathway.map(({ level, description, duration }, i) => (
                <li key={level}>
                  <Link
                    href={`/chuong-trinh-hoc/${level}`}
                    className="group flex items-center gap-5 py-4"
                  >
                    <span className="w-7 shrink-0 text-sm font-bold text-[#f5c451]/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="font-bold transition group-hover:text-[#f5c451]">
                        {PROGRAM_LEVEL_LABELS[level]}
                      </span>
                      <span className="mt-0.5 block text-sm text-blue-200/80">
                        {description}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-sm text-blue-200/60 sm:block">
                      {duration}
                    </span>
                    <span
                      className="shrink-0 text-blue-200/60 transition group-hover:translate-x-1 group-hover:text-[#f5c451]"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===== HỌC BỔNG ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Săn học bổng"
                title="Học bổng nổi bật đang mở"
                description="Cập nhật liên tục các học bổng giá trị từ chính phủ và các trường đối tác."
              />
              <Link
                href="/hoc-bong"
                className="rounded-lg border-2 border-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-[#1e4fa3] transition hover:bg-[#e8f0fc]"
              >
                Xem tất cả →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredScholarships.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <ScholarshipCard scholarship={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIN TỨC ===== */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Tin tức & cẩm nang"
                title="Bài viết mới nhất"
              />
              <Link
                href="/tin-tuc"
                className="rounded-lg border-2 border-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-[#1e4fa3] transition hover:bg-[#e8f0fc]"
              >
                Xem tất cả →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CÂU CHUYỆN HỌC VIÊN ===== */}
      <section className="bg-gradient-to-b from-white to-[#e8f0fc]/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Câu chuyện thành công"
              title="Học viên nói gì về GlobalEdu?"
            />
          </Reveal>
          <div className="mt-10">
            <TestimonialSlider items={testimonials} />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/cau-chuyen-hoc-vien"
              className="text-sm font-bold text-[#1e4fa3] underline-offset-4 hover:underline"
            >
              Xem tất cả câu chuyện học viên →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Giải đáp thắc mắc"
              title="Câu hỏi thường gặp"
            />
          </Reveal>
          <div className="mt-10">
            <FaqAccordion items={globalFaqs} initialVisible={6} />
          </div>
        </div>
      </section>

      {/* ===== FORM ĐĂNG KÝ ===== */}
      <section id="dang-ky" className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Bắt đầu hành trình"
                title="Đăng ký tư vấn miễn phí"
                description="Điền thông tin để nhận lộ trình du học cá nhân hóa từ chuyên gia — hoàn toàn miễn phí, không ràng buộc."
              />
              <ul className="mt-8 space-y-4">
                {[
                  "Phân tích hồ sơ & định hướng quốc gia phù hợp",
                  "Danh sách trường + học bổng khớp năng lực",
                  "Dự toán chi phí chi tiết theo từng lộ trình",
                  "Chiến lược visa với tỷ lệ đậu 95%",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </span>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-[#123a7a] p-5 text-white">
                <p className="text-sm text-blue-200">Hotline tư vấn 24/7</p>
                <a
                  href={siteConfig.hotlineHref}
                  className="text-2xl font-extrabold text-[#f5c451]"
                >
                  {siteConfig.hotline}
                </a>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-3">
            <Reveal delay={100}>
              <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] sm:p-8">
                <ConsultationForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
