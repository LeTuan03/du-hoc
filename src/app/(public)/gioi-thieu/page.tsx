import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { StatCounter } from "@/components/public/StatCounter";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu về GlobalEdu — 12 năm đồng hành cùng du học sinh Việt",
  description:
    "GlobalEdu là đơn vị tư vấn du học uy tín với 12 năm kinh nghiệm, 500+ trường đối tác tại 12 quốc gia và hơn 5.000 học viên thành công.",
  alternates: { canonical: "/gioi-thieu" },
};

const values = [
  {
    icon: "🎯",
    title: "Tư vấn đúng năng lực",
    desc: "Không vẽ vời trường 'sang' vượt khả năng — chúng tôi phân tích thực tế hồ sơ và tài chính để chọn phương án tối ưu nhất.",
  },
  {
    icon: "🤝",
    title: "Minh bạch chi phí",
    desc: "Mọi khoản phí được báo giá rõ ràng bằng văn bản trước khi ký hợp đồng. Nhiều trường đối tác miễn phí toàn bộ dịch vụ.",
  },
  {
    icon: "🛡️",
    title: "Đồng hành trọn vẹn",
    desc: "Từ buổi tư vấn đầu tiên đến khi bạn ổn định cuộc sống ở nước ngoài — kể cả gia hạn visa, chuyển trường sau này.",
  },
  {
    icon: "📈",
    title: "Kết quả kiểm chứng",
    desc: "Tỷ lệ đậu visa 95%, hơn 200 suất học bổng mỗi năm — số liệu được cập nhật công khai từ hệ thống quản lý hồ sơ.",
  },
];

const milestones = [
  { year: "2014", event: "Thành lập văn phòng đầu tiên tại TP.HCM, tập trung thị trường Úc & Canada" },
  { year: "2017", event: "Mở rộng sang Hàn Quốc, Nhật Bản; đạt mốc 1.000 học viên" },
  { year: "2020", event: "Chuyển đổi số toàn bộ quy trình tư vấn, hỗ trợ online 100% trong đại dịch" },
  { year: "2022", event: "Trở thành đối tác tuyển sinh chính thức của 300+ trường; mở văn phòng Hà Nội" },
  { year: "2025", event: "Đạt 5.000 học viên thành công, 500+ trường đối tác tại 12 quốc gia" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Giới thiệu" }]} />

      <div className="mt-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-[#1e4fa3]">
          Về chúng tôi
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          12 năm chắp cánh ước mơ du học Việt
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {siteConfig.name} ra đời từ chính trải nghiệm du học của những người
          sáng lập — với niềm tin rằng mọi học sinh Việt Nam đều xứng đáng có cơ
          hội tiếp cận giáo dục quốc tế với thông tin minh bạch và chi phí hợp
          lý.
        </p>
      </div>

      {/* Thống kê */}
      <div className="mt-12 grid grid-cols-2 gap-8 rounded-3xl bg-slate-50 p-8 sm:grid-cols-3 lg:grid-cols-5">
        <StatCounter value={siteConfig.stats.universities} label="Trường đối tác" />
        <StatCounter value={siteConfig.stats.countries} label="Quốc gia" />
        <StatCounter value={siteConfig.stats.students} label="Học viên thành công" />
        <StatCounter value={siteConfig.stats.scholarships} label="Học bổng mỗi năm" />
        <StatCounter value={siteConfig.stats.visaRate} label="Tỷ lệ đậu visa" />
      </div>

      {/* Giá trị cốt lõi */}
      <h2 className="mt-16 text-2xl font-extrabold text-slate-900">
        Giá trị cốt lõi
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {values.map((v) => (
          <div
            key={v.title}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <span className="text-3xl" aria-hidden>
              {v.icon}
            </span>
            <h3 className="mt-3 font-bold text-slate-900">{v.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {v.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Cột mốc */}
      <h2 className="mt-16 text-2xl font-extrabold text-slate-900">
        Hành trình phát triển
      </h2>
      <ol className="mt-6 space-y-0 border-l-2 border-[#e8f0fc] pl-6">
        {milestones.map((m) => (
          <li key={m.year} className="relative pb-8">
            <span className="absolute -left-[31px] grid h-4 w-4 place-items-center rounded-full bg-[#1e4fa3] ring-4 ring-white" />
            <p className="text-sm font-extrabold text-[#1e4fa3]">{m.year}</p>
            <p className="mt-1 text-slate-700">{m.event}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-3xl bg-[#123a7a] p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-extrabold">Gặp đội ngũ tư vấn của chúng tôi</h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          Đặt lịch tư vấn miễn phí tại văn phòng hoặc online — chúng tôi luôn sẵn
          sàng lắng nghe câu chuyện của bạn.
        </p>
        <Link
          href="/dang-ky-tu-van"
          className="mt-6 inline-block rounded-xl bg-[#f5c451] px-8 py-3.5 font-bold text-[#123a7a] shadow-lg transition hover:bg-[#ffd97a]"
        >
          Đặt lịch tư vấn
        </Link>
      </div>
    </div>
  );
}
