# GlobalEdu — Website Tuyển Sinh Đại Học & Du Học Quốc Tế

Website marketing + thu thập lead cho đơn vị tư vấn du học, xây dựng theo tài liệu
[SRS/SDD](./website-tuyen-sinh-du-hoc-SRS-SDD.md) với **Next.js 15 (App Router) + TypeScript + TailwindCSS 4**.

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:3000 (dev)

npm run build
npm run start      # production
```

Không cần database hay dịch vụ ngoài — chạy được ngay sau `npm install`.

## Tài khoản Admin (dev mặc định)

- URL: `http://localhost:3000/admin`
- Email: `admin@duhoc.edu.vn` — Mật khẩu: `Admin@123456`

Đổi qua biến môi trường (xem `.env.example`): `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`.

## Tính năng đã triển khai

### Public site (SSG/ISR, chuẩn SEO)
- **Trang chủ**: Hero, thống kê count-up, grid 8 quốc gia (cờ SVG tự vẽ), trường nổi bật,
  bậc học, học bổng, tin tức, slider câu chuyện học viên, FAQ accordion, form đăng ký.
- **Quốc gia** `/quoc-gia/[slug]`: phân tích điểm mạnh, học phí, quyền làm thêm, trường + học bổng liên quan.
- **Trường** `/truong`: filter theo quốc gia/ngành/học phí/từ khóa + sắp xếp (GET form → URL chia sẻ được);
  `/truong/[slug]`: tabs (giới thiệu, chương trình & học phí, điều kiện, KTX), FAQ riêng, form prefill.
- **Học bổng** `/hoc-bong/[slug]`: giá trị, điều kiện, đếm ngược deadline.
- **Tin tức** `/tin-tuc`: 5 danh mục, bài viết chi tiết + JSON-LD Article.
- **Khác**: chương trình học theo bậc, câu chuyện học viên, giới thiệu, liên hệ, FAQ (JSON-LD FAQPage),
  chính sách bảo mật, điều khoản, 404.

### Form đăng ký tư vấn (15 field — SRS mục 13)
- React Hook Form + Zod (schema dùng chung client/server).
- Honeypot chống bot, rate-limit 5 req/phút/IP, chống trùng lặp email trong 24h.
- Prefill quốc gia/trường khi nhúng ở trang chi tiết; tracking `sourcePage`.

### Admin CRM (`/admin`)
- Đăng nhập cookie HMAC (httpOnly, rate-limit chống brute-force).
- **Dashboard**: 4 stat card, biểu đồ lead 30 ngày (SVG line chart), donut theo quốc gia,
  funnel pipeline, bảng lead mới nhất.
- **Quản lý leads**: tìm kiếm, lọc trạng thái/quốc gia; chi tiết lead với timeline chăm sóc,
  thêm ghi chú, đổi trạng thái **theo đúng state machine** (SRS 12.4):
  `new → contacted → consulting → preparing_documents → submitted → visa_approved`
  (+ `discontinued` từ mọi trạng thái trừ `visa_approved`).

### SEO kỹ thuật (SRS mục 15)
- `generateMetadata()` động từng trang, canonical, Open Graph, template title.
- `sitemap.xml` sinh động từ toàn bộ slug; `robots.txt` chặn `/admin`, `/api`.
- JSON-LD: `EducationalOrganization`, `CollegeOrUniversity`, `Article`, `FAQPage`, `BreadcrumbList`.
- `next/font` (Be Vietnam Pro) chống CLS; security headers trong `next.config.ts`.

## Kiến trúc

```
src/
├── app/
│   ├── (public)/            # 19 trang public (Header + Footer layout)
│   ├── admin/
│   │   ├── login/           # trang đăng nhập (không guard)
│   │   └── (dashboard)/     # layout guard session + sidebar
│   └── api/
│       ├── health/          # GET /api/health (uptime monitor)
│       └── v1/              # leads, auth (chuẩn response SRS 7.1)
├── components/
│   ├── public/              # Header, Hero, Card, Form, Slider, Accordion, Flag SVG...
│   └── admin/               # Charts SVG, StatusBadge, LeadActions...
├── lib/                     # siteConfig, format helpers
└── server/                  # KHÔNG phụ thuộc HTTP — dễ tách backend riêng
    ├── types.ts             # domain types + state machine lead
    ├── validators/          # Zod schemas (dùng chung FE/BE)
    ├── services/            # business logic (leadService)
    ├── repositories/        # leadRepository (JSON file — thay bằng Prisma sau)
    ├── middlewares/         # rateLimit
    └── data/                # seed content: countries, universities, scholarships...
```

**Lưu trữ lead**: file `data/leads.json` (tự seed 5 lead demo lần chạy đầu; xóa file để reset).
Layer Repository được tách riêng đúng SRS mục 10.2 — khi cần scale, thay bằng
Prisma + PostgreSQL mà không sửa Service/API.

## Lộ trình nâng cấp (theo Sprint SRS mục 17)

| Hạng mục | Trạng thái |
|---|---|
| Public site + Form + SEO (Sprint 2, 3, 5) | ✅ Hoàn thành |
| Admin Dashboard + Lead CRM + state machine (Sprint 4) | ✅ Hoàn thành |
| Prisma + PostgreSQL thay JSON storage (Sprint 1) | 🔜 Thay `leadRepository` |
| Email Resend/SMTP (đã chừa hook trong `leadService.create`) | 🔜 |
| Admin CRUD nội dung (trường/bài viết/học bổng) + TipTap + upload | 🔜 |
| RBAC đa người dùng (Super Admin/Admin/Tư vấn viên), xuất Excel/PDF | 🔜 |
| Docker + Nginx + PM2 + CI/CD (Sprint 6 — mẫu cấu hình trong SRS mục 16) | 🔜 |
