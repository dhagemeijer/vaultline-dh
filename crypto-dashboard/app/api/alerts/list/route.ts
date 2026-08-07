import { NextResponse } from "next/server";
import { createAlert, deleteAlert, getAlerts, updateAlert } from "@/lib/alerts-store";
import { fetchPrices } from "@/lib/bitvavo";
import { AlertChannel, AlertDirection, AlertThresholdType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const alerts = await getAlerts();
  return NextResponse.json({ alerts });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { symbol, thresholdType, thresholdValue, direction, channel } = body as {
    symbol: string;
    thresholdType: AlertThresholdType;
    thresholdValue: number;
    direction: AlertDirection;
    channel: AlertChannel;
  };

  if (!symbol || !thresholdType || typeof thresholdValue !== "number" || !direction || !channel) {
    return NextResponse.json({ error: "Ontbrekende velden." }, { status: 400 });
  }

  // Referentieprijs vastleggen op het moment van instellen (voor percentage-alerts)
  const prices = await fetchPrices([symbol]);
  const referencePrice = prices[symbol]?.price ?? 0;

  const alert = await createAlert({
    symbol,
    thresholdType,
    thresholdValue,
    direction,
    channel,
    referencePrice,
  });

  return NextResponse.json({ alert });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body as { id: string } & Record<string, unknown>;

  if (!id) {
    return NextResponse.json({ error: "id is verplicht." }, { status: 400 });
  }

  await updateAlert(id, updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is verplicht." }, { status: 400 });
  }

  await deleteAlert(id);
  return NextResponse.json({ ok: true });
}
