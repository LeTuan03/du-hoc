import type { Metadata } from "next";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách bảo mật thông tin cá nhân của GlobalEdu: mục đích thu thập, phạm vi sử dụng, thời gian lưu trữ và quyền của người dùng.",
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Chính sách bảo mật" }]} />
      <h1 className="mt-8 text-3xl font-extrabold text-slate-900">
        Chính sách bảo mật
      </h1>
      <div className="prose-content mt-6">
        <h2>1. Mục đích thu thập thông tin</h2>
        <p>
          {siteConfig.name} thu thập thông tin cá nhân (họ tên, ngày sinh, số
          điện thoại, email, thông tin học tập) khi bạn đăng ký tư vấn, nhằm mục
          đích duy nhất: liên hệ và tư vấn lộ trình du học phù hợp với bạn.
        </p>
        <h2>2. Phạm vi sử dụng</h2>
        <ul>
          <li>Liên hệ tư vấn qua điện thoại, email, Zalo theo yêu cầu của bạn.</li>
          <li>Gửi thông tin học bổng, sự kiện tuyển sinh phù hợp với nguyện vọng đã đăng ký.</li>
          <li>Nộp hồ sơ đến trường/lãnh sự quán khi bạn ký hợp đồng dịch vụ và đồng ý bằng văn bản.</li>
        </ul>
        <p>
          Chúng tôi <strong>không bán, trao đổi hoặc chia sẻ</strong> thông tin
          của bạn cho bên thứ ba ngoài phạm vi trên.
        </p>
        <h2>3. Thời gian lưu trữ</h2>
        <p>
          Thông tin được lưu trữ tối đa 24 tháng kể từ lần tương tác cuối cùng,
          hoặc cho đến khi bạn yêu cầu xóa.
        </p>
        <h2>4. Bảo mật dữ liệu</h2>
        <p>
          Dữ liệu được lưu trữ trên hệ thống có kiểm soát truy cập, mã hóa khi
          truyền tải (HTTPS) và chỉ nhân viên tư vấn được phân quyền mới truy
          cập được.
        </p>
        <h2>5. Quyền của bạn</h2>
        <p>
          Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bất kỳ
          lúc nào bằng cách liên hệ email{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> hoặc
          hotline {siteConfig.hotline}.
        </p>
      </div>
    </div>
  );
}
