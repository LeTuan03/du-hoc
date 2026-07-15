import type { Country } from "../types";

export const countries: Country[] = [
  {
    id: "c-my",
    name: "Mỹ",
    slug: "my",
    description:
      "Hoa Kỳ là điểm đến du học số 1 thế giới với hơn 4.000 trường đại học, hệ thống giáo dục linh hoạt và cơ hội thực tập OPT lên đến 3 năm cho khối ngành STEM.",
    highlights: [
      "Hơn 4.000 trường đại học & cao đẳng cộng đồng",
      "OPT 12-36 tháng sau tốt nghiệp",
      "Học bổng đa dạng lên đến 100% học phí",
      "Nền kinh tế lớn nhất thế giới, cơ hội việc làm rộng mở",
    ],
    universityCount: 12,
    avgTuition: "25.000 - 60.000 USD/năm",
    workRights: "20h/tuần trong khuôn viên trường, OPT sau tốt nghiệp",
    visaRate: "92%",
    displayOrder: 1,
  },
  {
    id: "c-canada",
    name: "Canada",
    slug: "canada",
    description:
      "Canada nổi tiếng với chính sách định cư cởi mở sau tốt nghiệp (PGWP đến 3 năm), chi phí hợp lý hơn Mỹ và môi trường sống an toàn, đa văn hóa hàng đầu thế giới.",
    highlights: [
      "Giấy phép làm việc sau tốt nghiệp (PGWP) đến 3 năm",
      "Lộ trình định cư rõ ràng qua Express Entry",
      "Chi phí thấp hơn Mỹ/Anh 20-30%",
      "Xã hội an toàn, thân thiện với sinh viên quốc tế",
    ],
    universityCount: 10,
    avgTuition: "18.000 - 45.000 CAD/năm",
    workRights: "24h/tuần trong kỳ học, full-time kỳ nghỉ",
    visaRate: "95%",
    displayOrder: 2,
  },
  {
    id: "c-uc",
    name: "Úc",
    slug: "uc",
    description:
      "Úc sở hữu 9 trường trong top 100 thế giới, khí hậu ôn hòa, cộng đồng người Việt lớn và chính sách visa 485 cho phép ở lại làm việc 2-4 năm sau tốt nghiệp.",
    highlights: [
      "9 trường thuộc top 100 thế giới (QS 2026)",
      "Visa 485 làm việc sau tốt nghiệp 2-4 năm",
      "Được phép làm thêm 48h/2 tuần",
      "Cộng đồng du học sinh Việt Nam đông đảo",
    ],
    universityCount: 9,
    avgTuition: "22.000 - 50.000 AUD/năm",
    workRights: "48h/2 tuần trong kỳ học",
    visaRate: "94%",
    displayOrder: 3,
  },
  {
    id: "c-anh",
    name: "Anh",
    slug: "anh",
    description:
      "Vương quốc Anh — cái nôi của giáo dục tinh hoa với Oxford, Cambridge, chương trình cử nhân chỉ 3 năm, thạc sĩ 1 năm giúp tiết kiệm đáng kể thời gian và chi phí.",
    highlights: [
      "Cử nhân 3 năm, Thạc sĩ chỉ 1 năm",
      "Graduate Route visa ở lại 2 năm sau tốt nghiệp",
      "4 trường trong top 10 thế giới",
      "Không cần phỏng vấn visa trong đa số trường hợp",
    ],
    universityCount: 8,
    avgTuition: "16.000 - 38.000 GBP/năm",
    workRights: "20h/tuần trong kỳ học",
    visaRate: "97%",
    displayOrder: 4,
  },
  {
    id: "c-han-quoc",
    name: "Hàn Quốc",
    slug: "han-quoc",
    description:
      "Hàn Quốc thu hút du học sinh Việt với chi phí phải chăng, học bổng chính phủ GKS hào phóng, văn hóa gần gũi và cơ hội việc làm tại các tập đoàn lớn như Samsung, LG.",
    highlights: [
      "Học phí chỉ từ 4.000 USD/năm",
      "Học bổng chính phủ GKS toàn phần",
      "Làm thêm 25h/tuần từ năm 2",
      "Cơ hội làm việc tại Samsung, LG, Hyundai",
    ],
    universityCount: 8,
    avgTuition: "4.000 - 12.000 USD/năm",
    workRights: "25h/tuần (sau 6 tháng, TOPIK 2+)",
    visaRate: "96%",
    displayOrder: 5,
  },
  {
    id: "c-nhat-ban",
    name: "Nhật Bản",
    slug: "nhat-ban",
    description:
      "Nhật Bản kết hợp giáo dục chất lượng cao với chi phí hợp lý, nhiều học bổng MEXT/JASSO, và thị trường lao động đang rất khát nhân lực quốc tế trẻ.",
    highlights: [
      "Học bổng MEXT toàn phần của chính phủ",
      "Làm thêm hợp pháp 28h/tuần",
      "Thiếu hụt lao động — dễ xin việc sau tốt nghiệp",
      "Văn hóa an toàn, kỷ luật, giao thông thuận tiện",
    ],
    universityCount: 7,
    avgTuition: "5.000 - 15.000 USD/năm",
    workRights: "28h/tuần với giấy phép",
    visaRate: "93%",
    displayOrder: 6,
  },
  {
    id: "c-singapore",
    name: "Singapore",
    slug: "singapore",
    description:
      "Singapore — trung tâm giáo dục châu Á chỉ cách Việt Nam 2 giờ bay, với NUS & NTU thuộc top 15 thế giới, môi trường song ngữ Anh - Hoa và cực kỳ an toàn.",
    highlights: [
      "NUS & NTU thuộc top 15 thế giới",
      "Cách Việt Nam chỉ 2 giờ bay",
      "Tutition Grant giảm đến 50% học phí (cam kết làm việc 3 năm)",
      "Quốc gia an toàn nhất châu Á",
    ],
    universityCount: 6,
    avgTuition: "15.000 - 40.000 SGD/năm",
    workRights: "16h/tuần (trường công lập)",
    visaRate: "98%",
    displayOrder: 7,
  },
  {
    id: "c-new-zealand",
    name: "New Zealand",
    slug: "new-zealand",
    description:
      "New Zealand có hệ thống giáo dục chuẩn Anh Quốc, cảnh quan thiên nhiên tuyệt đẹp, chính sách work visa 3 năm sau tốt nghiệp và chi phí sinh hoạt dễ chịu.",
    highlights: [
      "100% trường đại học thuộc top 3% thế giới",
      "Post-study work visa đến 3 năm",
      "Làm thêm 20h/tuần, full-time kỳ nghỉ",
      "Môi trường sống trong lành, an toàn top đầu",
    ],
    universityCount: 5,
    avgTuition: "20.000 - 35.000 NZD/năm",
    workRights: "20h/tuần trong kỳ học",
    visaRate: "95%",
    displayOrder: 8,
  },
];

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
