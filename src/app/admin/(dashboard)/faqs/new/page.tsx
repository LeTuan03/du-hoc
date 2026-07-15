import Link from "next/link";
import { FaqForm } from "@/components/admin/FaqForm";

export const dynamic = "force-dynamic";

export default function NewFaqPage() {
  return (
    <div className="mx-auto">
      <Link
        href="/admin/faqs"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách FAQ
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Thêm câu hỏi mới
      </h1>
      <div className="mt-6">
        <FaqForm />
      </div>
    </div>
  );
}
