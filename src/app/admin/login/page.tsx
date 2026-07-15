"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(json.message || "Đăng nhập thất bại");
      }
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#1e4fa3] text-2xl font-extrabold text-white">
            G
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            GlobalEdu Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Đăng nhập để quản lý leads và nội dung
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-lg"
        >
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@duhoc.edu.vn"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1e4fa3] focus:outline-none focus:ring-2 focus:ring-[#1e4fa3]/20"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Mật khẩu
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1e4fa3] focus:outline-none focus:ring-2 focus:ring-[#1e4fa3]/20"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1e4fa3] px-4 py-3 font-bold text-white transition hover:bg-[#123a7a] disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p className="text-center text-xs text-slate-400">
            Mặc định (dev): admin@duhoc.edu.vn / Admin@123456
          </p>
        </form>
      </div>
    </div>
  );
}
