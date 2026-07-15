"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Select, Table } from "antd";
import { Eye } from "lucide-react";
import { LEAD_STATUS_LABELS, type Lead } from "@/server/types";
import { StatusBadge } from "../StatusBadge";
import { formatDateTime } from "@/lib/format";

/** Bảng leads — lọc server-side qua query string (giữ URL chia sẻ được) */
export function LeadsTable({
  leads,
  countries,
}: {
  leads: Lead[];
  countries: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`/admin/leads?${params.toString()}`);
  }

  const countryName = (slug: string | null | undefined) =>
    slug ? (countries.find((c) => c.slug === slug)?.name ?? "—") : "—";

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <Input.Search
          allowClear
          placeholder="Tên, email, SĐT..."
          defaultValue={searchParams.get("tim") ?? ""}
          onSearch={(v) => updateQuery({ tim: v || undefined })}
          style={{ maxWidth: 260 }}
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          value={searchParams.get("trang_thai") || undefined}
          onChange={(v) => updateQuery({ trang_thai: v })}
          options={Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          style={{ minWidth: 170 }}
        />
        <Select
          allowClear
          placeholder="Quốc gia"
          value={searchParams.get("quoc_gia") || undefined}
          onChange={(v) => updateQuery({ quoc_gia: v })}
          options={countries.map((c) => ({ value: c.slug, label: c.name }))}
          style={{ minWidth: 160 }}
        />
      </div>

      <Table<Lead>
        rowKey="id"
        dataSource={leads}
        pagination={{ pageSize: 15, hideOnSinglePage: true }}
        scroll={{ x: 860 }}
        columns={[
          {
            title: "Họ tên",
            dataIndex: "fullName",
            render: (_, lead) => (
              <>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
                >
                  {lead.fullName}
                </Link>
                <p className="text-xs text-slate-400">{lead.city}</p>
              </>
            ),
          },
          {
            title: "Liên hệ",
            width: 200,
            render: (_, lead) => (
              <>
                <p>{lead.phone}</p>
                <p className="text-xs text-slate-400">{lead.email}</p>
              </>
            ),
          },
          {
            title: "Quốc gia",
            width: 120,
            render: (_, lead) => countryName(lead.desiredCountry),
          },
          {
            title: "Trạng thái",
            width: 140,
            render: (_, lead) => <StatusBadge status={lead.status} />,
          },
          {
            title: "Ngày đăng ký",
            dataIndex: "createdAt",
            width: 150,
            render: (d: string) => (
              <span className="text-xs text-slate-500">{formatDateTime(d)}</span>
            ),
          },
          {
            title: "",
            width: 90,
            render: (_, lead) => (
              <Link href={`/admin/leads/${lead.id}`}>
                <Button size="small" type="primary" ghost icon={<Eye size={13} />}>
                  Xem
                </Button>
              </Link>
            ),
          },
        ]}
      />
    </>
  );
}
