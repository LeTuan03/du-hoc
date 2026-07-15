import type { Metadata } from "next";
import Link from "next/link";
import { PROGRAM_LEVEL_LABELS, type ProgramLevel } from "@/server/types";
import { universities } from "@/server/data/universities";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "Chương trình học — Đại học, Thạc sĩ, Dự bị, Chuyển tiếp",
  description:
    "Khám phá các bậc học du học: đại học, sau đại học, cao đẳng, thạc sĩ, tiến sĩ, dự bị đại học và chuyển tiếp — kèm danh sách trường phù hợp.",
  alternates: { canonical: "/chuong-trinh-hoc" },
};

const levelDescriptions: Record<ProgramLevel, string> = {
  "dai-hoc": "Chương trình cử nhân 3-4 năm — lựa chọn phổ biến nhất sau THPT.",
  "sau-dai-hoc": "Các chương trình sau cử nhân: chứng chỉ, diploma nâng cao.",
  "cao-dang": "Lộ trình tiết kiệm chi phí, dễ chuyển tiếp lên đại học.",
  "thac-si": "Nâng cao chuyên môn 1-2 năm, dễ xin học bổng khi có kinh nghiệm.",
  "tien-si": "Nghiên cứu chuyên sâu, thường được tài trợ toàn phần.",
  "du-bi-dai-hoc": "Bước đệm 6-12 tháng vào thẳng đại học khi chưa đủ điều kiện.",
  "chuyen-tiep": "Học 1-2 năm trong nước rồi chuyển tiếp lấy bằng nước ngoài.",
};

const levelIcons: Record<ProgramLevel, string> = {
  "dai-hoc": "🎓",
  "sau-dai-hoc": "📚",
  "cao-dang": "🏫",
  "thac-si": "👨‍🎓",
  "tien-si": "🔬",
  "du-bi-dai-hoc": "🚀",
  "chuyen-tiep": "🔄",
};

export default function ProgramsPage() {
  const countByLevel = (level: ProgramLevel) =>
    universities.filter((u) => u.programs.some((p) => p.level === level)).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Chương trình học" }]} />
      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Bậc học"
          title="Chương trình học phù hợp với bạn"
          description="Mỗi bậc học có yêu cầu đầu vào, chi phí và lộ trình khác nhau — chọn bậc học để xem các trường đào tạo."
        />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(PROGRAM_LEVEL_LABELS) as ProgramLevel[]).map((level) => (
          <Link
            key={level}
            href={`/chuong-trinh-hoc/${level}`}
            className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="text-4xl" aria-hidden>
              {levelIcons[level]}
            </span>
            <h2 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-[#1e4fa3]">
              {PROGRAM_LEVEL_LABELS[level]}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              {levelDescriptions[level]}
            </p>
            <p className="mt-4 text-sm font-bold text-[#1e4fa3]">
              {countByLevel(level)} trường đào tạo →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
