import type { Metadata } from "next";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản sử dụng website GlobalEdu: quyền và trách nhiệm của người dùng, giới hạn trách nhiệm về thông tin tham khảo.",
  alternates: { canonical: "/dieu-khoan-su-dung" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Điều khoản sử dụng" }]} />
      <h1 className="mt-8 text-3xl font-extrabold text-slate-900">
        Điều khoản sử dụng
      </h1>
      <div className="prose-content mt-6">
        <h2>1. Phạm vi thông tin</h2>
        <p>
          Thông tin về trường học, học phí, học bổng và chính sách visa trên
          website {siteConfig.name} được cập nhật thường xuyên nhưng chỉ mang
          tính <strong>tham khảo</strong>. Học phí và chính sách có thể thay đổi
          theo quyết định của trường/chính phủ các nước. Vui lòng xác nhận thông
          tin mới nhất với tư vấn viên trước khi ra quyết định.
        </p>
        <h2>2. Sử dụng nội dung</h2>
        <p>
          Nội dung trên website thuộc bản quyền của {siteConfig.name}. Bạn được
          phép chia sẻ với trích dẫn nguồn; không được sao chép hàng loạt cho
          mục đích thương mại khi chưa có văn bản đồng ý.
        </p>
        <h2>3. Trách nhiệm của người dùng</h2>
        <ul>
          <li>Cung cấp thông tin chính xác khi đăng ký tư vấn.</li>
          <li>Không sử dụng form đăng ký để gửi thông tin rác, quấy rối.</li>
          <li>Không can thiệp trái phép vào hệ thống website.</li>
        </ul>
        <h2>4. Giới hạn trách nhiệm</h2>
        <p>
          {siteConfig.name} nỗ lực hỗ trợ tối đa nhưng không cam kết kết quả
          trúng tuyển/visa vì quyết định cuối cùng thuộc về trường và cơ quan
          lãnh sự. Mọi cam kết dịch vụ cụ thể được quy định trong hợp đồng tư
          vấn ký kết giữa hai bên.
        </p>
        <h2>5. Liên hệ</h2>
        <p>
          Mọi thắc mắc về điều khoản, vui lòng liên hệ{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </div>
  );
}
