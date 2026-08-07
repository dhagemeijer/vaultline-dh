import { NextResponse } from "next/server";
import { addPushSubscription } from "@/lib/alerts-store";

export async function POST(req: Request) {
  const sub = await req.json();

  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: "Ongeldig abonnement." }, { status: 400 });
  }

  await addPushSubscription({
    endpoint: sub.endpoint,
    keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
  });

  return NextResponse.json({ ok: true });
}
