# TÀI LIỆU ĐẶC TẢ KỸ THUẬT (SRS/SDD)
## Website Tuyển Sinh Đại Học & Du Học Quốc Tế

**Phiên bản:** 1.0
**Vai trò biên soạn:** Solution Architect / Senior Fullstack Developer / UI-UX Designer / SEO Specialist
**Tham khảo bố cục:** duhochopdiem.edu.vn (chỉ tham khảo luồng UX, không sao chép giao diện/nội dung/mã nguồn)

---

## MỤC LỤC

1. [Phân tích yêu cầu dự án](#1-phân-tích-yêu-cầu-dự-án)
2. [Kiến trúc tổng thể hệ thống](#2-kiến-trúc-tổng-thể-hệ-thống)
3. [Sitemap đầy đủ](#3-sitemap-đầy-đủ)
4. [User Flow](#4-user-flow)
5. [Wireframe từng trang](#5-wireframe-từng-trang)
6. [Thiết kế Database (ERD + bảng dữ liệu)](#6-thiết-kế-database-erd--bảng-dữ-liệu)
7. [Thiết kế REST API](#7-thiết-kế-rest-api)
8. [Thiết kế UI/UX](#8-thiết-kế-uiux)
9. [Danh sách Component](#9-danh-sách-component)
10. [Thiết kế Backend](#10-thiết-kế-backend)
11. [Thiết kế Frontend](#11-thiết-kế-frontend)
12. [Thiết kế Admin Dashboard](#12-thiết-kế-admin-dashboard)
13. [Luồng xử lý Form đăng ký](#13-luồng-xử-lý-form-đăng-ký)
14. [Quy trình gửi Email và thông báo](#14-quy-trình-gửi-email-và-thông-báo)
15. [Kế hoạch SEO](#15-kế-hoạch-seo)
16. [Kế hoạch triển khai VPS (Docker + Nginx)](#16-kế-hoạch-triển-khai-vps-docker--nginx)
17. [Roadmap phát triển theo Sprint](#17-roadmap-phát-triển-theo-sprint)
18. [Checklist hoàn thiện trước bàn giao](#18-checklist-hoàn-thiện-trước-bàn-giao)
19. [Kế hoạch sinh mã nguồn theo module](#19-kế-hoạch-sinh-mã-nguồn-theo-module)

---

## 1. PHÂN TÍCH YÊU CẦU DỰ ÁN

### 1.1. Bối cảnh & mục tiêu kinh doanh

Website đóng vai trò là **kênh marketing + thu thập lead (leads generation)** cho một đơn vị tư vấn du học. Đây **không phải** một sàn giao dịch/thanh toán — toàn bộ giá trị nằm ở việc:

- Xây dựng niềm tin (trust) thông qua nội dung trường học, học bổng, câu chuyện học viên thật.
- Tối ưu chuyển đổi (conversion) từ khách truy cập → điền form tư vấn.
- Cho đội sales/tư vấn viên một hệ thống CRM-lite (Admin) để quản lý và chăm sóc lead theo pipeline trạng thái.
- Tối ưu SEO để có traffic tự nhiên (organic) dài hạn, giảm phụ thuộc ads.

### 1.2. Đối tượng người dùng (Personas)

| Persona | Mô tả | Nhu cầu chính |
|---|---|---|
| Học sinh/Phụ huynh | 15-19 tuổi hoặc phụ huynh 35-50 tuổi, tìm hiểu du học | So sánh trường, học phí, học bổng, điều kiện; đăng ký tư vấn nhanh |
| Tư vấn viên (Consultant) | Nhân viên nội bộ | Xem/tiếp nhận lead, cập nhật trạng thái, ghi chú chăm sóc |
| Admin | Quản trị nội dung | CRUD trường/học bổng/bài viết, theo dõi báo cáo |
| Super Admin | Quản trị hệ thống | Quản lý người dùng, phân quyền, cấu hình hệ thống |
| Googlebot/SEO crawler | Không phải người, nhưng là "actor" quan trọng | Cần HTML render sẵn (SSR/SSG), sitemap, structured data |

### 1.3. Phạm vi (Scope)

**Trong phạm vi:**
- Website công khai (public site) hiển thị nội dung trường/chương trình/học bổng/tin tức.
- Form thu thập lead đa bước hoặc một trang, lưu DB + gửi email + thông báo admin.
- Trang quản trị (Admin CMS) quản lý toàn bộ nội dung và pipeline lead.
- Tối ưu SEO kỹ thuật (technical SEO) toàn diện.

**Ngoài phạm vi (giai đoạn 1):**
- Thanh toán online (không có yêu cầu).
- Ứng dụng mobile riêng (native app).
- Chatbot AI tự động tư vấn (có thể là roadmap giai đoạn 2).
- Đa ngôn ngữ đầy đủ (có thể thêm i18n ở giai đoạn 2, khuyến nghị thiết kế DB sẵn sàng mở rộng).

### 1.4. Yêu cầu phi chức năng (Non-functional Requirements)

| Nhóm | Yêu cầu |
|---|---|
| Hiệu năng | Core Web Vitals > 90 điểm (LCP < 2.5s, INP < 200ms, CLS < 0.1) |
| SEO | Chuẩn SEO kỹ thuật 100%: sitemap, robots, JSON-LD, OG, canonical |
| Bảo mật | OWASP Top 10 cơ bản: XSS, CSRF, SQLi, rate limiting, JWT an toàn |
| Khả năng mở rộng | Kiến trúc tách Frontend/Backend, dễ thêm module (vd: đa ngôn ngữ, chatbot) |
| Khả năng bảo trì | TypeScript strict, code convention rõ ràng, tách layer (Controller-Service-Repository) |
| Responsive | Mobile-first, hỗ trợ đầy đủ Mobile/Tablet/Desktop |
| Khả năng truy cập | WCAG 2.1 AA (contrast, alt text, keyboard navigation, aria-label) |
| Uptime | ≥ 99.5%, có health-check endpoint |

### 1.5. Giả định & ràng buộc

- Team dự kiến 1-3 dev (frontend-heavy), nên ưu tiên Next.js full-stack (App Router + Route Handlers) thay vì tách backend riêng NestJS ngay từ đầu, để giảm chi phí vận hành ban đầu — có thể tách backend độc lập ở Sprint sau nếu cần scale.
- Ngân sách hosting: 1 VPS (khuyến nghị tối thiểu 2 vCPU / 4GB RAM cho cả app + DB + Nginx).
- Không có yêu cầu thanh toán → không cần PCI-DSS compliance.

---

## 2. KIẾN TRÚC TỔNG THỂ HỆ THỐNG

### 2.1. Kiến trúc lựa chọn: **Modular Monolith trên Next.js 16 (App Router)**

Thay vì tách riêng NestJS backend ngay từ đầu (tăng độ phức tạp vận hành DevOps cho team nhỏ), khuyến nghị dùng **Next.js làm cả Frontend lẫn Backend** thông qua Route Handlers (`/app/api/**`), với kiến trúc phân lớp rõ ràng (Controller → Service → Repository/Prisma) để **dễ dàng tách thành microservice/NestJS riêng sau này** nếu quy mô tăng.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                      │
│         Next.js Client Components + React Query               │
└───────────────────────────┬─────────────────────────────────┘
                             │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│                      NGINX (Reverse Proxy)                    │
│   - SSL Termination (Let's Encrypt)                            │
│   - Gzip/Brotli, Static Cache, Rate Limiting cơ bản            │
└───────────────────────────┬─────────────────────────────────┘
                             │
┌───────────────────────────▼─────────────────────────────────┐
│              NEXT.JS 16 APP (PM2 cluster mode)                 │
│  ┌─────────────────────┐   ┌────────────────────────────┐    │
│  │  Public Site (SSR/   │   │  Admin CMS (Client-side     │    │
│  │  ISR Server Comp.)   │   │  heavy, protected route)    │    │
│  └─────────────────────┘   └────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  API Layer: /app/api/**  (Route Handlers)             │     │
│  │  Controller → Service → Repository (Prisma)           │     │
│  │  Middleware: Auth (JWT), Zod validation, Rate limit    │     │
│  └─────────────────────────────────────────────────────┘     │
└───────┬──────────────────────┬───────────────────┬───────────┘
        │                      │                   │
┌───────▼───────┐   ┌─────────▼────────┐   ┌───────▼────────┐
│  PostgreSQL 16 │   │  MinIO / Cloudinary│  │  Resend / SMTP  │
│  (Prisma ORM)  │   │  (media storage)   │  │  (email lead)   │
└────────────────┘   └───────────────────┘   └─────────────────┘
```

### 2.2. Các layer chính

1. **Presentation Layer (Frontend)**: Server Components cho trang public (SEO-critical) + Client Components cho phần tương tác (form, filter, admin dashboard).
2. **API Layer**: Route Handlers Next.js, tổ chức theo domain (`/api/universities`, `/api/leads`, `/api/scholarships`...).
3. **Service Layer**: Business logic thuần túy, không phụ thuộc HTTP, dễ unit test.
4. **Repository Layer**: Prisma Client, tách riêng để dễ thay đổi ORM/DB sau này.
5. **Infrastructure Layer**: Email service, Storage service (Cloudinary/MinIO), Cache (Next.js cache + Redis tùy chọn ở giai đoạn scale).

### 2.3. Luồng dữ liệu tổng quát

```
User điền Form → Client validate (Zod + RHF) → POST /api/leads
   → Middleware (rate-limit, CSRF, Zod server validate)
   → LeadService.create() → Prisma insert vào bảng `leads`
   → Trigger song song: EmailService.sendConfirmation(user)
                          EmailService.notifyAdmin(lead)
   → Response 201 → Client hiển thị Toast thành công
   → Admin Dashboard: React Query invalidate → hiển thị lead mới (poll/refetch)
```

### 2.4. Công nghệ chốt theo từng tầng

| Tầng | Công nghệ |
|---|---|
| Frontend Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Ngôn ngữ | TypeScript (strict mode) |
| UI | TailwindCSS + Shadcn UI + Framer Motion |
| Form & Validation | React Hook Form + Zod (chia sẻ schema Frontend/Backend) |
| Data Fetching (client) | TanStack Query |
| ORM | Prisma (PostgreSQL 16) |
| Auth | JWT (access + refresh token), bcrypt cho mật khẩu |
| Storage | Cloudinary (khuyến nghị cho MVP, dễ CDN + transform ảnh) hoặc MinIO (self-host, tiết kiệm chi phí dài hạn) |
| Email | Resend (DX tốt, dễ tích hợp React Email templates) hoặc SMTP nội bộ |
| Editor nội dung | TipTap |
| Deploy | Docker + Docker Compose, Nginx, PM2, Ubuntu VPS |
| CI/CD | GitHub Actions (build → test → deploy qua SSH hoặc self-hosted runner) |

---

## 3. SITEMAP ĐẦY ĐỦ

### 3.1. Public Site

```
/
├── /quoc-gia
│   └── /quoc-gia/[slug]                      (vd: /quoc-gia/uc)
├── /truong
│   ├── /truong/[slug]                        (chi tiết trường)
│   └── /truong?quoc_gia=&nganh=&hoc_phi=&xep_hang=  (filter/listing)
├── /chuong-trinh-hoc
│   ├── /chuong-trinh-hoc/dai-hoc
│   ├── /chuong-trinh-hoc/sau-dai-hoc
│   ├── /chuong-trinh-hoc/cao-dang
│   ├── /chuong-trinh-hoc/thac-si
│   ├── /chuong-trinh-hoc/tien-si
│   ├── /chuong-trinh-hoc/du-bi-dai-hoc
│   └── /chuong-trinh-hoc/chuyen-tiep
├── /hoc-bong
│   └── /hoc-bong/[slug]
├── /tin-tuc
│   ├── /tin-tuc/tuyen-sinh
│   ├── /tin-tuc/hoc-bong
│   ├── /tin-tuc/visa
│   ├── /tin-tuc/kinh-nghiem
│   ├── /tin-tuc/cuoc-song-du-hoc
│   └── /tin-tuc/[slug]                       (chi tiết bài viết)
├── /cau-chuyen-hoc-vien
├── /gioi-thieu                                (về công ty tư vấn)
├── /lien-he
├── /dang-ky-tu-van                            (form full-page, cũng nhúng ở nhiều nơi)
├── /faq
├── /chinh-sach-bao-mat
├── /dieu-khoan-su-dung
├── sitemap.xml
├── robots.txt
└── /404, /500 (error pages)
```

### 3.2. Admin CMS (`/admin`)

```
/admin/login
/admin
├── /admin/dashboard                          (tổng quan, biểu đồ thống kê)
├── /admin/leads
│   ├── /admin/leads                          (danh sách + filter + export)
│   └── /admin/leads/[id]                     (chi tiết lead, lịch sử chăm sóc, ghi chú)
├── /admin/universities
│   ├── /admin/universities
│   ├── /admin/universities/new
│   └── /admin/universities/[id]/edit
├── /admin/countries
├── /admin/scholarships
├── /admin/programs
├── /admin/articles
│   ├── /admin/articles
│   ├── /admin/articles/new
│   └── /admin/articles/[id]/edit
├── /admin/testimonials
├── /admin/faq
├── /admin/banners
├── /admin/menus
├── /admin/media                              (thư viện media)
├── /admin/users                              (quản lý người dùng & phân quyền)
├── /admin/settings                           (cấu hình site, SEO mặc định)
└── /admin/seo                                (quản lý SEO metadata theo trang)
```

---

## 4. USER FLOW

### 4.1. Luồng khách truy cập → chuyển đổi thành lead (luồng quan trọng nhất)

```
[Vào trang chủ]
      │
      ▼
[Xem Hero Banner / Thống kê / Danh sách quốc gia]
      │
      ├──► [Click 1 quốc gia] ──► [Danh sách trường theo quốc gia]
      │                                   │
      │                                   ▼
      │                          [Click 1 trường] ──► [Trang chi tiết trường]
      │                                                       │
      │                                                       ▼
      │                                      [Xem học phí/học bổng/điều kiện]
      │                                                       │
      │                                                       ▼
      │                                          [Click "Đăng ký tư vấn"]
      │                                                       │
      ├──► [Click "Đăng ký tư vấn" ở Hero] ───────────────────┤
      │                                                       │
      ├──► [Xem Học bổng] ──► [Click "Đăng ký" học bổng] ─────┤
      │                                                       │
      ▼                                                       ▼
[Đọc Tin tức/Câu chuyện học viên]                    [Modal/Trang Form đăng ký tư vấn]
                                                              │
                                                              ▼
                                              [Điền thông tin (15 field)]
                                                              │
                                                              ▼
                                        [Submit → Validate client-side]
                                                              │
                                              ┌───────────────┴───────────────┐
                                              ▼                               ▼
                                     [Lỗi validate: hiển thị]         [Thành công: POST API]
                                     [inline error, không submit]              │
                                                                               ▼
                                                          [Lưu DB + Gửi email + Noti Admin]
                                                                               │
                                                                               ▼
                                                                [Toast "Đăng ký thành công"]
                                                                               │
                                                                               ▼
                                                        [Gợi ý bài viết liên quan / trường khác]
```

### 4.2. Luồng Admin xử lý lead (CRM pipeline)

```
[Lead mới xuất hiện trên Dashboard] (trạng thái: Mới)
      │
      ▼
[Tư vấn viên mở chi tiết lead] → [Thêm ghi chú chăm sóc] → [Đổi trạng thái: Đã liên hệ]
      │
      ▼
[Gọi điện/tư vấn] → [Đổi trạng thái: Đang tư vấn]
      │
      ▼
[Khách đồng ý] → [Đang chuẩn bị hồ sơ] → [Đã nộp hồ sơ] → [Đậu Visa] (thành công)
      │
      └──► (bất kỳ lúc nào khách từ chối) → [Không tiếp tục] (đóng lead, lưu lý do)
```

### 4.3. Luồng Admin quản lý nội dung (ví dụ: thêm trường mới)

```
[Admin login] → [Vào Quản lý trường] → [Click "Thêm trường mới"]
      │
      ▼
[Điền form: thông tin cơ bản, upload logo/banner/ảnh/video, chuyên ngành, học phí, SEO]
      │
      ▼
[Validate Zod] → [Submit] → [Upload ảnh lên Cloudinary/MinIO song song]
      │
      ▼
[Lưu DB] → [Revalidate ISR cache trang public liên quan] → [Toast thành công]
```

---

## 5. WIREFRAME TỪNG TRANG

> Wireframe mô tả dạng ASCII layout — dùng làm cơ sở dựng Figma / code trực tiếp.

### 5.1. Trang chủ (Home)

```
┌──────────────────────────────────────────────────────────┐
│ [Logo]   Trang chủ  Quốc gia  Trường  Học bổng  Tin tức  │
│                                     Giới thiệu  Liên hệ ▸ │  ← Header sticky
├──────────────────────────────────────────────────────────┤
│   ┌──────────────────────────────┐   [Ảnh sinh viên       │
│   │ TIÊU ĐỀ LỚN (H1)              │    quốc tế, animation  │  ← Hero Banner
│   │ Mô tả ngắn 2 dòng             │    parallax nhẹ]       │
│   │ [Đăng ký tư vấn] [Khám phá ▸]│                        │
│   └──────────────────────────────┘                        │
├──────────────────────────────────────────────────────────┤
│  [50+]      [12]        [5,000+]     [200+]    [95%]     │  ← Thống kê (counter animation)
│  Trường     Quốc gia    Sinh viên    Học bổng  Tỷ lệ Visa │
├──────────────────────────────────────────────────────────┤
│  DANH SÁCH QUỐC GIA (grid 4x2, hover lift + flag icon)    │
│  [Mỹ] [Canada] [Úc] [Anh] [Hàn] [Nhật] [Sing] [NZ]        │
├──────────────────────────────────────────────────────────┤
│  TRƯỜNG NỔI BẬT (carousel/grid card)                       │
│  [Card trường 1] [Card trường 2] [Card trường 3] [→ Xem]  │
├──────────────────────────────────────────────────────────┤
│  CHƯƠNG TRÌNH HỌC (tabs: Đại học|Sau ĐH|Cao đẳng|...)     │
├──────────────────────────────────────────────────────────┤
│  HỌC BỔNG NỔI BẬT (card: giá trị, deadline, [Đăng ký])    │
├──────────────────────────────────────────────────────────┤
│  TIN TỨC MỚI NHẤT (grid 3 cột + "Xem tất cả")             │
├──────────────────────────────────────────────────────────┤
│  CÂU CHUYỆN HỌC VIÊN (slider full-width, ảnh/video)        │
├──────────────────────────────────────────────────────────┤
│  FAQ (accordion, 20 câu — hiển thị 6-8, "Xem thêm")        │
├──────────────────────────────────────────────────────────┤
│  FORM ĐĂNG KÝ TƯ VẤN (2 cột: form trái, ảnh/benefit phải) │
├──────────────────────────────────────────────────────────┤
│  FOOTER: 4 cột (Về chúng tôi | Liên kết | Liên hệ | Map)  │
│  Social icons | Bản đồ nhúng | Copyright                   │
└──────────────────────────────────────────────────────────┘
```

### 5.2. Trang danh sách trường (`/truong`)

```
┌──────────────────────────────────────────────────────────┐
│ Breadcrumb: Trang chủ > Trường                             │
├───────────────┬────────────────────────────────────────────┤
│ SIDEBAR FILTER │  Sắp xếp: [Nổi bật ▾]      Kết quả: 48    │
│ ☐ Quốc gia     ├────────────────────────────────────────────┤
│ ☐ Xếp hạng     │  [Card] [Card] [Card]                      │
│ ☐ Học phí (slider) │  [Card] [Card] [Card]                  │
│ ☐ Chuyên ngành │  [Card] [Card] [Card]                      │
│ [Áp dụng]      │                                            │
│ [Xóa lọc]      │        [Phân trang: 1 2 3 ... 8]           │
└───────────────┴────────────────────────────────────────────┘
```
Trên mobile: filter chuyển thành Bottom Sheet / Drawer trượt lên.

### 5.3. Trang chi tiết trường (`/truong/[slug]`)

```
┌──────────────────────────────────────────────────────────┐
│ [BANNER trường - full width, logo overlay góc trái dưới]   │
├──────────────────────────────────────────────────────────┤
│ Tên trường | Quốc gia, Thành phố | ⭐ Xếp hạng #120 QS     │
│ [Đăng ký tư vấn ngay] (sticky CTA button khi scroll)       │
├───────────────┬────────────────────────────────────────────┤
│ TABS: Giới thiệu | Chuyên ngành | Học phí | Học bổng |     │
│       Ký túc xá | Album/Video | FAQ | Bản đồ               │
├───────────────┴────────────────────────────────────────────┤
│  Nội dung theo tab đang chọn (rich text từ TipTap)         │
├──────────────────────────────────────────────────────────┤
│  [Google Map nhúng vị trí trường]                          │
├──────────────────────────────────────────────────────────┤
│  FAQ riêng của trường (accordion)                          │
├──────────────────────────────────────────────────────────┤
│  FORM ĐĂNG KÝ TƯ VẤN (prefill trường = trường đang xem)    │
├──────────────────────────────────────────────────────────┤
│  Trường liên quan cùng quốc gia (related card)             │
└──────────────────────────────────────────────────────────┘
```

### 5.4. Trang Admin Dashboard

```
┌───────────┬────────────────────────────────────────────────┐
│ SIDEBAR   │  Header: [Search] [Thông báo 🔔] [Avatar ▾]     │
│ Dashboard │────────────────────────────────────────────────│
│ Leads     │  ┌────────┐┌────────┐┌────────┐┌────────┐      │
│ Trường    │  │Tổng lead││Hôm nay ││Tháng này││Tỷ lệ VS│     │
│ Quốc gia  │  └────────┘└────────┘└────────┘└────────┘      │
│ Học bổng  │  ┌──────────────────────┐┌─────────────────┐   │
│ Bài viết  │  │ Biểu đồ lead theo ngày ││ Lead theo quốc gia││
│ Testimon. │  │ (line chart)          ││ (pie/donut chart) ││
│ FAQ       │  └──────────────────────┘└─────────────────┘   │
│ Banner    │  ┌────────────────────────────────────────┐    │
│ Media     │  │ Bảng lead mới nhất (10 dòng) [Xem tất cả]│   │
│ Users     │  └────────────────────────────────────────┘    │
│ Settings  │                                                │
└───────────┴────────────────────────────────────────────────┘
```

### 5.5. Trang quản lý Lead (`/admin/leads`)

```
┌────────────────────────────────────────────────────────────┐
│ [Tìm kiếm...] [Lọc trạng thái ▾] [Lọc quốc gia ▾] [Xuất Excel]│
│                                              [Xuất PDF]     │
├────────────────────────────────────────────────────────────┤
│ ☐ | Họ tên | SĐT | Quốc gia mong muốn | Trạng thái | Ngày |>│
│ ☐ | Nguyễn A | 09xx | Canada | [Badge: Mới] | 12/07 | Xem  │
│ ...                                                          │
├────────────────────────────────────────────────────────────┤
│                     [Phân trang]                             │
└────────────────────────────────────────────────────────────┘
```

### 5.6. Chi tiết Lead (`/admin/leads/[id]`)

```
┌───────────────────────────┬──────────────────────────────┐
│ Thông tin học sinh          │ Trạng thái: [Đang tư vấn ▾]  │
│ - Họ tên, ngày sinh, SĐT... │ Lịch sử chăm sóc (timeline):  │
│ - GPA, ngoại ngữ            │  • 10/07 - Gọi điện, hẹn lại  │
│ - Trường/ngành mong muốn     │  • 11/07 - Gửi email brochure │
│                              │ [+ Thêm ghi chú mới]          │
└───────────────────────────┴──────────────────────────────┘
```

---

## 6. THIẾT KẾ DATABASE (ERD + BẢNG DỮ LIỆU)

### 6.1. Sơ đồ ERD (dạng văn bản)

```
users ──< user_roles >── roles ──< role_permissions >── permissions

countries ──< universities >── programs
universities ──< scholarships
universities ──< media (polymorphic: entity_type='university')
universities ──< faq (polymorphic)

categories ──< articles
articles ──< media (polymorphic)

leads ──< lead_notes >── users (tư vấn viên)
leads >── universities (nullable, trường quan tâm)
leads >── countries (nullable, quốc gia mong muốn)

testimonials ──< media (polymorphic)

banners, menus, settings, seo_metadata: bảng cấu hình độc lập
seo_metadata >── (polymorphic: page_type + page_id) mọi entity có SEO riêng
```

### 6.2. Chi tiết các bảng chính

#### `users`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| full_name | varchar(255) | |
| email | varchar(255) UNIQUE | |
| password_hash | varchar(255) | bcrypt |
| avatar_url | varchar(500) | nullable |
| role_id | UUID FK → roles.id | |
| status | enum('active','inactive') | default active |
| last_login_at | timestamp | nullable |
| created_at, updated_at | timestamp | |

#### `roles`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| name | varchar(50) UNIQUE | Super Admin, Admin, Tư vấn viên |
| created_at | timestamp | |

#### `permissions`
| Cột | Kiểu |
|---|---|
| id | UUID PK |
| code | varchar(100) UNIQUE (vd: `leads.view`, `universities.edit`) |
| description | varchar(255) |

#### `role_permissions` (bảng trung gian)
| Cột | Kiểu |
|---|---|
| role_id | UUID FK |
| permission_id | UUID FK |
| PK | (role_id, permission_id) |

#### `countries`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| name | varchar(100) | |
| slug | varchar(100) UNIQUE | |
| flag_url | varchar(500) | |
| description | text | |
| is_active | boolean | default true |
| display_order | int | |
| created_at, updated_at | timestamp | |

#### `universities`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| country_id | UUID FK → countries.id | |
| name | varchar(255) | |
| slug | varchar(255) UNIQUE | |
| city | varchar(100) | |
| logo_url | varchar(500) | |
| banner_url | varchar(500) | |
| ranking | int | nullable |
| ranking_source | varchar(100) | vd: "QS World 2026" |
| tuition_min, tuition_max | numeric(12,2) | theo năm, đơn vị USD |
| description | text | rich text (HTML từ TipTap) |
| admission_requirements | text | |
| english_requirements | text | vd: IELTS 6.5+ |
| living_cost | text | |
| dormitory_info | text | |
| video_url | varchar(500) | nullable |
| latitude, longitude | decimal | cho bản đồ |
| is_featured | boolean | |
| is_active | boolean | |
| view_count | int | default 0 |
| created_at, updated_at | timestamp | |

#### `programs` (chuyên ngành/chương trình học)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| university_id | UUID FK | |
| name | varchar(255) | vd: "Khoa học Máy tính" |
| level | enum('undergraduate','graduate','college','master','phd','foundation','transfer') | |
| duration_months | int | |
| tuition_per_year | numeric(12,2) | |
| description | text | |
| created_at, updated_at | timestamp | |

#### `scholarships`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| university_id | UUID FK | nullable (học bổng có thể áp dụng nhiều trường → bảng trung gian nếu cần N-N) |
| name | varchar(255) | |
| slug | varchar(255) UNIQUE | |
| value | varchar(255) | vd: "Miễn 100% học phí" |
| conditions | text | |
| deadline | date | |
| description | text | |
| is_active | boolean | |
| created_at, updated_at | timestamp | |

> Ghi chú: nếu 1 học bổng áp dụng cho nhiều trường, tách bảng trung gian `scholarship_universities (scholarship_id, university_id)`.

#### `categories` (danh mục bài viết)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| name | varchar(100) | Tin tuyển sinh, Học bổng, Visa, Kinh nghiệm, Cuộc sống du học |
| slug | varchar(100) UNIQUE | |

#### `articles`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| category_id | UUID FK | |
| author_id | UUID FK → users.id | |
| title | varchar(255) | |
| slug | varchar(255) UNIQUE | |
| thumbnail_url | varchar(500) | |
| excerpt | varchar(500) | |
| content | text | HTML từ TipTap |
| status | enum('draft','published','archived') | |
| published_at | timestamp | nullable |
| view_count | int | default 0 |
| created_at, updated_at | timestamp | |

#### `faq`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| entity_type | varchar(50) | 'global', 'university' |
| entity_id | UUID | nullable, FK động theo entity_type |
| question | varchar(500) | |
| answer | text | |
| display_order | int | |

#### `testimonials`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| student_name | varchar(255) | |
| university_id | UUID FK | nullable |
| content | text | |
| video_url | varchar(500) | nullable |
| avatar_url | varchar(500) | |
| is_featured | boolean | |
| created_at | timestamp | |

#### `leads` (bảng quan trọng nhất — dữ liệu form đăng ký)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| full_name | varchar(255) | |
| date_of_birth | date | |
| gender | enum('male','female','other') | |
| email | varchar(255) | |
| phone | varchar(20) | |
| city | varchar(100) | |
| current_school | varchar(255) | nullable |
| gpa | decimal(3,2) | nullable |
| language_level | varchar(100) | vd: IELTS 6.0 |
| desired_country_id | UUID FK → countries.id | nullable |
| desired_university_id | UUID FK → universities.id | nullable |
| major | varchar(255) | nullable |
| intake_term | varchar(50) | vd: "Fall 2027" |
| budget | varchar(100) | nullable |
| note | text | nullable |
| status | enum('new','contacted','consulting','preparing_documents','submitted','visa_approved','discontinued') | default 'new' |
| assigned_to | UUID FK → users.id | nullable, tư vấn viên phụ trách |
| source_page | varchar(255) | url trang gửi form (tracking) |
| utm_source, utm_medium, utm_campaign | varchar(100) | tracking marketing |
| created_at, updated_at | timestamp | |

#### `lead_notes` (lịch sử chăm sóc)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| lead_id | UUID FK → leads.id | |
| user_id | UUID FK → users.id | người ghi chú |
| note | text | |
| status_change_to | varchar(50) | nullable, nếu note đi kèm đổi trạng thái |
| created_at | timestamp | |

#### `media` (thư viện media dùng chung — polymorphic)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| entity_type | varchar(50) | 'university','article','testimonial'... |
| entity_id | UUID | |
| url | varchar(500) | |
| type | enum('image','video') | |
| alt_text | varchar(255) | cho SEO/accessibility |
| display_order | int | |
| created_at | timestamp | |

#### `settings`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| key | varchar(100) PK | vd: 'site_name', 'hotline', 'facebook_url' |
| value | text | |

#### `banners`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| position | varchar(50) | 'home_hero','sidebar',... |
| image_url | varchar(500) | |
| link_url | varchar(500) | |
| display_order | int | |
| is_active | boolean | |
| start_date, end_date | date | nullable, lên lịch hiển thị |

#### `menus`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| label | varchar(100) | |
| url | varchar(255) | |
| parent_id | UUID FK → menus.id | nullable, hỗ trợ menu con |
| display_order | int | |
| is_active | boolean | |

#### `seo_metadata` (polymorphic — SEO riêng cho từng entity)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | UUID PK | |
| entity_type | varchar(50) | 'university','article','scholarship','page' |
| entity_id | UUID | |
| meta_title | varchar(255) | |
| meta_description | varchar(500) | |
| og_image_url | varchar(500) | |
| canonical_url | varchar(500) | |
| created_at, updated_at | timestamp | |

### 6.3. Chỉ mục (Index) khuyến nghị

- `universities`: index trên `slug`, `country_id`, `is_active`, composite `(country_id, is_active, is_featured)`.
- `leads`: index trên `status`, `created_at`, `assigned_to`, `desired_country_id`.
- `articles`: index trên `slug`, `status`, `published_at`.
- Full-text search (PostgreSQL `tsvector`) trên `universities.name` + `articles.title` để hỗ trợ tìm kiếm nhanh.

---

## 7. THIẾT KẾ REST API

### 7.1. Quy ước chung

- Base URL: `https://api.domain.edu.vn/api/v1` (hoặc `/api` nếu dùng chung Next.js).
- Định dạng phản hồi chuẩn:

```json
{
  "success": true,
  "data": { },
  "message": "Thành công",
  "meta": { "page": 1, "limit": 20, "total": 120 }
}
```

- Lỗi:
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [{ "field": "email", "message": "Email không đúng định dạng" }]
}
```

- Auth header: `Authorization: Bearer <access_token>`

### 7.2. Authentication

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/login` | Đăng nhập, trả về access + refresh token |
| POST | `/auth/refresh` | Làm mới access token |
| POST | `/auth/logout` | Thu hồi refresh token |
| GET | `/auth/me` | Lấy thông tin user hiện tại |

**Request mẫu `POST /auth/login`:**
```json
{ "email": "admin@example.com", "password": "••••••••" }
```
**Response mẫu:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": { "id": "uuid", "fullName": "Nguyễn Admin", "role": "Admin" }
  }
}
```

### 7.3. Countries

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/countries` | Public | Danh sách quốc gia |
| GET | `/countries/:slug` | Public | Chi tiết + trường liên quan |
| POST | `/countries` | Admin | Tạo mới |
| PUT | `/countries/:id` | Admin | Cập nhật |
| DELETE | `/countries/:id` | Admin | Xóa (soft delete) |

### 7.4. Universities

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/universities?country=&major=&tuition_min=&tuition_max=&ranking=&page=&limit=` | Public | Danh sách có filter + phân trang |
| GET | `/universities/:slug` | Public | Chi tiết trường |
| POST | `/universities` | Admin | Tạo mới |
| PUT | `/universities/:id` | Admin | Cập nhật |
| DELETE | `/universities/:id` | Admin | Xóa |
| POST | `/universities/:id/media` | Admin | Upload ảnh/video |

**Request mẫu `GET /universities?country=canada&page=1&limit=12`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "University of Toronto",
      "slug": "university-of-toronto",
      "city": "Toronto",
      "logoUrl": "https://cdn.../logo.png",
      "ranking": 21,
      "tuitionMin": 45000,
      "tuitionMax": 60000,
      "country": { "name": "Canada", "slug": "canada" }
    }
  ],
  "meta": { "page": 1, "limit": 12, "total": 34 }
}
```

### 7.5. Programs

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/programs?level=&university_id=` | Public |
| POST | `/programs` | Admin |
| PUT | `/programs/:id` | Admin |
| DELETE | `/programs/:id` | Admin |

### 7.6. Scholarships

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/scholarships?country=&university_id=&active=true` | Public |
| GET | `/scholarships/:slug` | Public |
| POST | `/scholarships` | Admin |
| PUT | `/scholarships/:id` | Admin |
| DELETE | `/scholarships/:id` | Admin |

### 7.7. Articles

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/articles?category=&page=&limit=` | Public |
| GET | `/articles/:slug` | Public |
| POST | `/articles` | Admin |
| PUT | `/articles/:id` | Admin |
| DELETE | `/articles/:id` | Admin |

### 7.8. Leads (Form đăng ký) — quan trọng nhất

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/leads` | Public (rate-limited) | Tạo lead mới từ form |
| GET | `/leads?status=&country=&from=&to=&page=` | Admin | Danh sách + filter |
| GET | `/leads/:id` | Admin | Chi tiết |
| PUT | `/leads/:id/status` | Admin | Đổi trạng thái |
| POST | `/leads/:id/notes` | Admin | Thêm ghi chú chăm sóc |
| GET | `/leads/export?format=excel|pdf` | Admin | Xuất báo cáo |

**Request mẫu `POST /leads`:**
```json
{
  "fullName": "Trần Thị B",
  "dateOfBirth": "2007-05-14",
  "gender": "female",
  "email": "tranthib@example.com",
  "phone": "0912345678",
  "city": "Đà Nẵng",
  "currentSchool": "THPT Phan Châu Trinh",
  "gpa": 8.5,
  "languageLevel": "IELTS 6.0",
  "desiredCountry": "canada",
  "desiredUniversity": "university-of-toronto",
  "major": "Khoa học máy tính",
  "intakeTerm": "Fall 2027",
  "budget": "500-700 triệu/năm",
  "note": "Muốn tư vấn về học bổng"
}
```
**Response:**
```json
{ "success": true, "message": "Đăng ký thành công, chúng tôi sẽ liên hệ trong 24h", "data": { "leadId": "uuid" } }
```

### 7.9. Dashboard thống kê

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/dashboard/summary` | Admin — tổng lead, hôm nay, tháng này |
| GET | `/dashboard/leads-by-date?from=&to=` | Admin — biểu đồ theo ngày |
| GET | `/dashboard/leads-by-country` | Admin |
| GET | `/dashboard/leads-by-status` | Admin |

### 7.10. Upload

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/upload/image` | Admin — multipart/form-data, trả về URL Cloudinary/MinIO |
| POST | `/upload/video` | Admin |
| DELETE | `/upload/:publicId` | Admin |

---

## 8. THIẾT KẾ UI/UX

### 8.1. Design Tokens

**Color Palette:**
```
--color-primary:      #1E4FA3   /* Xanh dương chủ đạo */
--color-primary-dark: #123a7a
--color-primary-light:#E8F0FC
--color-accent:       #F5C451   /* Vàng nhạt - điểm nhấn CTA/học bổng */
--color-white:        #FFFFFF
--color-neutral-50:   #F8FAFC
--color-neutral-200:  #E2E8F0
--color-neutral-600:  #475569
--color-neutral-900:  #0F172A
--color-success:      #16A34A
--color-warning:      #F59E0B
--color-danger:       #DC2626
```

**Typography:**
- Heading: `Be Vietnam Pro` hoặc `Inter` (hỗ trợ tiếng Việt tốt, hiện đại, chuẩn giáo dục quốc tế).
- Body: `Inter` / `Be Vietnam Pro Regular`.
- Scale: H1 40-48px / H2 32px / H3 24px / Body 16px / Small 14px, line-height 1.5-1.6.

**Spacing:** hệ số 4px (Tailwind mặc định: 4,8,12,16,24,32,48,64...) — nhiều khoảng trắng giữa các section (py-16 đến py-24 trên desktop).

**Border radius:** 8px (input/button nhỏ), 16px (card), 24px (banner/hero blocks) — tạo cảm giác mềm mại, hiện đại.

**Shadow:** shadow nhẹ, nhiều lớp (elevation thấp cho card, tăng nhẹ khi hover) để tránh nặng nề.

### 8.2. Component states & motion (Framer Motion)

- Card trường: `hover:-translate-y-1 hover:shadow-lg transition` (150-200ms).
- Hero text: fade-in + slide-up khi load trang (staggered children).
- Số liệu thống kê: animate count-up khi vào viewport (Framer `useInView`).
- Accordion FAQ: height auto animate + rotate icon.
- Form: micro-interaction shake nhẹ khi lỗi validate.

### 8.3. Responsive breakpoints

| Breakpoint | Width | Ghi chú |
|---|---|---|
| Mobile | < 640px | 1 cột, filter → bottom sheet, menu → hamburger |
| Tablet | 640-1024px | 2 cột card, sidebar filter thu gọn |
| Desktop | > 1024px | 3-4 cột card, sidebar cố định |

### 8.4. Accessibility (WCAG 2.1 AA)

- Contrast ratio văn bản ≥ 4.5:1 (primary blue trên nền trắng đạt chuẩn).
- Toàn bộ ảnh có `alt` mô tả (lấy từ `media.alt_text`).
- Form input có `<label>` liên kết `htmlFor`, thông báo lỗi dùng `aria-describedby`.
- Focus state rõ ràng (outline 2px, không `outline: none` mà không thay thế).
- Điều hướng đầy đủ bằng bàn phím (Tab, Enter, Esc để đóng modal).

---

## 9. DANH SÁCH COMPONENT

### 9.1. Shared / UI primitives (Shadcn-based)
`Button`, `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `Checkbox`, `RadioGroup`, `Badge`, `Card`, `Dialog/Modal`, `Sheet (Drawer)`, `Toast/Sonner`, `Tabs`, `Accordion`, `Tooltip`, `Pagination`, `Skeleton`, `Avatar`, `DropdownMenu`, `Table`, `Progress`, `Slider` (dùng cho lọc học phí)

### 9.2. Layout
`Header` (sticky, mega-menu quốc gia), `Footer`, `Breadcrumb`, `MobileMenu`, `AdminSidebar`, `AdminHeader`, `AdminPageContainer`

### 9.3. Public Domain Components
`HeroBanner`, `StatCounter`, `CountryGrid`, `CountryCard`, `UniversityCard`, `UniversityFilterSidebar`, `UniversityDetailTabs`, `ProgramLevelTabs`, `ScholarshipCard`, `ArticleCard`, `ArticleCategoryNav`, `TestimonialSlider`, `FaqAccordion`, `ConsultationForm` (đa bước hoặc 1 trang, có prefill props), `MapEmbed`, `VideoPlayer`, `ImageGallery/Lightbox`, `NewsletterCTA` (tùy chọn)

### 9.4. Admin Domain Components
`DashboardStatCard`, `LeadsTable`, `LeadStatusBadge`, `LeadDetailPanel`, `LeadNotesTimeline`, `LeadFilterBar`, `ExportButton (Excel/PDF)`, `UniversityForm`, `RichTextEditor (TipTap wrapper)`, `MediaUploader`, `MediaLibraryModal`, `ArticleForm`, `ScholarshipForm`, `RoleGuard (permission wrapper)`, `LineChart / PieChart (Recharts wrapper)`, `SeoMetaForm`

### 9.5. Form field components (dùng chung React Hook Form + Zod)
`FormField`, `FormErrorMessage`, `PhoneInput`, `GpaInput`, `LanguageLevelSelect`, `CountrySelect`, `UniversitySelect` (async search), `BudgetRangeSelect`

---

## 10. THIẾT KẾ BACKEND

### 10.1. Cấu trúc thư mục (Next.js Route Handlers)

```
src/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth/route.ts
│   │   │   ├── universities/route.ts
│   │   │   ├── universities/[slug]/route.ts
│   │   │   ├── leads/route.ts
│   │   │   ├── leads/[id]/route.ts
│   │   │   ├── leads/[id]/notes/route.ts
│   │   │   ├── scholarships/route.ts
│   │   │   ├── articles/route.ts
│   │   │   ├── dashboard/summary/route.ts
│   │   │   └── upload/image/route.ts
├── server/
│   ├── controllers/          # nhận request, gọi service, trả response
│   ├── services/             # business logic thuần (LeadService, UniversityService...)
│   ├── repositories/         # Prisma queries tách riêng
│   ├── validators/           # Zod schemas (dùng chung FE/BE)
│   ├── middlewares/          # auth.ts, rateLimit.ts, errorHandler.ts
│   └── utils/                # jwt.ts, bcrypt.ts, slugify.ts
├── lib/
│   ├── prisma.ts
│   ├── email/                # templates + sender (Resend)
│   └── storage/              # cloudinary.ts hoặc minio.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

### 10.2. Nguyên tắc phân lớp

- **Controller (Route Handler)**: parse request, gọi Zod validate, gọi Service, format response — KHÔNG chứa business logic.
- **Service**: chứa toàn bộ logic nghiệp vụ (vd: `LeadService.create()` kiểm tra trùng lặp email trong 24h trước khi tạo, trigger email).
- **Repository**: chỉ chứa Prisma query, không business logic — dễ mock khi unit test Service.

### 10.3. Middleware quan trọng

```ts
// middlewares/auth.ts (giả lập)
export async function requireAuth(req: Request, requiredPermission?: string) {
  const token = getBearerToken(req);
  if (!token) throw new UnauthorizedError();
  const payload = verifyJwt(token); // ném lỗi nếu hết hạn/không hợp lệ
  if (requiredPermission && !payload.permissions.includes(requiredPermission)) {
    throw new ForbiddenError();
  }
  return payload;
}
```

```ts
// middlewares/rateLimit.ts — áp dụng cho POST /leads để chống spam
const RATE_LIMIT = { windowMs: 60_000, max: 5 }; // 5 request/phút/IP
```

### 10.4. Xử lý lỗi tập trung

Tất cả lỗi custom (`ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`) được catch ở 1 wrapper chung `withErrorHandler(handler)` bọc quanh mọi Route Handler, trả về đúng format lỗi chuẩn hóa (mục 7.1) và mã HTTP tương ứng (400/401/403/404/409/500).

---

## 11. THIẾT KẾ FRONTEND

### 11.1. Cấu trúc thư mục Frontend

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                # Header + Footer
│   │   ├── page.tsx                  # Trang chủ
│   │   ├── quoc-gia/[slug]/page.tsx
│   │   ├── truong/page.tsx
│   │   ├── truong/[slug]/page.tsx
│   │   ├── hoc-bong/[slug]/page.tsx
│   │   ├── tin-tuc/[slug]/page.tsx
│   │   └── dang-ky-tu-van/page.tsx
│   ├── (admin)/
│   │   ├── admin/layout.tsx          # Sidebar + guard auth
│   │   ├── admin/dashboard/page.tsx
│   │   ├── admin/leads/page.tsx
│   │   └── admin/leads/[id]/page.tsx
│   └── api/...
├── components/
│   ├── ui/                           # shadcn primitives
│   ├── public/
│   └── admin/
├── hooks/
│   ├── useLeads.ts                   # TanStack Query hooks
│   ├── useUniversities.ts
│   └── useAuth.ts
├── stores/                           # Zustand (nếu cần state client phức tạp, vd filter state)
├── types/
└── styles/
```

### 11.2. Chiến lược Rendering

| Trang | Chiến lược | Lý do |
|---|---|---|
| Trang chủ | ISR (revalidate 3600s) | Nội dung ít đổi theo phút, cần SEO tốt |
| Danh sách/chi tiết trường | ISR + `generateStaticParams` cho slug phổ biến | SEO + tốc độ |
| Bài viết | SSG + revalidate on-demand (webhook khi Admin publish) | Nội dung tin tức |
| Form đăng ký | Client Component (cần tương tác) trong shell Server Component | Kết hợp SEO của trang cha với UX tương tác |
| Admin | Client Component toàn bộ (CSR), bọc `"use client"` | Không cần SEO, ưu tiên tương tác nhanh |

### 11.3. Quản lý state

- **Server state** (data từ API): TanStack Query — cache, refetch, optimistic update khi đổi trạng thái lead.
- **Client UI state** (filter, modal mở/đóng, bước form): `useState`/`useReducer` cục bộ hoặc Zustand nếu chia sẻ nhiều component.
- **Form state**: React Hook Form + `zodResolver`.

### 11.4. Chia sẻ Zod schema Frontend/Backend

```ts
// validators/lead.schema.ts — dùng chung cả 2 phía
import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  dateOfBirth: z.string().refine(isValidDate, "Ngày sinh không hợp lệ"),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email("Email không đúng định dạng"),
  phone: z.string().regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  city: z.string().min(1),
  currentSchool: z.string().optional(),
  gpa: z.number().min(0).max(10).optional(),
  languageLevel: z.string().optional(),
  desiredCountry: z.string().optional(),
  desiredUniversity: z.string().optional(),
  major: z.string().optional(),
  intakeTerm: z.string().optional(),
  budget: z.string().optional(),
  note: z.string().max(1000).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;
```

---

## 12. THIẾT KẾ ADMIN DASHBOARD

### 12.1. Phân quyền (RBAC)

| Role | Quyền |
|---|---|
| Super Admin | Toàn quyền, bao gồm quản lý người dùng & phân quyền |
| Admin | CRUD nội dung (trường, học bổng, bài viết...), xem toàn bộ lead, xuất báo cáo |
| Tư vấn viên | Chỉ xem/sửa lead được giao (`assigned_to = mình`), thêm ghi chú, không được xóa nội dung |

Kiểm tra quyền ở **2 lớp**: Middleware Backend (chặn API) + `RoleGuard` Frontend (ẩn/hiện UI) — không bao giờ chỉ dựa vào ẩn UI.

### 12.2. Dashboard thống kê — chi tiết widget

1. **Card tổng quan**: Tổng lead, Lead hôm nay, Lead tháng này, Tỷ lệ chuyển đổi Visa (`đậu Visa / tổng lead đã nộp hồ sơ`).
2. **Biểu đồ đường**: Lead theo ngày (30 ngày gần nhất), dùng Recharts `LineChart`.
3. **Biểu đồ tròn**: Phân bổ lead theo quốc gia mong muốn.
4. **Biểu đồ cột**: Lead theo trạng thái (funnel chuyển đổi).
5. **Bảng lead mới nhất**: 10 dòng, link nhanh sang chi tiết.

### 12.3. Quản lý khách hàng (Leads) — tính năng

- Tìm kiếm full-text theo tên/SĐT/email.
- Bộ lọc: trạng thái, quốc gia, khoảng thời gian, tư vấn viên phụ trách.
- Phân trang server-side (tránh load hết dữ liệu).
- Xuất Excel (dùng `exceljs`), xuất PDF (dùng `pdf-lib` hoặc `@react-pdf/renderer`).
- Ghi chú nội bộ + lịch sử chăm sóc dạng timeline (bảng `lead_notes`).
- Đổi trạng thái có validate luồng hợp lệ (state machine — xem 12.4).

### 12.4. State machine trạng thái Lead

```
new ──► contacted ──► consulting ──► preparing_documents ──► submitted ──► visa_approved
  │           │              │                  │                 │
  └───────────┴──────────────┴──────────────────┴─────────────────┴──► discontinued
                    (có thể chuyển sang "discontinued" từ bất kỳ trạng thái nào, trừ visa_approved)
```
Ràng buộc: không được chuyển ngược trạng thái tùy ý qua UI thông thường (trừ Super Admin có quyền override, ghi log lý do).

### 12.5. Quản lý nội dung (Trường/Học bổng/Bài viết/FAQ)

- Form CRUD dùng chung pattern: React Hook Form + Zod + `MediaUploader` (kéo-thả, preview, upload trực tiếp Cloudinary/MinIO qua signed URL).
- Editor bài viết: TipTap với toolbar (bold, italic, heading, list, link, image, table).
- Mỗi entity có tab **SEO** riêng (Meta Title, Meta Description, Slug tự sinh nhưng cho sửa tay, OG Image).

---

## 13. LUỒNG XỬ LÝ FORM ĐĂNG KÝ

```
1. User điền form (client-side)
   → React Hook Form validate real-time theo leadSchema (Zod)
   → Nếu lỗi: hiển thị inline error, chặn submit

2. Submit hợp lệ → Server Action / POST /api/v1/leads
   → Route Handler: withErrorHandler wrap
   → Middleware rateLimit (IP-based, 5 req/phút) chống spam bot
   → Zod server-side re-validate (không tin tưởng tuyệt đối client)
   → Kiểm tra honeypot field (chống bot đơn giản, ẩn field trong form)

3. LeadService.create(input)
   → Kiểm tra trùng lặp: cùng email + cùng trường trong 24h gần nhất → không tạo bản ghi mới,
     mà thêm note "Khách đăng ký lại" vào lead cũ (tránh gây phiền cho tư vấn viên)
   → Nếu không trùng: insert bảng `leads` (status = 'new')
   → Lưu utm_source/medium/campaign nếu có (tracking hiệu quả kênh marketing)

4. Song song (Promise.allSettled — không chặn response nếu email lỗi):
   a. EmailService.sendConfirmationToUser(lead)   — email cảm ơn + thông tin liên hệ
   b. EmailService.notifyAdmin(lead)               — email nội bộ cho tư vấn viên/admin
   c. (tùy chọn) Webhook sang Zalo OA / Telegram bot để noti tức thời

5. Response 201 → Client:
   → Hiển thị Toast "Đăng ký thành công! Chúng tôi sẽ liên hệ trong 24h"
   → Reset form
   → (tùy chọn) Trigger Google Analytics event `generate_lead` cho đo lường conversion

6. Admin Dashboard:
   → TanStack Query polling/refetch hoặc WebSocket (giai đoạn 2) để thấy lead mới real-time
```

### 13.1. Chống spam/bot bổ sung

- Honeypot field ẩn (bot tự động điền, người dùng thật không thấy).
- Rate limit theo IP.
- (Tùy chọn nâng cao) Google reCAPTCHA v3 invisible nếu spam vẫn nhiều sau khi launch.

---

## 14. QUY TRÌNH GỬI EMAIL VÀ THÔNG BÁO

### 14.1. Các loại email

| Loại | Người nhận | Trigger | Nội dung |
|---|---|---|---|
| Xác nhận đăng ký | Học sinh/Phụ huynh | Ngay sau khi submit form | Cảm ơn, tóm tắt thông tin đã đăng ký, hotline liên hệ |
| Thông báo Admin | Tư vấn viên/Admin | Ngay sau khi submit form | Chi tiết lead + link vào thẳng trang chi tiết trong Admin |
| Nhắc lịch hẹn (giai đoạn 2) | Học sinh | Khi tư vấn viên đặt lịch | Thời gian, hình thức tư vấn |
| Cập nhật trạng thái hồ sơ (tùy chọn) | Học sinh | Khi status đổi sang các mốc quan trọng | Thông báo tiến độ |

### 14.2. Kỹ thuật triển khai

- Dùng **Resend** + **React Email** để viết template email bằng component React (dễ bảo trì, preview trực quan hơn viết HTML string tay).
- Gửi email **bất đồng bộ**, không chặn response API (`Promise.allSettled`, log lỗi nếu gửi thất bại — không throw lỗi làm fail cả request tạo lead).
- Retry queue đơn giản (giai đoạn 2: dùng BullMQ + Redis nếu volume lead lớn) — MVP có thể chỉ log lỗi + cron job quét gửi lại email thất bại mỗi giờ.

### 14.3. Ví dụ template (rút gọn)

```tsx
// emails/LeadConfirmation.tsx
export function LeadConfirmationEmail({ fullName }: { fullName: string }) {
  return (
    <Html>
      <Body>
        <Text>Chào {fullName},</Text>
        <Text>
          Cảm ơn bạn đã đăng ký tư vấn du học. Đội ngũ tư vấn viên của chúng tôi
          sẽ liên hệ trong vòng 24 giờ làm việc.
        </Text>
        <Text>Hotline hỗ trợ: 1900-xxxx</Text>
      </Body>
    </Html>
  );
}
```

---

## 15. KẾ HOẠCH SEO

### 15.1. On-page SEO

- Mỗi trang có `generateMetadata()` động (Next.js), lấy dữ liệu từ bảng `seo_metadata` nếu Admin đã cấu hình riêng, fallback về mặc định thông minh (vd: title = tên trường + "Học phí, học bổng, điều kiện tuyển sinh").
- Cấu trúc heading chuẩn: chỉ 1 `<h1>`/trang, `<h2>` cho section chính.
- URL thân thiện (đã thiết kế slug tiếng Việt không dấu ở mục Sitemap).
- Internal linking: trang trường liên kết tới quốc gia, chương trình học, học bổng liên quan.

### 15.2. Technical SEO

- `sitemap.xml` sinh động (Next.js `app/sitemap.ts`), tự động cập nhật khi có trường/bài viết mới.
- `robots.txt` cho phép crawl toàn bộ trừ `/admin`.
- **Structured Data (JSON-LD):**
  - `EducationalOrganization` cho từng trường.
  - `Article` cho bài viết tin tức.
  - `BreadcrumbList` cho mọi trang con.
  - `FAQPage` cho trang FAQ.
- Open Graph + Twitter Card đầy đủ cho social sharing.
- Canonical URL tránh trùng lặp nội dung (đặc biệt trang filter `/truong?...`).

### 15.3. Hiệu năng phục vụ SEO (Core Web Vitals)

- Ảnh: `next/image` bắt buộc, format WebP/AVIF tự động, `priority` cho ảnh above-the-fold.
- Font: `next/font` để tránh layout shift (CLS) và preload.
- Server Components giảm JS gửi về client → cải thiện LCP/INP.
- ISR cho các trang danh sách/chi tiết để vừa nhanh vừa luôn có nội dung mới.

### 15.4. Kế hoạch nội dung SEO (Content Strategy)

- Xây dựng cụm chủ đề (topic cluster): "Du học Canada" (pillar page) → bài viết con: học phí, visa, học bổng, kinh nghiệm.
- Từ khóa mục tiêu theo từng quốc gia + chuyên ngành (long-tail: "học bổng du học Canada ngành công nghệ thông tin").
- Cập nhật tin tức đều đặn (2-3 bài/tuần) để tăng tần suất crawl.

---

## 16. KẾ HOẠCH TRIỂN KHAI VPS (DOCKER + NGINX)

### 16.1. Kiến trúc Docker Compose

```yaml
# docker-compose.yml (rút gọn minh họa)
version: "3.9"
services:
  app:
    build: .
    container_name: duhoc_app
    restart: unless-stopped
    env_file: .env.production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks: [app_network]

  postgres:
    image: postgres:16-alpine
    container_name: duhoc_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: duhoc
      POSTGRES_USER: duhoc_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks: [app_network]

  minio:
    image: minio/minio
    container_name: duhoc_minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    networks: [app_network]

volumes:
  pg_data:
  minio_data:

networks:
  app_network:
```

### 16.2. Cấu hình Nginx (reverse proxy + SSL)

```nginx
server {
    listen 80;
    server_name domain.edu.vn www.domain.edu.vn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name domain.edu.vn www.domain.edu.vn;

    ssl_certificate     /etc/letsencrypt/live/domain.edu.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.edu.vn/privkey.pem;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 16.3. PM2 (không dùng Docker cho phần app, chạy trực tiếp trên VPS)

```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "duhoc-app",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3000",
    instances: "max",
    exec_mode: "cluster",
    env_production: { NODE_ENV: "production" }
  }]
};
```

### 16.4. Quy trình triển khai (deploy pipeline)

```
1. Push code lên nhánh `main` (GitHub)
2. GitHub Actions:
   - Install deps → Lint → Type-check → Build thử (next build)
   - Nếu pass: SSH vào VPS → git pull → npm ci → prisma migrate deploy
     → npm run build → pm2 reload duhoc-app (zero-downtime reload)
3. Nginx không cần restart (chỉ reverse proxy, không đổi cấu hình)
4. Health-check endpoint `/api/health` để giám sát uptime (UptimeRobot/BetterStack)
```

### 16.5. Backup & giám sát

- Cron job backup PostgreSQL hằng ngày (`pg_dump` → nén → upload lên MinIO/Cloudinary hoặc S3-compatible khác, giữ 7-30 bản gần nhất).
- Log tập trung: PM2 logs + logrotate.
- Cảnh báo uptime qua email/Telegram khi health-check fail.

---

## 17. ROADMAP PHÁT TRIỂN THEO SPRINT

> Giả định 1 Sprint = 2 tuần, team 1-2 dev fullstack (phù hợp bối cảnh làm side-project/freelance ~10-20h/tuần → có thể kéo dài mỗi sprint thành 3-4 tuần thực tế nếu làm part-time).

### Sprint 0 — Chuẩn bị (Setup)
- Khởi tạo repo, cấu hình Next.js 16 + TypeScript + Tailwind + Shadcn.
- Thiết kế Figma (Design System, 5-6 màn hình chính).
- Thiết kế schema Prisma đầy đủ + migration đầu tiên.
- Setup Docker Compose (Postgres + MinIO local dev).

### Sprint 1 — Nền tảng Backend & Auth
- CRUD Countries, Universities, Programs (API + Prisma).
- Module Auth (JWT login/refresh, middleware phân quyền RBAC).
- Setup upload ảnh (Cloudinary/MinIO signed URL).

### Sprint 2 — Trang chủ & Trang trường (Public)
- Header/Footer, Hero Banner, Stat Counter, Country Grid.
- Trang danh sách trường (filter + phân trang).
- Trang chi tiết trường (tabs, FAQ, bản đồ).

### Sprint 3 — Học bổng, Bài viết, Form đăng ký
- Module Scholarships (API + trang public).
- Module Articles + trang tin tức + TipTap editor (Admin).
- ConsultationForm hoàn chỉnh (RHF + Zod) + API `/leads` + email tự động.

### Sprint 4 — Admin Dashboard & Quản lý Lead
- Dashboard thống kê (biểu đồ, card tổng quan).
- Trang quản lý Leads (bảng, filter, xuất Excel/PDF, ghi chú, state machine trạng thái).
- Quản lý người dùng & phân quyền (Super Admin/Admin/Tư vấn viên).

### Sprint 5 — Nội dung phụ trợ & SEO
- Testimonials, FAQ, Banner, Menu quản lý động.
- Sitemap.xml, robots.txt, JSON-LD, Open Graph, SEO metadata form trong Admin.
- Tối ưu Core Web Vitals (image, font, lazy load).

### Sprint 6 — QA, Bảo mật & Triển khai
- Kiểm thử toàn bộ luồng (E2E cơ bản: Playwright cho luồng form + luồng admin).
- Rà soát bảo mật (rate limit, CSRF, Zod validate 2 lớp, helmet headers).
- Setup Docker + Nginx + PM2 trên VPS, CI/CD GitHub Actions.
- UAT (User Acceptance Test) với khách hàng thực tế.

### Sprint 7 (dự phòng) — Polish & Bàn giao
- Sửa lỗi UAT, tối ưu UX nhỏ, viết tài liệu vận hành cho Admin (hướng dẫn sử dụng CMS).
- Bàn giao + đào tạo đội tư vấn viên sử dụng Admin.

---

## 18. CHECKLIST HOÀN THIỆN TRƯỚC BÀN GIAO

### Chức năng
- [ ] Toàn bộ 19 trang public trong Sitemap hoạt động đúng, không link chết (404).
- [ ] Form đăng ký tư vấn: validate đầy đủ 15 field, lưu DB, gửi email (user + admin), hiển thị toast.
- [ ] Admin CRUD đầy đủ: Trường, Quốc gia, Chương trình, Học bổng, Bài viết, FAQ, Testimonial, Banner, Menu.
- [ ] Quản lý Lead: filter, tìm kiếm, phân trang, xuất Excel/PDF, ghi chú, đổi trạng thái theo đúng state machine.
- [ ] Phân quyền RBAC hoạt động đúng ở cả Frontend (ẩn UI) và Backend (chặn API).
- [ ] Dashboard thống kê hiển thị đúng số liệu thực tế.

### SEO
- [ ] `sitemap.xml` và `robots.txt` truy cập được, đúng nội dung.
- [ ] Mọi trang có meta title/description riêng, không trùng lặp.
- [ ] JSON-LD hợp lệ (kiểm tra bằng Google Rich Results Test).
- [ ] Open Graph hiển thị đúng khi share Facebook/Zalo.
- [ ] Core Web Vitals ≥ 90 điểm (kiểm tra PageSpeed Insights) trên cả Mobile & Desktop.

### Bảo mật
- [ ] Mật khẩu mã hóa bcrypt, không lưu plaintext.
- [ ] JWT có thời hạn hợp lý (access ~15 phút, refresh ~7 ngày), refresh token thu hồi được khi logout.
- [ ] Rate limiting áp dụng cho `/leads`, `/auth/login`.
- [ ] Header bảo mật (Helmet: CSP, X-Frame-Options, X-Content-Type-Options).
- [ ] Input validate cả client lẫn server (Zod 2 lớp), chống XSS khi render rich text (sanitize HTML từ TipTap).
- [ ] Không lộ thông tin nhạy cảm trong response lỗi (stack trace) ở môi trường production.

### Hiệu năng & Vận hành
- [ ] Ảnh tối ưu WebP/AVIF, lazy load đúng.
- [ ] ISR/cache hoạt động đúng, revalidate khi Admin cập nhật nội dung.
- [ ] Backup DB tự động hằng ngày, đã test restore thử.
- [ ] Health-check endpoint hoạt động, có giám sát uptime.
- [ ] Log lỗi được ghi nhận tập trung (không chỉ console.log).

### Responsive & Accessibility
- [ ] Kiểm tra đầy đủ trên Mobile (< 640px), Tablet, Desktop.
- [ ] Contrast màu đạt chuẩn WCAG AA.
- [ ] Điều hướng bàn phím hoạt động cho form và menu.
- [ ] Alt text đầy đủ cho ảnh.

### Bàn giao
- [ ] Tài liệu hướng dẫn sử dụng Admin CMS (kèm ảnh chụp màn hình) cho đội tư vấn viên.
- [ ] Tài liệu vận hành kỹ thuật (deploy, backup, restore, xử lý sự cố cơ bản).
- [ ] Bàn giao thông tin tài khoản domain, hosting, dịch vụ bên thứ 3 (Cloudinary/Resend...).
- [ ] Video demo toàn bộ luồng (public + admin) khoảng 10-15 phút.

---

## 19. KẾ HOẠCH SINH MÃ NGUỒN THEO MODULE

Việc sinh **toàn bộ mã nguồn production** của một hệ thống ở quy mô này (19 domain models, ~40 API endpoints, Admin CMS đầy đủ RBAC, SEO, deploy pipeline) vượt quá dung lượng hợp lý của một tài liệu duy nhất — mã nguồn thật cần được viết, chạy thử và test theo từng module để đảm bảo chất lượng, thay vì sinh hàng loạt "cho có". Khuyến nghị lộ trình sinh code thực tế như sau, bám theo đúng roadmap Sprint ở mục 17:

| Thứ tự | Module | Đầu ra cụ thể |
|---|---|---|
| 1 | Setup dự án + Prisma schema | `package.json`, `prisma/schema.prisma`, cấu hình Tailwind/Shadcn, Docker Compose dev |
| 2 | Auth + RBAC middleware | `auth/route.ts`, `middlewares/auth.ts`, JWT utils, seed roles/permissions |
| 3 | API Countries/Universities/Programs | Route Handlers + Services + Repositories + Zod schemas |
| 4 | Frontend Public: Trang chủ + Danh sách/Chi tiết trường | Components trong mục 9.3 + `page.tsx` tương ứng |
| 5 | API + Frontend Leads (form đăng ký) | `leads/route.ts`, `ConsultationForm.tsx`, email templates |
| 6 | Admin Dashboard + Quản lý Lead | `admin/dashboard/page.tsx`, `admin/leads/**`, biểu đồ Recharts |
| 7 | Admin CRUD nội dung (Trường/Học bổng/Bài viết/FAQ) | Form components + TipTap + MediaUploader |
| 8 | SEO (sitemap, JSON-LD, metadata) | `app/sitemap.ts`, `generateMetadata`, `SeoMetaForm.tsx` |
| 9 | Deploy | `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `ecosystem.config.js`, GitHub Actions workflow |

**Đề xuất cách triển khai tiếp theo:** Bạn có thể yêu cầu sinh mã nguồn **theo từng module cụ thể ở trên** trong các lượt trao đổi kế tiếp (ví dụ: "Sinh mã nguồn module Auth + RBAC" hoặc "Sinh mã nguồn Prisma schema đầy đủ theo mục 6"), để mỗi phần được viết đầy đủ, đúng chuẩn, có thể chạy thử ngay — thay vì một khối code khổng lồ khó kiểm soát chất lượng. Nếu khối lượng code cần sinh lớn và mang tính lặp lại nhiều bước (tạo nhiều file, chạy thử, sửa lỗi), công cụ **Claude Code** sẽ phù hợp hơn để triển khai trực tiếp trên một repo thực tế.

---

*Hết tài liệu.*
