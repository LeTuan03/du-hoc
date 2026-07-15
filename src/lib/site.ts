/** Cấu hình site tập trung — tương ứng bảng `settings` trong SRS */
export const siteConfig = {
  name: "GlobalEdu",
  fullName: "GlobalEdu — Tư vấn Du học Quốc tế",
  tagline: "Chắp cánh ước mơ du học của bạn",
  description:
    "GlobalEdu — đơn vị tư vấn du học uy tín với 12 năm kinh nghiệm, 5.000+ học viên thành công tại Mỹ, Canada, Úc, Anh, Hàn Quốc, Nhật Bản, Singapore và New Zealand. Tư vấn miễn phí, tỷ lệ đậu visa 95%.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  hotline: "1900 6868",
  hotlineHref: "tel:19006868",
  email: "tuvan@globaledu.edu.vn",
  address: "Tầng 8, Tòa nhà Diamond, 25 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
  workingHours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
  facebook: "https://facebook.com/globaledu",
  youtube: "https://youtube.com/@globaledu",
  tiktok: "https://tiktok.com/@globaledu",
  zalo: "https://zalo.me/globaledu",
  stats: {
    universities: "500+",
    countries: "12",
    students: "5.000+",
    scholarships: "200+",
    visaRate: "95%",
  },
} as const;
