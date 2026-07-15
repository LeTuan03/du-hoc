import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { leadService } from "@/server/services/leadService";
import { getSession } from "@/server/auth";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/server/types";

const patchSchema = z.object({
  action: z.enum(["change_status", "add_note"]),
  status: z
    .enum(Object.keys(LEAD_STATUS_LABELS) as [LeadStatus, ...LeadStatus[]])
    .optional(),
  note: z.string().trim().max(2000).optional(),
});

/** GET /api/v1/leads/:id — admin */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const lead = await leadService.getById(id);
  if (!lead) {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy lead" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: lead });
}

/** PATCH /api/v1/leads/:id — đổi trạng thái (theo state machine) hoặc thêm ghi chú */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  }

  const { action, status, note } = parsed.data;

  if (action === "change_status") {
    if (!status) {
      return NextResponse.json(
        { success: false, message: "Thiếu trạng thái mới" },
        { status: 400 },
      );
    }
    const result = await leadService.changeStatus(id, status, note || "");
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 409 },
      );
    }
    return NextResponse.json({ success: true, data: result.lead });
  }

  // add_note
  if (!note) {
    return NextResponse.json(
      { success: false, message: "Nội dung ghi chú không được để trống" },
      { status: 400 },
    );
  }
  const lead = await leadService.addNote(id, note);
  if (!lead) {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy lead" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: lead });
}
