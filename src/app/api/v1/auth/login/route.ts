import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  getAdminCredentials,
  sessionCookieOptions,
} from "@/server/auth";
import { checkRateLimit, getClientIp } from "@/server/middlewares/rateLimit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // Rate limit chống brute-force (SRS checklist bảo mật)
  const rate = checkRateLimit(`login:${getClientIp(req)}`);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Quá nhiều lần thử, vui lòng đợi ${rate.retryAfterSeconds} giây`,
      },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Email hoặc mật khẩu không đúng" },
      { status: 401 },
    );
  }

  const creds = getAdminCredentials();
  if (
    parsed.data.email.toLowerCase() !== creds.email.toLowerCase() ||
    parsed.data.password !== creds.password
  ) {
    return NextResponse.json(
      { success: false, message: "Email hoặc mật khẩu không đúng" },
      { status: 401 },
    );
  }

  const token = createSessionToken(creds.email);
  const res = NextResponse.json({
    success: true,
    data: { user: { email: creds.email, role: "Admin" } },
  });
  res.cookies.set({ ...sessionCookieOptions, value: token });
  return res;
}
