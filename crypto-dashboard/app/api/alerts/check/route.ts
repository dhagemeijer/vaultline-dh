import { NextResponse } from "next/server";
import { checkAlerts } from "@/lib/alert-checker";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: Request) {
  const secret = process.env.ALERTS_CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await checkAlerts();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("Alert check failed:", err);
    return NextResponse.json({ ok: false, error: "Check mislukt" }, { status: 500 });
  }
}
