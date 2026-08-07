import { NextResponse } from "next/server";
import { getNotifications, updateNotificationStatus } from "@/lib/alerts-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const notifications = await getNotifications();
  // Toon alleen ongelezen meldingen in het paneel; gesnoozede/gesloten blijven
  // in de opslag voor eventuele geschiedenis, maar niet zichtbaar.
  const visible = notifications.filter((n) => n.status === "unread");
  return NextResponse.json({ notifications: visible, unreadCount: visible.length });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, status } = body as { id: string; status: "snoozed" | "dismissed" };

  if (!id || !status) {
    return NextResponse.json({ error: "id en status zijn verplicht." }, { status: 400 });
  }

  await updateNotificationStatus(id, status);
  return NextResponse.json({ ok: true });
}
