"use client";

import Link from "next/link";
import { Button, Table } from "antd";
import { Pencil } from "lucide-react";
import type { Testimonial } from "@/server/types";
import { deleteTestimonial } from "@/server/actions/testimonialActions";
import { DeleteButton } from "../DeleteButton";

export function TestimonialsTable({
  testimonials,
  countryNames,
}: {
  testimonials: Testimonial[];
  countryNames: Record<string, string>;
}) {
  return (
    <Table<Testimonial>
      rowKey="id"
      dataSource={testimonials}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: 700 }}
      columns={[
        {
          title: "Học viên",
          dataIndex: "studentName",
          render: (_, t) => (
            <>
              <Link
                href={`/admin/testimonials/${t.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {t.studentName}
              </Link>
              <p className="max-w-[280px] truncate text-xs text-slate-400">
                {t.content}
              </p>
            </>
          ),
        },
        { title: "Trường", dataIndex: "universityName", width: 220 },
        {
          title: "Quốc gia",
          dataIndex: "countrySlug",
          width: 120,
          render: (slug: string) => countryNames[slug] ?? slug,
        },
        { title: "Năm", dataIndex: "year", width: 80 },
        {
          title: "",
          width: 150,
          render: (_, t) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/testimonials/${t.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteTestimonial.bind(null, t.id)}
                confirmMessage={`Xóa chia sẻ của "${t.studentName}"?`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
