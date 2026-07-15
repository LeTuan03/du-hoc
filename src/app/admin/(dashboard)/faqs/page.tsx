import Link from "next/link";
import { faqRepository } from "@/server/repositories/faqRepository";
import { FaqsTable } from "@/components/admin/tables/FaqsTable";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await faqRepository.findAll();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý FAQ
          </h1>
          <p className="mt-1 text-sm text-slate-500">{faqs.length} câu hỏi</p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          + Thêm câu hỏi
        </Link>
      </div>
      <FaqsTable faqs={faqs} />
    </div>
  );
}
