import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { leadService } from "@/server/services/leadService";
import { countryRepository } from "@/server/repositories/countryRepository";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/server/types";

/**
 * GET /api/v1/leads/export — xuất danh sách hồ sơ ra CSV (SRS mục 7.8).
 * CSV thay vì xlsx để không thêm phụ thuộc nặng; Excel mở trực tiếp được
 * nhờ BOM UTF-8 (nếu thiếu BOM Excel sẽ hiển thị sai tiếng Việt).
 */

const HEADERS = [
  "Mã hồ sơ",
  "Họ tên",
  "Ngày sinh",
  "Giới tính",
  "Email",
  "Điện thoại",
  "Tỉnh/Thành phố",
  "Trường đang học",
  "GPA",
  "Ngoại ngữ",
  "Quốc gia mong muốn",
  "Trường quan tâm",
  "Ngành dự kiến",
  "Kỳ nhập học",
  "Ngân sách",
  "Trạng thái",
  "Tư vấn viên phụ trách",
  "Nguồn (utm_source)",
  "Chiến dịch (utm_campaign)",
  "Trang đăng ký",
  "Ghi chú của khách",
  "Ngày đăng ký",
];

const genderLabels: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

/** Escape theo RFC 4180: bọc nháy kép và nhân đôi nháy bên trong */
function cell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 },
    );
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [leads, countries] = await Promise.all([
    // Tư vấn viên chỉ xuất được hồ sơ của mình — phạm vi do service quyết định
    leadService.list(
      {
        status: searchParams.get("status") || undefined,
        country: searchParams.get("country") || undefined,
        search: searchParams.get("search") || undefined,
        assignedToId: searchParams.get("assignedTo") || undefined,
        from: from ? new Date(`${from}T00:00:00`) : undefined,
        to: to ? new Date(`${to}T23:59:59`) : undefined,
      },
      session,
    ),
    countryRepository.findAll(),
  ]);

  const countryName = (slug?: string | null) =>
    slug ? (countries.find((c) => c.slug === slug)?.name ?? slug) : "";

  const rows = leads.map((lead) =>
    [
      lead.code,
      lead.fullName,
      lead.dateOfBirth,
      genderLabels[lead.gender] ?? lead.gender,
      lead.email,
      lead.phone,
      lead.city,
      lead.currentSchool,
      lead.gpa,
      lead.languageLevel,
      countryName(lead.desiredCountry),
      lead.desiredUniversity,
      lead.major,
      lead.intakeTerm,
      lead.budget,
      LEAD_STATUS_LABELS[lead.status as LeadStatus] ?? lead.status,
      lead.assignedToName,
      lead.utmSource,
      lead.utmCampaign,
      lead.sourcePage,
      lead.note,
      new Date(lead.createdAt).toLocaleString("vi-VN"),
    ]
      .map(cell)
      .join(","),
  );

  const csv = "﻿" + [HEADERS.map(cell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ho-so-ung-vien-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
