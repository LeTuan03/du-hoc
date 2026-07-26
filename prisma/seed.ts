import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { countries } from "../src/server/data/countries";
import { universities } from "../src/server/data/universities";
import { scholarships } from "../src/server/data/scholarships";
import { articles } from "../src/server/data/articles";
import { testimonials } from "../src/server/data/testimonials";
import { globalFaqs } from "../src/server/data/faqs";
import { slugify } from "../src/lib/slugify";
import type { Lead } from "../src/server/types";

const prisma = new PrismaClient();

/**
 * Seed idempotent: chỉ chèn khi bảng còn trống, giữ nguyên id/slug
 * từ dữ liệu tĩnh để không đổi URL. Leads được nhập từ data/leads.json
 * (dữ liệu runtime cũ) nếu file tồn tại.
 */
/** Tài khoản Super Admin đầu tiên, lấy từ ADMIN_EMAIL/ADMIN_PASSWORD */
async function seedSuperAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@duhoc.edu.vn").toLowerCase();
  if (await prisma.user.findUnique({ where: { email } })) return;

  await prisma.user.create({
    data: {
      fullName: "Quản trị hệ thống",
      email,
      passwordHash: await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "Admin@123456",
        10,
      ),
      role: "super_admin",
      status: "active",
    },
  });
  console.log(`Seeded super admin ${email}`);
}

async function main() {
  await seedSuperAdmin();

  if ((await prisma.country.count()) === 0) {
    await prisma.country.createMany({ data: countries });
    console.log(`Seeded ${countries.length} countries`);
  }

  if ((await prisma.university.count()) === 0) {
    await prisma.university.createMany({
      data: universities.map(({ programs: _programs, ...u }) => ({
        ...u,
        faqs: u.faqs as object[],
      })),
    });
    console.log(`Seeded ${universities.length} universities`);
  }

  // Ngành học nằm ở bảng riêng `programs`, tham chiếu trường qua slug
  if ((await prisma.program.count()) === 0) {
    const rows = universities.flatMap((u) =>
      u.programs.map((p) => ({
        universitySlug: u.slug,
        name: p.name,
        slug: slugify(p.name),
        level: p.level,
        durationMonths: p.durationMonths,
        tuitionPerYear: p.tuitionPerYear,
        description: p.description ?? "",
        intakeMonths: p.intakeMonths ?? [],
      })),
    );
    // skipDuplicates: hai ngành cùng trường trùng tên sẽ đụng unique (slug, trường)
    await prisma.program.createMany({ data: rows, skipDuplicates: true });
    console.log(`Seeded ${rows.length} programs`);
  }

  if ((await prisma.scholarship.count()) === 0) {
    await prisma.scholarship.createMany({ data: scholarships });
    console.log(`Seeded ${scholarships.length} scholarships`);
  }

  if ((await prisma.article.count()) === 0) {
    await prisma.article.createMany({ data: articles });
    console.log(`Seeded ${articles.length} articles`);
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
    console.log(`Seeded ${testimonials.length} testimonials`);
  }

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: globalFaqs.map((f, i) => ({ ...f, displayOrder: i + 1 })),
    });
    console.log(`Seeded ${globalFaqs.length} faqs`);
  }

  if ((await prisma.lead.count()) === 0) {
    let leads: Lead[] = [];
    try {
      const raw = await fs.readFile(
        path.join(process.cwd(), "data", "leads.json"),
        "utf-8",
      );
      leads = JSON.parse(raw) as Lead[];
    } catch {
      // Không có file leads.json — bỏ qua
    }
    for (const lead of leads) {
      const { notes, ...rest } = lead;
      await prisma.lead.create({
        data: {
          ...rest,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
          notes: {
            create: notes.map((n) => ({
              id: n.id,
              note: n.note,
              statusChangeTo: n.statusChangeTo,
              createdAt: new Date(n.createdAt),
            })),
          },
        },
      });
    }
    if (leads.length > 0) console.log(`Seeded ${leads.length} leads`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
