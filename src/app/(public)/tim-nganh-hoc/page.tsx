import type { Metadata } from "next";
import { programRepository } from "@/server/repositories/programRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProgramFinder } from "@/components/public/ProgramFinder";

export const metadata: Metadata = {
  title: "Tra cứu ngành học du học — Lọc theo quốc gia, bậc học và học phí",
  description:
    "So sánh hàng trăm ngành học tại các trường đối tác: học phí mỗi năm, thời lượng đào tạo, kỳ nhập học. Lọc nhanh theo quốc gia, bậc học và ngân sách của bạn.",
  alternates: { canonical: "/tim-nganh-hoc" },
};

// ISR: dữ liệu ngành đổi không thường xuyên, revalidate mỗi giờ
export const revalidate = 3600;

export default async function ProgramFinderPage() {
  const [programs, universities, countries] = await Promise.all([
    programRepository.filter({ activeOnly: true }),
    universityRepository.findAll(),
    countryRepository.findAll(),
  ]);

  const refs = universities.map((u) => ({
    slug: u.slug,
    name: u.name,
    city: u.city,
    countrySlug: u.countrySlug,
    ranking: u.ranking,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb items={[{ label: "Tra cứu ngành học" }]} />

      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Công cụ chọn ngành"
          title="Tìm ngành học phù hợp với bạn"
          description={`So sánh ${programs.length} ngành học tại ${universities.length} trường đối tác — lọc theo quốc gia, bậc học và ngân sách để thấy ngay lựa chọn khả thi.`}
        />
      </div>

      <div className="mt-8">
        <ProgramFinder
          programs={programs}
          universities={refs}
          countries={countries.map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </div>
    </div>
  );
}
