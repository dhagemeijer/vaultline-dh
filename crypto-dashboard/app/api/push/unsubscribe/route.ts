import { NextResponse } from "next/server";
import { removePushSubscription } from "@/lib/alerts-store";

export async function POST(req: Request) {
  const { endpoint } = await req.json();
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint is verplicht." }, { status: 400 });
  }
  await removePushSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
