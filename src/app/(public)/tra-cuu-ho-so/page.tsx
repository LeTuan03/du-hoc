import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";
import { LeadTracker } from "@/components/public/LeadTracker";

export const metadata: Metadata = {
  title: "Tra cứu hồ sơ du học — Theo dõi tiến trình trực tuyến",
  description:
    "Nhập mã hồ sơ và email/số điện thoại đã đăng ký để xem tiến trình xét tuyển, trạng thái từng giấy tờ và lịch hẹn tư vấn sắp tới.",
  alternates: { canonical: "/tra-cuu-ho-so" },
  // Trang công cụ tra cứu, không có nội dung để index
  robots: { index: false, follow: true },
};

export default function LeadLookupPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Tra cứu hồ sơ" }]} />

      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Minh bạch tiến trình"
          title="Tra cứu hồ sơ của bạn"
          description="Xem hồ sơ đang ở bước nào, giấy tờ nào đã duyệt và cần bổ sung gì — cập nhật theo thời gian thực, không cần tạo tài khoản."
        />
      </div>

      <div className="mt-8">
        <LeadTracker />
      </div>

      <div className="mt-12 rounded-2xl bg-[#e8f0fc] p-6 text-center">
        <h2 className="font-bold text-slate-900">Chưa có mã hồ sơ?</h2>
        <p className="mt-1 text-sm text-slate-600">
          Mã hồ sơ được cấp ngay sau khi bạn gửi form đăng ký tư vấn, và cũng
          được gửi kèm trong email xác nhận.
        </p>
        <Link
          href="/dang-ky-tu-van"
          className="mt-4 inline-block rounded-lg bg-[#1e4fa3] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          Đăng ký tư vấn miễn phí
        </Link>
      </div>
    </div>
  );
}
