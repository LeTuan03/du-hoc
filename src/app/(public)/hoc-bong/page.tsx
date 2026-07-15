import type { Metadata } from "next";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { ScholarshipCard } from "@/components/public/ScholarshipCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "Học bổng du học mới nhất — Toàn phần & bán phần, cập nhật deadline",
  description:
    "Danh sách học bổng du học đang mở: GKS, MEXT, Pearson, ASEAN Scholarship và học bổng các trường đối tác. Cập nhật giá trị, điều kiện, deadline liên tục.",
  alternates: { canonical: "/hoc-bong" },
};

export default async function ScholarshipsPage() {
  const items = await scholarshipRepository.findActive();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Học bổng" }]} />
      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Săn học bổng"
          title="Học bổng đang mở đơn"
          description="Sắp xếp theo deadline gần nhất — đăng ký tư vấn sớm để có đủ thời gian chuẩn bị hồ sơ cạnh tranh."
        />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((s) => (
          <ScholarshipCard key={s.slug} scholarship={s} />
        ))}
      </div>
    </div>
  );
}
