import { prisma } from "../db";
import { LEAD_STATUS_LABELS, type LeadStatus } from "../types";

/**
 * Báo cáo chuyển đổi tuyển sinh (SRS mục 7.9 & 12.2).
 * Toàn bộ tổng hợp chạy bằng groupBy ở tầng DB để không kéo hết lead về app.
 */

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface FunnelStage {
  status: LeadStatus;
  label: string;
  count: number;
  /** % so với tổng số lead trong kỳ */
  shareOfTotal: number;
}

export interface ConversionReport {
  total: number;
  funnel: FunnelStage[];
  /** Đã nộp hồ sơ = submitted + visa_approved */
  submitted: number;
  visaApproved: number;
  /** Đậu visa / đã nộp hồ sơ */
  visaRate: number;
  /** Đã nộp hồ sơ / tổng lead */
  applicationRate: number;
  discontinued: number;
}

function whereRange(range: DateRange) {
  if (!range.from && !range.to) return {};
  return {
    createdAt: {
      ...(range.from ? { gte: range.from } : {}),
      ...(range.to ? { lte: range.to } : {}),
    },
  };
}

const rate = (numerator: number, denominator: number) =>
  denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;

export const reportService = {
  async conversion(range: DateRange = {}): Promise<ConversionReport> {
    const grouped = await prisma.lead.groupBy({
      by: ["status"],
      where: whereRange(range),
      _count: { _all: true },
    });
    const byStatus = new Map(grouped.map((g) => [g.status, g._count._all]));
    const total = grouped.reduce((sum, g) => sum + g._count._all, 0);

    const funnel = (Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map(
      (status) => {
        const count = byStatus.get(status) ?? 0;
        return {
          status,
          label: LEAD_STATUS_LABELS[status],
          count,
          shareOfTotal: rate(count, total),
        };
      },
    );

    const submitted =
      (byStatus.get("submitted") ?? 0) + (byStatus.get("visa_approved") ?? 0);
    const visaApproved = byStatus.get("visa_approved") ?? 0;

    return {
      total,
      funnel,
      submitted,
      visaApproved,
      visaRate: rate(visaApproved, submitted),
      applicationRate: rate(submitted, total),
      discontinued: byStatus.get("discontinued") ?? 0,
    };
  },

  /** Hiệu quả từng tư vấn viên — nền tảng đánh giá KPI đội sales */
  async byConsultant(range: DateRange = {}) {
    const [grouped, users] = await Promise.all([
      prisma.lead.groupBy({
        by: ["assignedToId", "status"],
        where: whereRange(range),
        _count: { _all: true },
      }),
      prisma.user.findMany({ select: { id: true, fullName: true } }),
    ]);

    const names = new Map(users.map((u) => [u.id, u.fullName]));
    const rows = new Map<
      string,
      { name: string; total: number; submitted: number; visaApproved: number }
    >();

    for (const g of grouped) {
      const key = g.assignedToId ?? "unassigned";
      const entry = rows.get(key) ?? {
        name: g.assignedToId
          ? (names.get(g.assignedToId) ?? "Tài khoản đã xóa")
          : "Chưa giao",
        total: 0,
        submitted: 0,
        visaApproved: 0,
      };
      entry.total += g._count._all;
      if (g.status === "submitted" || g.status === "visa_approved") {
        entry.submitted += g._count._all;
      }
      if (g.status === "visa_approved") entry.visaApproved += g._count._all;
      rows.set(key, entry);
    }

    return [...rows.entries()]
      .map(([id, r]) => ({
        id,
        ...r,
        visaRate: rate(r.visaApproved, r.submitted),
        applicationRate: rate(r.submitted, r.total),
      }))
      .sort((a, b) => b.total - a.total);
  },

  /** Hiệu quả kênh marketing theo utm_source (SRS mục 13 bước 3) */
  async bySource(range: DateRange = {}) {
    const grouped = await prisma.lead.groupBy({
      by: ["utmSource", "status"],
      where: whereRange(range),
      _count: { _all: true },
    });

    const rows = new Map<
      string,
      { source: string; total: number; visaApproved: number }
    >();
    for (const g of grouped) {
      const key = g.utmSource || "direct";
      const entry = rows.get(key) ?? {
        source: key === "direct" ? "Trực tiếp / không gắn UTM" : key,
        total: 0,
        visaApproved: 0,
      };
      entry.total += g._count._all;
      if (g.status === "visa_approved") entry.visaApproved += g._count._all;
      rows.set(key, entry);
    }

    return [...rows.values()]
      .map((r) => ({ ...r, visaRate: rate(r.visaApproved, r.total) }))
      .sort((a, b) => b.total - a.total);
  },

  /** Phân bổ theo quốc gia mong muốn */
  async byCountry(range: DateRange = {}) {
    const [grouped, countries] = await Promise.all([
      prisma.lead.groupBy({
        by: ["desiredCountry"],
        where: whereRange(range),
        _count: { _all: true },
      }),
      prisma.country.findMany({ select: { slug: true, name: true } }),
    ]);
    const names = new Map(countries.map((c) => [c.slug, c.name]));

    return grouped
      .map((g) => ({
        slug: g.desiredCountry,
        label: g.desiredCountry
          ? (names.get(g.desiredCountry) ?? g.desiredCountry)
          : "Chưa xác định",
        count: g._count._all,
      }))
      .sort((a, b) => b.count - a.count);
  },

  /**
   * Lead theo ngày trong N ngày gần nhất. Gom theo ngày ở tầng ứng dụng
   * (theo giờ địa phương) để khớp với cách tính "Hôm nay" ở dashboard.
   */
  async leadsByDay(days: number) {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - (days - 1));

    const rows = await prisma.lead.findMany({
      where: { createdAt: { gte: from } },
      select: { createdAt: true },
    });

    const localKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const counts = new Map<string, number>();
    for (const row of rows) {
      const key = localKey(row.createdAt);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from({ length: days }, (_, i) => {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      return {
        key: localKey(d),
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        count: counts.get(localKey(d)) ?? 0,
      };
    });
  },

  /** Card tổng quan cho dashboard */
  async summary() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, today, month, conversion, upcomingAppointments, pendingDocuments] =
      await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
        this.conversion(),
        prisma.appointment.count({
          where: { status: "scheduled", scheduledAt: { gte: new Date() } },
        }),
        prisma.leadDocument.count({
          where: { status: { in: ["pending", "rejected"] } },
        }),
      ]);

    return {
      total,
      today,
      month,
      visaRate: conversion.visaRate,
      upcomingAppointments,
      pendingDocuments,
    };
  },
};
