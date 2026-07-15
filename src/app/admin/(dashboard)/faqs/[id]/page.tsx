import Link from "next/link";
import { notFound } from "next/navigation";
import { faqRepository } from "@/server/repositories/faqRepository";
import { FaqForm } from "@/components/admin/FaqForm";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await faqRepository.findById(id);
  if (!faq) notFound();

  return (
    <div className="mx-auto">
      <Link
        href="/admin/faqs"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách FAQ
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Sửa câu hỏi
      </h1>
      <div className="mt-6">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}
