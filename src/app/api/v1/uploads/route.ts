import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/server/auth";

/**
 * POST /api/v1/uploads — admin only.
 * Lưu ảnh vào public/uploads/, DB chỉ lưu path (/uploads/xxx.ext).
 * Field "upload" theo chuẩn CKEditor SimpleUploadAdapter; response { url }.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Không nhận SVG: SVG chứa được <script>/onload → stored XSS khi serve inline
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
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
      { error: { message: "Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF" } },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: { message: "Ảnh tối đa 5MB" } },
      { status: 400 },
    );
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return NextResponse.json({ url: `/uploads/${filename}` });
}
