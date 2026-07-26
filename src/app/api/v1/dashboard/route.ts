import { NextRequest } from "next/server";
import { reportService } from "@/server/services/reportService";
import { guard, ok, withErrorHandler } from "@/server/apiResponse";

/**
 * GET /api/v1/dashboard?metric=summary|leads-by-date|leads-by-country|leads-by-status|by-consultant|by-source
 * Admin (SRS mục 7.9). Gom vào một endpoint theo tham số `metric` thay vì 4
 * route gần giống nhau — cùng phạm vi quyền, cùng bộ lọc thời gian.
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const auth = await guard("reports.view");
  if ("response" in auth) return auth.response;

  const sp = req.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");
  const range = {
    from: from ? new Date(`${from}T00:00:00`) : undefined,
    to: to ? new Date(`${to}T23:59:59`) : undefined,
  };

  switch (sp.get("metric")) {
    case "leads-by-date": {
      const days = Math.min(365, Math.max(1, Number(sp.get("days")) || 30));
      return ok(await reportService.leadsByDay(days));
    }
    case "leads-by-country":
      return ok(await reportService.byCountry(range));
    case "leads-by-status":
      return ok((await reportService.conversion(range)).funnel);
    case "by-consultant":
      return ok(await reportService.byConsultant(range));
    case "by-source":
      return ok(await reportService.bySource(range));
    case "conversion":
      return ok(await reportService.conversion(range));
    default:
      return ok(await reportService.summary());
  }
});
