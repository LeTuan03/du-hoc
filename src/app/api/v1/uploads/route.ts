import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/server/auth";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/server/supabase";

/**
 * POST /api/v1/uploads — admin only.
 * Ưu tiên upload lên Supabase Storage (DB lưu URL public của ảnh);
 * khi chưa cấu hình Supabase env → fallback lưu public/uploads/ như cũ.
 * Field "upload" theo chuẩn CKEditor SimpleUploadAdapter; response { url }.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Không nhận SVG: SVG chứa được <script>/onload → stored XSS khi serve inline.
// PDF phục vụ tài liệu hồ sơ du học (học bạ, hộ chiếu, chứng minh tài chính).
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: { message: "Chưa đăng nhập" } },
      { status: 401 },
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("upload");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: { message: "Thiếu file upload" } },
      { status: 400 },
    );
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: { message: "Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF hoặc file PDF" } },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: { message: "File tối đa 5MB" } },
      { status: 400 },
    );
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
      });
    if (error) {
      console.error("Supabase Storage upload error:", error);
      return NextResponse.json(
        { error: { message: "Tải ảnh lên storage thất bại" } },
        { status: 500 },
      );
    }
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  }

  // Serverless (Vercel/Netlify) có filesystem read-only → báo thiếu cấu hình
  // thay vì lỗi ghi file khó hiểu.
  if (process.env.VERCEL || process.env.NETLIFY) {
    return NextResponse.json(
      {
        error: {
          message:
            "Chưa cấu hình Supabase Storage (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
        },
      },
      { status: 500 },
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
