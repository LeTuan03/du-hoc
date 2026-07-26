import type { ProgramInput, University } from "../types";

/**
 * Dữ liệu seed: ngành học chưa có định danh vì được tạo sang bảng `programs`
 * lúc seed (xem prisma/seed.ts), không lưu vào cột của bảng universities.
 */
export type UniversitySeed = Omit<University, "programs"> & {
  programs: ProgramInput[];
};

export const universities: UniversitySeed[] = [
  // ============ MỸ ============
  {
    id: "u-asu",
    countrySlug: "my",
    name: "Arizona State University",
    slug: "arizona-state-university",
    city: "Tempe, Arizona",
    ranking: 179,
    rankingSource: "QS World 2026",
    tuitionMin: 32000,
    tuitionMax: 45000,
    description:
      "<p><strong>Arizona State University (ASU)</strong> là đại học công lập đổi mới sáng tạo số 1 nước Mỹ 9 năm liên tiếp (U.S. News). Với hơn 15.000 sinh viên quốc tế từ 150 quốc gia, ASU nổi bật về Kỹ thuật, Kinh doanh (W. P. Carey) và Báo chí.</p><p>Trường có chương trình pathway thân thiện với sinh viên Việt Nam, cùng hệ thống hỗ trợ học thuật và nghề nghiệp toàn diện, tỷ lệ có việc làm sau tốt nghiệp trên 90%.</p>",
    admissionRequirements: [
      "GPA từ 3.0/4.0 (tương đương 7.5/10)",
      "Tốt nghiệp THPT hoặc đang học lớp 12",
      "Không bắt buộc SAT/ACT cho đa số ngành",
    ],
    englishRequirements: "IELTS 6.0+ hoặc TOEFL iBT 61+ (có pathway nếu chưa đạt)",
    livingCost: "12.000 - 16.000 USD/năm",
    dormitoryInfo:
      "Ký túc xá trong khuôn viên từ 7.000 USD/năm, ưu tiên sinh viên năm nhất, đầy đủ tiện nghi và an ninh 24/7.",
    isFeatured: true,
    majors: ["Khoa học Máy tính", "Kinh doanh", "Kỹ thuật", "Báo chí - Truyền thông", "Thiết kế"],
    programs: [
      { name: "Cử nhân Khoa học Máy tính", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 34000 },
      { name: "Cử nhân Quản trị Kinh doanh (W. P. Carey)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 36000 },
      { name: "Thạc sĩ Kỹ thuật phần mềm", level: "thac-si", durationMonths: 24, tuitionPerYear: 42000 },
      { name: "Dự bị đại học Global Launch", level: "du-bi-dai-hoc", durationMonths: 12, tuitionPerYear: 18000 },
    ],
    faqs: [
      {
        question: "ASU có học bổng cho sinh viên Việt Nam không?",
        answer:
          "Có. Học bổng New American University Scholarship từ 5.000 - 15.500 USD/năm, xét tự động dựa trên GPA và không cần bài luận riêng.",
      },
      {
        question: "Chưa đạt IELTS 6.0 có thể nhập học không?",
        answer:
          "Bạn có thể học chương trình Global Launch (pathway tiếng Anh) ngay tại trường, sau đó chuyển tiếp vào chính khóa mà không cần thi lại IELTS.",
      },
    ],
  },
  {
    id: "u-uw",
    countrySlug: "my",
    name: "University of Washington",
    slug: "university-of-washington",
    city: "Seattle, Washington",
    ranking: 76,
    rankingSource: "QS World 2026",
    tuitionMin: 40000,
    tuitionMax: 60000,
    description:
      "<p><strong>University of Washington (UW)</strong> tọa lạc tại Seattle — thủ phủ công nghệ Tây Bắc nước Mỹ, cạnh trụ sở Amazon, Microsoft và Boeing. UW thuộc top 80 thế giới với thế mạnh vượt trội về Khoa học Máy tính, Y khoa và Kinh doanh.</p><p>Sinh viên UW hưởng lợi từ mạng lưới thực tập khổng lồ của hệ sinh thái công nghệ Seattle, cùng khuôn viên được đánh giá đẹp nhất bờ Tây.</p>",
    admissionRequirements: [
      "GPA từ 3.5/4.0 (tương đương 8.5/10)",
      "Hồ sơ ngoại khóa nổi bật",
      "Bài luận cá nhân (Personal Statement)",
    ],
    englishRequirements: "IELTS 7.0+ hoặc TOEFL iBT 92+",
    livingCost: "15.000 - 20.000 USD/năm",
    dormitoryInfo:
      "Ký túc xá từ 9.000 USD/năm bao gồm meal plan; nhiều lựa chọn nhà ở ngoài trường tại khu University District.",
    isFeatured: true,
    majors: ["Khoa học Máy tính", "Y khoa", "Kinh doanh", "Kỹ thuật Hàng không", "Sinh học"],
    programs: [
      { name: "Cử nhân Khoa học Máy tính (Paul G. Allen School)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 42000 },
      { name: "Cử nhân Kinh doanh (Foster School)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 41000 },
      { name: "Thạc sĩ Phân tích Dữ liệu", level: "thac-si", durationMonths: 18, tuitionPerYear: 48000 },
    ],
    faqs: [
      {
        question: "Ngành Khoa học Máy tính của UW có khó vào không?",
        answer:
          "Đây là một trong những ngành cạnh tranh nhất trường (top 10 nước Mỹ). Hồ sơ cần GPA 9.0+, hoạt động ngoại khóa liên quan CNTT và bài luận thuyết phục. Đội ngũ tư vấn của chúng tôi sẽ giúp bạn xây dựng chiến lược hồ sơ từ sớm.",
      },
    ],
  },
  // ============ CANADA ============
  {
    id: "u-toronto",
    countrySlug: "canada",
    name: "University of Toronto",
    slug: "university-of-toronto",
    city: "Toronto, Ontario",
    ranking: 21,
    rankingSource: "QS World 2026",
    tuitionMin: 45000,
    tuitionMax: 62000,
    description:
      "<p><strong>University of Toronto (U of T)</strong> là đại học số 1 Canada, top 21 thế giới, nơi khai sinh insulin và nhiều giải Nobel. Trường có 3 campus với hơn 700 chương trình đại học và 200 chương trình sau đại học.</p><p>Tọa lạc giữa trung tâm Toronto — thành phố đa văn hóa nhất thế giới, sinh viên U of T có cơ hội thực tập tại các tập đoàn tài chính, công nghệ hàng đầu Bắc Mỹ ngay trong thời gian học qua chương trình Co-op và PEY.</p>",
    admissionRequirements: [
      "GPA từ 8.5/10, ưu tiên 9.0+ cho ngành cạnh tranh",
      "Điểm học bạ lớp 10, 11, 12 ổn định",
      "Một số ngành yêu cầu bài luận/video phỏng vấn bổ sung",
    ],
    englishRequirements: "IELTS 6.5 (không kỹ năng nào dưới 6.0) hoặc TOEFL iBT 89+",
    livingCost: "15.000 - 20.000 CAD/năm",
    dormitoryInfo:
      "Đảm bảo chỗ ở ký túc xá cho sinh viên năm nhất (khoảng 12.000 - 18.000 CAD/năm gồm ăn ở), 7 college với văn hóa riêng biệt.",
    isFeatured: true,
    majors: ["Khoa học Máy tính", "Kỹ thuật", "Thương mại Rotman", "Khoa học Sức khỏe", "Kiến trúc"],
    programs: [
      { name: "Cử nhân Khoa học Máy tính", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 61000 },
      { name: "Cử nhân Thương mại Rotman", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 62000 },
      { name: "Thạc sĩ Kỹ thuật Điện & Máy tính", level: "thac-si", durationMonths: 16, tuitionPerYear: 55000 },
      { name: "Tiến sĩ Khoa học Máy tính", level: "tien-si", durationMonths: 60, tuitionPerYear: 9000 },
    ],
    faqs: [
      {
        question: "Học phí U of T cao, có cách nào giảm chi phí không?",
        answer:
          "U of T có học bổng Lester B. Pearson toàn phần cho sinh viên quốc tế xuất sắc, cùng nhiều học bổng nhập học 5.000 - 25.000 CAD. Ngoài ra sinh viên có thể làm thêm 24h/tuần và tham gia chương trình PEY Co-op hưởng lương trung bình 50.000 CAD/năm thực tập.",
      },
      {
        question: "Nên chọn campus nào trong 3 campus?",
        answer:
          "St. George (downtown) là campus chính với nhiều lựa chọn ngành nhất; Mississauga và Scarborough có lớp học nhỏ hơn, dễ trúng tuyển hơn và học phí tương đương. Bằng cấp cả 3 campus đều như nhau.",
      },
    ],
  },
  {
    id: "u-ubc",
    countrySlug: "canada",
    name: "University of British Columbia",
    slug: "university-of-british-columbia",
    city: "Vancouver, British Columbia",
    ranking: 38,
    rankingSource: "QS World 2026",
    tuitionMin: 42000,
    tuitionMax: 58000,
    description:
      "<p><strong>University of British Columbia (UBC)</strong> — top 40 thế giới, sở hữu khuôn viên đẹp nhất Bắc Mỹ bên bờ Thái Bình Dương tại Vancouver. UBC mạnh về Lâm nghiệp, Khoa học Môi trường, Kinh doanh (Sauder) và Kỹ thuật.</p><p>Vancouver thường xuyên được xếp hạng thành phố đáng sống nhất thế giới, khí hậu ôn hòa nhất Canada và có cộng đồng người Việt lớn.</p>",
    admissionRequirements: [
      "GPA từ 8.0/10, ngành cạnh tranh cần 8.8+",
      "Personal Profile (bài luận ngắn trả lời câu hỏi của trường)",
      "Hoạt động ngoại khóa có chiều sâu",
    ],
    englishRequirements: "IELTS 6.5 (không kỹ năng nào dưới 6.0) hoặc TOEFL iBT 90+",
    livingCost: "14.000 - 19.000 CAD/năm",
    dormitoryInfo:
      "Ký túc xá đảm bảo cho năm nhất từ 11.000 CAD/năm; khu Wesbrook Village dành cho sinh viên năm trên với căn hộ hiện đại.",
    isFeatured: true,
    majors: ["Kinh doanh Sauder", "Khoa học Môi trường", "Kỹ thuật", "Tâm lý học", "Truyền thông"],
    programs: [
      { name: "Cử nhân Thương mại (Sauder)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 58000 },
      { name: "Cử nhân Khoa học Ứng dụng (Kỹ thuật)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 54000 },
      { name: "Thạc sĩ Phân tích Kinh doanh", level: "thac-si", durationMonths: 12, tuitionPerYear: 60000 },
    ],
    faqs: [
      {
        question: "UBC Vancouver và UBC Okanagan khác gì nhau?",
        answer:
          "UBC Okanagan (Kelowna) có quy mô nhỏ hơn, điểm chuẩn thấp hơn khoảng 0.5 GPA và chi phí sinh hoạt rẻ hơn ~25%. Bằng tốt nghiệp giá trị như nhau, và có thể chuyển campus sau năm 1-2.",
      },
    ],
  },
  // ============ ÚC ============
  {
    id: "u-melbourne",
    countrySlug: "uc",
    name: "University of Melbourne",
    slug: "university-of-melbourne",
    city: "Melbourne, Victoria",
    ranking: 13,
    rankingSource: "QS World 2026",
    tuitionMin: 35000,
    tuitionMax: 52000,
    description:
      "<p><strong>University of Melbourne</strong> — đại học số 1 nước Úc, top 13 thế giới, thành viên nhóm Group of Eight danh giá. Melbourne Model độc đáo cho phép sinh viên khám phá rộng trước khi chuyên sâu, chuẩn bị hoàn hảo cho sự nghiệp toàn cầu.</p><p>Melbourne 10 năm liền nằm trong top 3 thành phố đáng sống nhất thế giới, trung tâm văn hóa - cà phê - thể thao của nước Úc với cộng đồng du học sinh Việt Nam rất lớn.</p>",
    admissionRequirements: [
      "Điểm THPT từ 8.5/10 hoặc hoàn thành dự bị Trinity College",
      "Một số ngành (Y, Luật) yêu cầu bài thi riêng",
    ],
    englishRequirements: "IELTS 6.5 (không kỹ năng nào dưới 6.0)",
    livingCost: "21.000 - 28.000 AUD/năm",
    dormitoryInfo:
      "Hệ thống residential colleges truyền thống từ 18.000 AUD/năm gồm ăn ở; nhiều student apartment quanh khu Parkville và CBD.",
    isFeatured: true,
    majors: ["Thương mại", "Khoa học Máy tính", "Y - Nha - Dược", "Luật", "Kiến trúc"],
    programs: [
      { name: "Cử nhân Thương mại", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 50000 },
      { name: "Cử nhân Khoa học (chuyên ngành CNTT)", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 48000 },
      { name: "Thạc sĩ Kỹ thuật phần mềm", level: "thac-si", durationMonths: 24, tuitionPerYear: 52000 },
      { name: "Dự bị đại học Trinity College", level: "du-bi-dai-hoc", durationMonths: 12, tuitionPerYear: 32000 },
    ],
    faqs: [
      {
        question: "Melbourne Model là gì?",
        answer:
          "Sinh viên học cử nhân tổng quát 3 năm (Arts, Science, Commerce...) sau đó chuyên sâu ở bậc thạc sĩ. Mô hình này giống Mỹ, giúp bạn linh hoạt đổi hướng nghề nghiệp và được nhà tuyển dụng quốc tế đánh giá cao.",
      },
    ],
  },
  {
    id: "u-sydney",
    countrySlug: "uc",
    name: "University of Sydney",
    slug: "university-of-sydney",
    city: "Sydney, New South Wales",
    ranking: 18,
    rankingSource: "QS World 2026",
    tuitionMin: 36000,
    tuitionMax: 55000,
    description:
      "<p><strong>University of Sydney</strong> — đại học lâu đời nhất nước Úc (1850), top 20 thế giới, với khuôn viên kiến trúc Gothic tuyệt đẹp từng xuất hiện trong Harry Potter. Trường đứng số 1 thế giới về khả năng có việc làm của sinh viên tốt nghiệp tại Úc (QS Graduate Employability).</p>",
    admissionRequirements: [
      "Điểm THPT từ 8.5/10 hoặc dự bị Taylors College",
      "Ngành Y yêu cầu ISAT + phỏng vấn",
    ],
    englishRequirements: "IELTS 6.5 - 7.5 tùy ngành",
    livingCost: "22.000 - 30.000 AUD/năm",
    dormitoryInfo:
      "Ký túc xá và residential colleges từ 17.000 AUD/năm; khu Newtown, Glebe gần trường có nhiều share-house giá tốt.",
    isFeatured: false,
    majors: ["Kinh doanh", "Kỹ thuật", "Y khoa", "Truyền thông", "Giáo dục"],
    programs: [
      { name: "Cử nhân Thương mại", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 53000 },
      { name: "Cử nhân Kỹ thuật (Honours)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 51000 },
      { name: "Thạc sĩ Quản trị Kinh doanh", level: "thac-si", durationMonths: 18, tuitionPerYear: 55000 },
    ],
    faqs: [],
  },
  // ============ ANH ============
  {
    id: "u-manchester",
    countrySlug: "anh",
    name: "University of Manchester",
    slug: "university-of-manchester",
    city: "Manchester",
    ranking: 34,
    rankingSource: "QS World 2026",
    tuitionMin: 26000,
    tuitionMax: 38000,
    description:
      "<p><strong>University of Manchester</strong> — thành viên Russell Group, top 35 thế giới với 25 giải Nobel. Đây là nơi tách nguyên tử đầu tiên và phát minh graphene. Trường mạnh toàn diện từ Kỹ thuật, Khoa học đến Kinh doanh (Alliance MBS thuộc top châu Âu).</p><p>Manchester là thành phố sinh viên lớn nhất châu Âu với chi phí rẻ hơn London 40%, văn hóa bóng đá - âm nhạc sôi động.</p>",
    admissionRequirements: [
      "Hoàn thành dự bị (Foundation) hoặc A-Level/IB",
      "GPA lớp 12 từ 8.0/10 cho chương trình dự bị",
    ],
    englishRequirements: "IELTS 6.0 - 7.0 tùy ngành",
    livingCost: "12.000 - 15.000 GBP/năm",
    dormitoryInfo:
      "Đảm bảo ký túc xá cho sinh viên quốc tế năm nhất, từ 6.500 GBP/năm khu Fallowfield — 'thủ đô sinh viên' của Anh.",
    isFeatured: true,
    majors: ["Kinh doanh", "Kỹ thuật", "Khoa học Máy tính", "Dược", "Vật lý"],
    programs: [
      { name: "Cử nhân Khoa học Máy tính", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 34000 },
      { name: "Cử nhân Quản trị Kinh doanh", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 32000 },
      { name: "Thạc sĩ Tài chính", level: "thac-si", durationMonths: 12, tuitionPerYear: 38000 },
      { name: "Dự bị đại học (Foundation Year)", level: "du-bi-dai-hoc", durationMonths: 9, tuitionPerYear: 22000 },
    ],
    faqs: [
      {
        question: "Học sinh Việt Nam có vào thẳng năm nhất được không?",
        answer:
          "Hệ thống Anh yêu cầu 13 năm học phổ thông, nên học sinh Việt Nam thường học 1 năm Foundation trước khi vào cử nhân 3 năm. Một số trường chấp nhận vào thẳng nếu điểm THPT xuất sắc hoặc có IB/A-Level.",
      },
    ],
  },
  {
    id: "u-birmingham",
    countrySlug: "anh",
    name: "University of Birmingham",
    slug: "university-of-birmingham",
    city: "Birmingham",
    ranking: 76,
    rankingSource: "QS World 2026",
    tuitionMin: 22000,
    tuitionMax: 32000,
    description:
      "<p><strong>University of Birmingham</strong> — đại học 'redbrick' đầu tiên của Anh, thành viên Russell Group với 11 giải Nobel. Trường nổi tiếng về Kinh doanh, Kỹ thuật và là lựa chọn cân bằng tuyệt vời giữa chất lượng - chi phí - cơ hội trúng tuyển cho sinh viên Việt Nam.</p>",
    admissionRequirements: [
      "Foundation hoặc A-Level/IB",
      "GPA từ 7.5/10 cho lộ trình dự bị",
    ],
    englishRequirements: "IELTS 6.0 - 6.5",
    livingCost: "10.000 - 13.000 GBP/năm",
    dormitoryInfo: "Ký túc xá The Vale Village từ 5.800 GBP/năm, hồ nước và công viên ngay trong khu ở.",
    isFeatured: false,
    majors: ["Kinh doanh", "Kỹ thuật", "Luật", "Khoa học Xã hội", "Thể thao"],
    programs: [
      { name: "Cử nhân Kinh doanh Quốc tế", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 28000 },
      { name: "Thạc sĩ Marketing", level: "thac-si", durationMonths: 12, tuitionPerYear: 30000 },
      { name: "Dự bị đại học Pathway", level: "du-bi-dai-hoc", durationMonths: 9, tuitionPerYear: 20000 },
    ],
    faqs: [],
  },
  // ============ HÀN QUỐC ============
  {
    id: "u-yonsei",
    countrySlug: "han-quoc",
    name: "Yonsei University",
    slug: "yonsei-university",
    city: "Seoul",
    ranking: 56,
    rankingSource: "QS World 2026",
    tuitionMin: 6000,
    tuitionMax: 12000,
    description:
      "<p><strong>Yonsei University</strong> — thành viên SKY (3 đại học danh giá nhất Hàn Quốc), thành lập 1885. Khoa Underwood International College giảng dạy hoàn toàn bằng tiếng Anh. Yonsei nằm tại Sinchon, Seoul — khu sinh viên sôi động bậc nhất, và nổi tiếng với mạng lưới cựu sinh viên quyền lực trong các chaebol.</p>",
    admissionRequirements: [
      "GPA từ 8.0/10",
      "TOPIK 3+ (chương trình tiếng Hàn) hoặc tiếng Anh (UIC)",
      "Bài luận + phỏng vấn (một số khoa)",
    ],
    englishRequirements: "TOPIK 3+ hoặc IELTS 6.5+ cho chương trình tiếng Anh",
    livingCost: "8.000 - 12.000 USD/năm",
    dormitoryInfo: "Ký túc xá SK Global House hiện đại từ 1.500 USD/học kỳ, ưu tiên sinh viên quốc tế.",
    isFeatured: true,
    majors: ["Kinh doanh", "Quan hệ Quốc tế", "Truyền thông", "Khoa học Máy tính", "Y khoa"],
    programs: [
      { name: "Cử nhân Underwood International College (tiếng Anh)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 11000 },
      { name: "Cử nhân Kinh doanh (tiếng Hàn)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 7000 },
      { name: "Khóa tiếng Hàn KLI", level: "du-bi-dai-hoc", durationMonths: 12, tuitionPerYear: 5500 },
    ],
    faqs: [
      {
        question: "Chưa biết tiếng Hàn có du học Yonsei được không?",
        answer:
          "Được. Bạn có thể học khóa tiếng Hàn KLI của trường 6-12 tháng đạt TOPIK 3 rồi vào chính khóa, hoặc chọn chương trình UIC giảng dạy 100% tiếng Anh (yêu cầu IELTS 6.5+).",
      },
    ],
  },
  {
    id: "u-skku",
    countrySlug: "han-quoc",
    name: "Sungkyunkwan University",
    slug: "sungkyunkwan-university",
    city: "Seoul & Suwon",
    ranking: 123,
    rankingSource: "QS World 2026",
    tuitionMin: 5000,
    tuitionMax: 10000,
    description:
      "<p><strong>Sungkyunkwan University (SKKU)</strong> — đại học lâu đời nhất Đông Á (1398), được tập đoàn Samsung bảo trợ trực tiếp. Sinh viên SKKU có cơ hội thực tập và làm việc tại Samsung với chương trình liên kết đào tạo bán dẫn, AI độc quyền. Học bổng cho sinh viên quốc tế rất hào phóng, lên đến 100% học phí.</p>",
    admissionRequirements: [
      "GPA từ 7.5/10",
      "TOPIK 3+ hoặc chứng chỉ tiếng Anh",
    ],
    englishRequirements: "TOPIK 3+ hoặc IELTS 6.0+",
    livingCost: "7.000 - 10.000 USD/năm",
    dormitoryInfo: "Ký túc xá cả 2 campus từ 1.200 USD/học kỳ; campus Suwon rộng rãi, chi phí rẻ hơn Seoul.",
    isFeatured: false,
    majors: ["Kỹ thuật Bán dẫn", "Kinh doanh Toàn cầu", "AI & Dữ liệu", "Dược", "Truyền thông"],
    programs: [
      { name: "Cử nhân Kinh doanh Toàn cầu (tiếng Anh)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 9500 },
      { name: "Cử nhân Kỹ thuật Bán dẫn (liên kết Samsung)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 8500 },
      { name: "Thạc sĩ AI", level: "thac-si", durationMonths: 24, tuitionPerYear: 10000 },
    ],
    faqs: [],
  },
  // ============ NHẬT BẢN ============
  {
    id: "u-waseda",
    countrySlug: "nhat-ban",
    name: "Waseda University",
    slug: "waseda-university",
    city: "Tokyo",
    ranking: 181,
    rankingSource: "QS World 2026",
    tuitionMin: 8000,
    tuitionMax: 14000,
    description:
      "<p><strong>Waseda University</strong> — đại học tư thục danh giá nhất Nhật Bản, đào tạo 7 thủ tướng Nhật và các nhà sáng lập Sony, Honda, Uniqlo. Waseda có nhiều chương trình cử nhân giảng dạy hoàn toàn bằng tiếng Anh nhất Nhật Bản và hơn 8.000 sinh viên quốc tế.</p>",
    admissionRequirements: [
      "GPA từ 8.0/10",
      "Bài luận + phỏng vấn online",
      "EJU hoặc SAT/IELTS tùy chương trình",
    ],
    englishRequirements: "IELTS 6.0+ (chương trình tiếng Anh) hoặc JLPT N2 (tiếng Nhật)",
    livingCost: "10.000 - 14.000 USD/năm (Tokyo)",
    dormitoryInfo: "Ký túc xá WISH quốc tế từ 60.000 JPY/tháng gồm chương trình phát triển kỹ năng lãnh đạo.",
    isFeatured: true,
    majors: ["Khoa học Chính trị & Kinh tế", "Kinh doanh Quốc tế", "Khoa học Xã hội", "Kỹ thuật"],
    programs: [
      { name: "Cử nhân Liberal Studies (SILS - tiếng Anh)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 12000 },
      { name: "Cử nhân Khoa học Chính trị & Kinh tế (tiếng Anh)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 13000 },
      { name: "Thạc sĩ Kinh doanh Quốc tế", level: "thac-si", durationMonths: 24, tuitionPerYear: 14000 },
    ],
    faqs: [
      {
        question: "Không biết tiếng Nhật có học Waseda được không?",
        answer:
          "Được. Waseda có 7 chương trình cử nhân dạy 100% tiếng Anh (SILS, PSE, SSS...). Tuy nhiên nên học thêm tiếng Nhật trong quá trình học để tăng cơ hội việc làm tại Nhật sau tốt nghiệp.",
      },
    ],
  },
  {
    id: "u-apu",
    countrySlug: "nhat-ban",
    name: "Ritsumeikan Asia Pacific University",
    slug: "ritsumeikan-apu",
    city: "Beppu, Oita",
    ranking: null,
    rankingSource: "Top 1 đại học quốc tế hóa tại Nhật",
    tuitionMin: 7000,
    tuitionMax: 11000,
    description:
      "<p><strong>Ritsumeikan APU</strong> — đại học quốc tế nhất Nhật Bản với 50% sinh viên đến từ 100+ quốc gia, giảng dạy song ngữ Anh - Nhật. APU nổi tiếng hào phóng học bổng (30-100% học phí xét cùng hồ sơ nhập học) và tỷ lệ việc làm sau tốt nghiệp 98% nhờ mạng lưới doanh nghiệp đối tác khắp châu Á.</p>",
    admissionRequirements: [
      "GPA từ 7.0/10",
      "Bài luận + phỏng vấn online",
      "Không yêu cầu tiếng Nhật đầu vào",
    ],
    englishRequirements: "IELTS 5.5 - 6.0+",
    livingCost: "6.000 - 9.000 USD/năm (Beppu rẻ hơn Tokyo ~40%)",
    dormitoryInfo: "AP House ngay cạnh trường từ 40.000 JPY/tháng, bắt buộc năm nhất — môi trường quốc tế đúng nghĩa.",
    isFeatured: false,
    majors: ["Quản trị Kinh doanh Quốc tế", "Nghiên cứu Châu Á - Thái Bình Dương", "Du lịch & Khách sạn"],
    programs: [
      { name: "Cử nhân Quản trị Kinh doanh Quốc tế (tiếng Anh)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 10000 },
      { name: "Cử nhân Nghiên cứu Xã hội Bền vững", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 10000 },
    ],
    faqs: [],
  },
  // ============ SINGAPORE ============
  {
    id: "u-nus",
    countrySlug: "singapore",
    name: "National University of Singapore",
    slug: "national-university-of-singapore",
    city: "Singapore",
    ranking: 8,
    rankingSource: "QS World 2026",
    tuitionMin: 20000,
    tuitionMax: 45000,
    description:
      "<p><strong>National University of Singapore (NUS)</strong> — đại học số 1 châu Á, top 8 thế giới. NUS dẫn đầu về Khoa học Máy tính, Kinh doanh và Kỹ thuật với môi trường nghiên cứu đẳng cấp và mạng lưới đối tác doanh nghiệp toàn cầu.</p><p>Sinh viên quốc tế có thể nhận Tuition Grant của chính phủ Singapore giảm tới 50% học phí, đổi lại cam kết làm việc tại Singapore 3 năm sau tốt nghiệp — chính là con đường định cư rõ ràng nhất châu Á.</p>",
    admissionRequirements: [
      "GPA 9.0+/10, thuộc top đầu lớp",
      "Điểm thi ĐGNL hoặc SAT 1350+ là lợi thế",
      "Phỏng vấn cho ngành cạnh tranh",
    ],
    englishRequirements: "IELTS 6.5+ hoặc TOEFL iBT 92+",
    livingCost: "10.000 - 15.000 SGD/năm",
    dormitoryInfo: "Hệ thống Halls & Residential Colleges từ 3.000 SGD/học kỳ với văn hóa hoạt động ngoại khóa đặc sắc.",
    isFeatured: true,
    majors: ["Khoa học Máy tính", "Kinh doanh", "Kỹ thuật", "Luật", "Y khoa"],
    programs: [
      { name: "Cử nhân Khoa học Máy tính", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 40000 },
      { name: "Cử nhân Kinh doanh", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 38000 },
      { name: "Thạc sĩ Khoa học Dữ liệu", level: "thac-si", durationMonths: 18, tuitionPerYear: 45000 },
    ],
    faqs: [
      {
        question: "Tuition Grant của chính phủ Singapore là gì?",
        answer:
          "Là khoản trợ cấp học phí (không phải vay) giảm 40-50% học phí cho sinh viên quốc tế, đổi lại bạn cam kết làm việc cho công ty đăng ký tại Singapore 3 năm sau tốt nghiệp — với mức lương khởi điểm trung bình 4.500 SGD/tháng, đây là thỏa thuận rất có lợi.",
      },
    ],
  },
  {
    id: "u-ntu",
    countrySlug: "singapore",
    name: "Nanyang Technological University",
    slug: "nanyang-technological-university",
    city: "Singapore",
    ranking: 12,
    rankingSource: "QS World 2026",
    tuitionMin: 20000,
    tuitionMax: 42000,
    description:
      "<p><strong>Nanyang Technological University (NTU)</strong> — top 12 thế giới, sở hữu khuôn viên 'thông minh' đẹp nhất Đông Nam Á với tòa nhà The Hive biểu tượng. NTU đặc biệt mạnh về Kỹ thuật, Khoa học Vật liệu và AI, cùng quan hệ đối tác sâu với Alibaba, Rolls-Royce, HP.</p>",
    admissionRequirements: [
      "GPA 8.8+/10",
      "SAT/ACT hoặc điểm ĐGNL là lợi thế",
    ],
    englishRequirements: "IELTS 6.5+ hoặc TOEFL iBT 90+",
    livingCost: "9.000 - 14.000 SGD/năm",
    dormitoryInfo: "24 halls of residence, đảm bảo chỗ ở 2 năm đầu từ 2.400 SGD/học kỳ.",
    isFeatured: false,
    majors: ["Kỹ thuật", "AI & Khoa học Dữ liệu", "Kinh doanh", "Truyền thông", "Khoa học Vật liệu"],
    programs: [
      { name: "Cử nhân Kỹ thuật Máy tính", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 39000 },
      { name: "Cử nhân Kinh doanh (Nanyang Business School)", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 40000 },
      { name: "Thạc sĩ AI", level: "thac-si", durationMonths: 12, tuitionPerYear: 42000 },
    ],
    faqs: [],
  },
  // ============ NEW ZEALAND ============
  {
    id: "u-auckland",
    countrySlug: "new-zealand",
    name: "University of Auckland",
    slug: "university-of-auckland",
    city: "Auckland",
    ranking: 65,
    rankingSource: "QS World 2026",
    tuitionMin: 22000,
    tuitionMax: 35000,
    description:
      "<p><strong>University of Auckland</strong> — đại học số 1 New Zealand, top 65 thế giới, tọa lạc ngay trung tâm Auckland — thành phố lớn nhất và trung tâm kinh tế của đất nước. Trường mạnh toàn diện, đặc biệt về Kỹ thuật, Y khoa và Kinh doanh (triple-crown accredited).</p>",
    admissionRequirements: [
      "Hoàn thành dự bị hoặc điểm THPT từ 8.0/10 xét vào thẳng một số ngành",
      "Hồ sơ học tập ổn định 3 năm THPT",
    ],
    englishRequirements: "IELTS 6.0 - 6.5",
    livingCost: "18.000 - 25.000 NZD/năm",
    dormitoryInfo: "Ký túc xá catered từ 18.000 NZD/năm gồm ăn uống; self-catered từ 12.000 NZD/năm.",
    isFeatured: true,
    majors: ["Kỹ thuật", "Kinh doanh", "Y khoa", "Khoa học Máy tính", "Kiến trúc"],
    programs: [
      { name: "Cử nhân Kỹ thuật (Honours)", level: "dai-hoc", durationMonths: 48, tuitionPerYear: 34000 },
      { name: "Cử nhân Thương mại", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 26000 },
      { name: "Thạc sĩ Khoa học Dữ liệu", level: "thac-si", durationMonths: 18, tuitionPerYear: 32000 },
      { name: "Dự bị đại học UP Education", level: "du-bi-dai-hoc", durationMonths: 8, tuitionPerYear: 19000 },
    ],
    faqs: [],
  },
  {
    id: "u-otago",
    countrySlug: "new-zealand",
    name: "University of Otago",
    slug: "university-of-otago",
    city: "Dunedin",
    ranking: 214,
    rankingSource: "QS World 2026",
    tuitionMin: 20000,
    tuitionMax: 30000,
    description:
      "<p><strong>University of Otago</strong> — đại học lâu đời nhất New Zealand (1869) tại Dunedin, 'thành phố sinh viên' đúng nghĩa với 20% dân số là sinh viên. Otago nổi tiếng nhất về Y khoa, Nha khoa và Khoa học Sức khỏe, cùng trải nghiệm sinh viên được xếp hạng số 1 New Zealand.</p>",
    admissionRequirements: [
      "Dự bị hoặc điểm THPT khá giỏi",
      "Ngành Y/Nha yêu cầu năm nhất Health Sciences First Year",
    ],
    englishRequirements: "IELTS 6.0+",
    livingCost: "15.000 - 20.000 NZD/năm (Dunedin rẻ hơn Auckland ~25%)",
    dormitoryInfo: "15 residential colleges truyền thống từ 16.000 NZD/năm gồm 3 bữa ăn.",
    isFeatured: false,
    majors: ["Y khoa", "Nha khoa", "Dược", "Tâm lý học", "Kinh doanh"],
    programs: [
      { name: "Cử nhân Khoa học Sức khỏe", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 28000 },
      { name: "Cử nhân Thương mại", level: "dai-hoc", durationMonths: 36, tuitionPerYear: 24000 },
    ],
    faqs: [],
  },
];

