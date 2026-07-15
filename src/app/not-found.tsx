import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-[#1e4fa3]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Không tìm thấy trang
        </h1>
        <p className="mt-2 text-slate-600">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-[#1e4fa3] px-6 py-3 font-bold text-white transition hover:bg-[#123a7a]"
          >
            Về trang chủ
          </Link>
          <Link
            href="/dang-ky-tu-van"
            className="rounded-lg border-2 border-[#1e4fa3] px-6 py-3 font-bold text-[#1e4fa3] transition hover:bg-[#e8f0fc]"
          >
            Đăng ký tư vấn
          </Link>
        </div>
      </div>
    </div>
  );
}
