import { NextResponse } from "next/server";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";

/**
 * GET /api/v1/options — danh sách quốc gia/trường cho select của form tư vấn.
 * Cache tĩnh (form nhúng ở hầu hết trang public — tránh 2 query DB mỗi pageview);
 * được revalidate trong revalidateSite() sau mỗi mutation admin.
 */
export const revalidate = 1800;

export async function GET() {
  const [countries, universities] = await Promise.all([
    countryRepository.findAll(),
    universityRepository.findAll(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      countries: countries.map((c) => ({ name: c.name, slug: c.slug })),
      universities: universities.map((u) => ({
        name: u.name,
        slug: u.slug,
        countrySlug: u.countrySlug,
      })),
    },
  });
}
