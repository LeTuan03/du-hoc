"use client";

import Link from "next/link";
import { Button, Table } from "antd";
import { ExternalLink, Pencil, Star } from "lucide-react";
import type { University } from "@/server/types";
import { deleteUniversity } from "@/server/actions/universityActions";
import { DeleteButton } from "../DeleteButton";
import { formatTuitionRange } from "@/lib/format";

export function UniversitiesTable({
  universities,
  countryNames,
}: {
  universities: University[];
  countryNames: Record<string, string>;
}) {
  return (
    <Table<University>
      rowKey="id"
      dataSource={universities}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: 800 }}
      columns={[
        {
          title: "Trường",
          dataIndex: "name",
          render: (_, u) => (
            <>
              <Link
                href={`/admin/universities/${u.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {u.name}
              </Link>
              <p className="text-xs text-slate-400">{u.city}</p>
            </>
          ),
        },
        {
          title: "Quốc gia",
          dataIndex: "countrySlug",
          width: 130,
          render: (slug: string) => countryNames[slug] ?? slug,
        },
        {
          title: "Học phí/năm",
          width: 170,
          render: (_, u) => formatTuitionRange(u.tuitionMin, u.tuitionMax),
        },
        {
          title: "Xếp hạng",
          dataIndex: "ranking",
          width: 100,
          render: (r: number | null) => (r ? `#${r}` : "—"),
        },
        {
          title: "Nổi bật",
          dataIndex: "isFeatured",
          width: 90,
          render: (v: boolean) =>
            v ? <Star size={15} className="fill-amber-400 text-amber-400" /> : "—",
        },
        {
          title: "",
          width: 210,
          render: (_, u) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/truong/${u.slug}`} target="_blank">
                <Button size="small" icon={<ExternalLink size={13} />}>
                  Xem
                </Button>
              </Link>
              <Link href={`/admin/universities/${u.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteUniversity.bind(null, u.id)}
                confirmMessage={`Xóa trường "${u.name}"?`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
