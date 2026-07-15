import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAM_LEVEL_LABELS, type ProgramLevel } from "@/server/types";
import { universities } from "@/server/data/universities";
import { UniversityCard } from "@/components/public/UniversityCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ConsultationForm } from "@/components/public/ConsultationForm";

export function generateStaticParams() {
  return Object.keys(PROGRAM_LEVEL_LABELS).map((level) => ({ level }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const label = PROGRAM_LEVEL_LABELS[level as ProgramLevel];
  if (!label) return {};
  return {
    title: `Du học bậc ${label} — Danh sách trường & học phí`,
    description: `Các trường đối tác đào tạo bậc ${label} tại Mỹ, Canada, Úc, Anh, Hàn, Nhật, Singapore, New Zealand kèm học phí tham khảo.`,
    alternates: { canonical: `/chuong-trinh-hoc/${level}` },
  };
}

export default async function ProgramLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const label = PROGRAM_LEVEL_LABELS[level as ProgramLevel];
  if (!label) notFound();

  const matched = universities.filter((u) =>
    u.programs.some((p) => p.level === level),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Chương trình học", href: "/chuong-trinh-hoc" },
          { label },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        Du học bậc {label}
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {matched.length} trường đối tác đang đào tạo bậc {label}. Đăng ký tư vấn
        để được so sánh chi tiết học phí và điều kiện từng trường.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {matched.map((u) => (
          <UniversityCard key={u.slug} university={u} />
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-slate-100 sm:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Tư vấn lộ trình bậc {label}
        </h2>
        <div className="mt-6">
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
}
