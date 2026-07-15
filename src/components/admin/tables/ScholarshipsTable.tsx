"use client";

import Link from "next/link";
import { Button, Table, Tag } from "antd";
import { ExternalLink, Pencil } from "lucide-react";
import type { Scholarship } from "@/server/types";
import { deleteScholarship } from "@/server/actions/scholarshipActions";
import { DeleteButton } from "../DeleteButton";
import { daysUntil, formatDate } from "@/lib/format";

export function ScholarshipsTable({
  scholarships,
  countryNames,
}: {
  scholarships: Scholarship[];
  countryNames: Record<string, string>;
}) {
  return (
    <Table<Scholarship>
      rowKey="id"
      dataSource={scholarships}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: 800 }}
      columns={[
        {
          title: "Học bổng",
          dataIndex: "name",
          render: (_, s) => (
            <>
              <Link
                href={`/admin/scholarships/${s.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {s.name}
              </Link>
              <p className="max-w-[280px] truncate text-xs text-slate-400">
                {s.value}
              </p>
            </>
          ),
        },
        {
          title: "Quốc gia",
          dataIndex: "countrySlug",
          width: 120,
          render: (slug: string | null) =>
            slug ? (countryNames[slug] ?? slug) : "—",
        },
        {
          title: "Deadline",
          dataIndex: "deadline",
          width: 190,
          render: (d: string) => {
            const remaining = daysUntil(d);
            return (
              <>
                {formatDate(d)}{" "}
                <span
                  className={`text-xs font-bold ${remaining <= 30 ? "text-red-600" : "text-emerald-600"}`}
                >
                  {remaining > 0 ? `còn ${remaining} ngày` : "hết hạn"}
                </span>
              </>
            );
          },
        },
        {
          title: "Trạng thái",
          dataIndex: "isActive",
          width: 110,
          render: (v: boolean) =>
            v ? <Tag color="green">Đang mở</Tag> : <Tag>Đã ẩn</Tag>,
        },
        {
          title: "",
          width: 210,
          render: (_, s) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/hoc-bong/${s.slug}`} target="_blank">
                <Button size="small" icon={<ExternalLink size={13} />}>
                  Xem
                </Button>
              </Link>
              <Link href={`/admin/scholarships/${s.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteScholarship.bind(null, s.id)}
                confirmMessage={`Xóa học bổng "${s.name}"?`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
