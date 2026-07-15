import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/server/validators/lead.schema";
import { leadService } from "@/server/services/leadService";
import { checkRateLimit, getClientIp } from "@/server/middlewares/rateLimit";
import { getSession } from "@/server/auth";

/** POST /api/v1/leads — public, rate-limited (SRS mục 7.8 & 13) */
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit theo IP chống spam
    const ip = getClientIp(req);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bạn thao tác quá nhanh, vui lòng thử lại sau ${rate.retryAfterSeconds} giây`,
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    // 2. Validate server-side bằng Zod (không tin tưởng client)
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu không hợp lệ" },
        { status: 400 },
      );
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    // 3. Honeypot: bot điền field ẩn → giả vờ thành công, không lưu
    if (parsed.data.website) {
      return NextResponse.json(
        { success: true, message: "Đăng ký thành công" },
        { status: 201 },
      );
    }

    // 4. Tạo lead (service tự xử lý trùng lặp + email)
    const { lead, isDuplicate } = await leadService.create(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: isDuplicate
          ? "Bạn đã đăng ký gần đây — tư vấn viên sẽ liên hệ với bạn sớm nhất, cảm ơn bạn!"
          : "Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ làm việc.",
        data: { leadId: lead.id },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/v1/leads]", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau" },
      { status: 500 },
    );
  }
}

/** GET /api/v1/leads — admin only */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 },
    );
  }

  const { searchParams } = req.nextUrl;
  const leads = await leadService.list({
    status: searchParams.get("status") || undefined,
    country: searchParams.get("country") || undefined,
    search: searchParams.get("search") || undefined,
  });

  return NextResponse.json({
    success: true,
    data: leads,
    meta: { total: leads.length },
  });
}
