"use client";

import Link from "next/link";
import { Button, Table } from "antd";
import { ExternalLink, Pencil } from "lucide-react";
import type { Country } from "@/server/types";
import { deleteCountry } from "@/server/actions/countryActions";
import { DeleteButton } from "../DeleteButton";
import { Flag } from "@/components/public/Flag";

export function CountriesTable({ countries }: { countries: Country[] }) {
  return (
    <Table<Country>
      rowKey="id"
      dataSource={countries}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: 700 }}
      columns={[
        {
          title: "Quốc gia",
          dataIndex: "name",
          render: (_, c) => (
            <>
              <Link
                href={`/admin/countries/${c.id}`}
                className="flex items-center gap-2 font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                <Flag country={c.slug} className="h-3.5 w-[21px] rounded-[2px]" />
                {c.name}
              </Link>
              <p className="text-xs text-slate-400">/quoc-gia/{c.slug}</p>
            </>
          ),
        },
        { title: "Học phí TB", dataIndex: "avgTuition", width: 220 },
        { title: "Tỷ lệ visa", dataIndex: "visaRate", width: 100 },
        { title: "Thứ tự", dataIndex: "displayOrder", width: 90 },
        {
          title: "",
          width: 210,
          render: (_, c) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/quoc-gia/${c.slug}`} target="_blank">
                <Button size="small" icon={<ExternalLink size={13} />}>
                  Xem
                </Button>
              </Link>
              <Link href={`/admin/countries/${c.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteCountry.bind(null, c.id)}
                confirmMessage={`Xóa quốc gia "${c.name}"? Trường/học bổng đang gắn với quốc gia này sẽ không hiển thị tên quốc gia.`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
