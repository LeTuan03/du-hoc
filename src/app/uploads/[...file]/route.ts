import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Serve ảnh trong public/uploads được thêm SAU khi build —
 * `next start` chỉ serve file public/ có sẵn lúc build, nên ảnh
 * admin upload lúc runtime cần route này. Khi deploy VPS có thể
 * để Nginx serve trực tiếp /uploads (route này chỉ là fallback).
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Không serve SVG: SVG chứa được script → stored XSS trên origin của site
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file } = await params;
  const filePath = path.normalize(path.join(UPLOAD_DIR, ...file));

  // Chống path traversal — chỉ cho phép file nằm TRONG UPLOAD_DIR
  // (so sánh kèm path.sep để "public/uploads-khac" không lọt qua prefix check)
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
