import type { Scholarship } from "../types";

export const scholarships: Scholarship[] = [
  {
    id: "s-pearson",
    universitySlug: "university-of-toronto",
    countrySlug: "canada",
    name: "Học bổng Lester B. Pearson — University of Toronto",
    slug: "hoc-bong-lester-b-pearson-university-of-toronto",
    value: "100% học phí + sinh hoạt phí 4 năm",
    conditions: [
      "Học sinh quốc tế xuất sắc, được trường THPT đề cử",
      "GPA thuộc top 1-2% của trường",
      "Thành tích lãnh đạo, hoạt động cộng đồng nổi bật",
      "Nộp hồ sơ trước 30/11 hằng năm",
    ],
    deadline: "2026-11-30",
    description:
      "Học bổng danh giá nhất của University of Toronto, mỗi năm chỉ trao cho 37 học sinh quốc tế toàn cầu. Bao gồm toàn bộ học phí, sách vở, phí sinh hoạt và ký túc xá trong 4 năm — tổng giá trị hơn 400.000 CAD.",
    isActive: true,
  },
  {
    id: "s-nau",
    universitySlug: "arizona-state-university",
    countrySlug: "my",
    name: "New American University Scholarship — ASU",
    slug: "new-american-university-scholarship-asu",
    value: "5.500 - 15.500 USD/năm",
    conditions: [
      "GPA từ 3.0/4.0 trở lên",
      "Xét tự động khi nộp hồ sơ nhập học, không cần bài luận riêng",
      "Duy trì GPA 3.0 mỗi năm để gia hạn",
    ],
    deadline: "2027-01-15",
    description:
      "Học bổng đầu vào tự động của Arizona State University dành cho sinh viên quốc tế, xét theo GPA. Đây là một trong những học bổng dễ tiếp cận nhất tại các đại học công lập lớn của Mỹ.",
    isActive: true,
  },
  {
    id: "s-melbourne",
    universitySlug: "university-of-melbourne",
    countrySlug: "uc",
    name: "Melbourne International Undergraduate Scholarship",
    slug: "melbourne-international-undergraduate-scholarship",
    value: "10.000 AUD - 100% học phí",
    conditions: [
      "Xét tự động dựa trên kết quả học tập khi nộp hồ sơ",
      "Điểm THPT/dự bị thuộc nhóm xuất sắc",
      "Khoảng 50 suất mỗi năm",
    ],
    deadline: "2026-12-31",
    description:
      "University of Melbourne trao học bổng cho sinh viên quốc tế xuất sắc: 10.000 AUD cho năm nhất, giảm 50% học phí 3 năm, hoặc miễn 100% học phí toàn khóa cho ứng viên đứng đầu.",
    isActive: true,
  },
  {
    id: "s-gks",
    universitySlug: null,
    countrySlug: "han-quoc",
    name: "Học bổng Chính phủ Hàn Quốc GKS (Global Korea Scholarship)",
    slug: "hoc-bong-chinh-phu-han-quoc-gks",
    value: "100% học phí + vé máy bay + trợ cấp 900.000 - 1.000.000 KRW/tháng",
    conditions: [
      "Dưới 25 tuổi (đại học) hoặc dưới 40 tuổi (sau đại học)",
      "GPA từ 80/100 (khoảng 8.0/10)",
      "Chưa từng có bằng cấp tại Hàn Quốc",
      "Nộp qua Đại sứ quán hoặc trường đại học chỉ định",
    ],
    deadline: "2027-02-28",
    description:
      "GKS là học bổng toàn phần hào phóng nhất của chính phủ Hàn Quốc: miễn học phí, vé máy bay khứ hồi, 1 năm học tiếng Hàn miễn phí, trợ cấp sinh hoạt hằng tháng và bảo hiểm y tế. Mỗi năm Việt Nam có 40-60 suất.",
    isActive: true,
  },
  {
    id: "s-mext",
    universitySlug: null,
    countrySlug: "nhat-ban",
    name: "Học bổng Chính phủ Nhật Bản MEXT",
    slug: "hoc-bong-chinh-phu-nhat-ban-mext",
    value: "100% học phí + trợ cấp 117.000 JPY/tháng + vé máy bay",
    conditions: [
      "Tốt nghiệp THPT với học lực giỏi",
      "Dưới 25 tuổi cho bậc đại học",
      "Vượt qua kỳ thi tuyển của Đại sứ quán (Toán, tiếng Anh/Nhật)",
      "Đăng ký qua Đại sứ quán Nhật tại Việt Nam từ tháng 4-5 hằng năm",
    ],
    deadline: "2027-05-15",
    description:
      "MEXT là học bổng toàn phần lâu đời nhất của chính phủ Nhật, bao gồm 1 năm dự bị tiếng Nhật, toàn bộ học phí đại học, trợ cấp sinh hoạt hằng tháng và vé máy bay khứ hồi.",
    isActive: true,
  },
  {
    id: "s-apu",
    universitySlug: "ritsumeikan-apu",
    countrySlug: "nhat-ban",
    name: "APU Tuition Reduction Scholarship",
    slug: "apu-tuition-reduction-scholarship",
    value: "Giảm 30% - 100% học phí toàn khóa",
    conditions: [
      "Xét cùng hồ sơ nhập học, không cần đơn riêng",
      "Đánh giá tổng hợp: học lực, bài luận, phỏng vấn",
      "Duy trì kết quả học tập tốt để gia hạn hằng năm",
    ],
    deadline: "2026-11-15",
    description:
      "Ritsumeikan APU nổi tiếng hào phóng với sinh viên Việt Nam: hơn 80% sinh viên quốc tế nhận học bổng giảm 30-100% học phí, xét tự động ngay khi nộp hồ sơ.",
    isActive: true,
  },
  {
    id: "s-manchester",
    universitySlug: "university-of-manchester",
    countrySlug: "anh",
    name: "Manchester Global Futures Scholarship",
    slug: "manchester-global-futures-scholarship",
    value: "2.000 - 8.000 GBP/năm",
    conditions: [
      "Sinh viên quốc tế nhận offer chương trình cử nhân hoặc thạc sĩ",
      "Xét theo thành tích học tập và quốc tịch ưu tiên (có Việt Nam)",
    ],
    deadline: "2027-03-31",
    description:
      "Học bổng dành riêng cho sinh viên quốc tế của University of Manchester, trong đó Việt Nam thuộc nhóm quốc gia ưu tiên. Kết hợp được với học bổng khoa lên đến 50% học phí.",
    isActive: true,
  },
  {
    id: "s-nus-sm",
    universitySlug: "national-university-of-singapore",
    countrySlug: "singapore",
    name: "Học bổng ASEAN Undergraduate Scholarship — NUS",
    slug: "hoc-bong-asean-undergraduate-nus",
    value: "100% học phí + trợ cấp 5.800 SGD/năm",
    conditions: [
      "Công dân các nước ASEAN (bao gồm Việt Nam)",
      "Thành tích học tập xuất sắc, hoạt động ngoại khóa nổi bật",
      "Vượt qua vòng phỏng vấn",
    ],
    deadline: "2027-02-15",
    description:
      "Học bổng toàn phần của NUS dành riêng cho sinh viên Đông Nam Á: miễn toàn bộ học phí (sau Tuition Grant), trợ cấp sinh hoạt và chỗ ở hằng năm trong suốt 4 năm học.",
    isActive: true,
  },
];

