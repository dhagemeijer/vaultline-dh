"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { holdings } from "@/lib/portfolio";
import { AlertChannel, AlertDirection, AlertThresholdType, PriceAlert } from "@/lib/types";
import { usePushNotifications } from "@/lib/use-push-notifications";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { status: pushStatus, subscribe } = usePushNotifications();

  const [symbol, setSymbol] = useState(holdings[0]?.symbol ?? "BTC");
  const [thresholdType, setThresholdType] = useState<AlertThresholdType>("amount");
  const [thresholdValue, setThresholdValue] = useState("");
  const [direction, setDirection] = useState<AlertDirection>("above");
  const [channel, setChannel] = useState<AlertChannel>("dashboard");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const res = await fetch("/api/alerts/list", { cache: "no-store" });
    const data = await res.json();
    setAlerts(data.alerts ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(thresholdValue);
    if (Number.isNaN(value)) return;

    if ((channel === "push" || channel === "both") && pushStatus !== "subscribed") {
      await subscribe();
    }

    setSubmitting(true);
    await fetch("/api/alerts/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, thresholdType, thresholdValue: value, direction, channel }),
    });
    setThresholdValue("");
    await load();
    setSubmitting(false);
  };

  const toggleActive = async (alert: PriceAlert) => {
    await fetch("/api/alerts/list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: alert.id, active: !alert.active }),
    });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/alerts/list?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-parchment/40">Vaultline</p>
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-2xl italic text-parchment">Prijs-alerts</h1>
          <Link href="/" className="font-mono text-xs text-parchment/50 hover:text-parchment">
            ← dashboard
          </Link>
        </div>
      </header>

      {pushStatus === "denied" && (
        <div className="mb-6 rounded-xl border border-risky/40 bg-risky/10 px-4 py-3 text-sm text-risky">
          Meldingen zijn geblokkeerd in je browser. Zet ze aan bij de site-instellingen om push-alerts te ontvangen.
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-10 rounded-2xl border border-hairline bg-panel p-5">
        <h2 className="mb-4 font-display text-lg text-parchment/90">Nieuwe alert</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="mb-1 block font-mono text-xs text-parchment/50">Coin</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-ink px-2.5 py-2 text-sm text-parchment"
            >
              {holdings.map((h) => (
                <option key={h.symbol} value={h.symbol}>
                  {h.symbol}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-parchment/50">Type</label>
            <select
              value={thresholdType}
              onChange={(e) => setThresholdType(e.target.value as AlertThresholdType)}
              className="w-full rounded-lg border border-hairline bg-ink px-2.5 py-2 text-sm text-parchment"
            >
              <option value="amount">Bedrag (€)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-parchment/50">Richting</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as AlertDirection)}
              className="w-full rounded-lg border border-hairline bg-ink px-2.5 py-2 text-sm text-parchment"
            >
              <option value="above">Boven</option>
              <option value="below">Onder</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-parchment/50">
              Waarde {thresholdType === "percentage" ? "(%)" : "(€)"}
            </label>
            <input
              type="number"
              step="any"
              value={thresholdValue}
              onChange={(e) => setThresholdValue(e.target.value)}
              required
              placeholder={thresholdType === "percentage" ? "10" : "65000"}
              className="w-full rounded-lg border border-hairline bg-ink px-2.5 py-2 text-sm text-parchment"
            />
          </div>
          <div className="col-span-2 sm:col-span-4">
            <label className="mb-1 block font-mono text-xs text-parchment/50">Melding via</label>
            <div className="flex gap-2">
              {(["dashboard", "push", "both"] as AlertChannel[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
                    channel === c
                      ? "border-parchment bg-parchment text-ink"
                      : "border-hairline text-parchment/60 hover:bg-panel2"
                  }`}
                >
                  {c === "dashboard" ? "Dashboard" : c === "push" ? "Push" : "Beide"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-xl bg-parchment px-4 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Bezig…" : "Alert aanmaken"}
        </button>
      </form>

      <h2 className="mb-4 font-display text-lg text-parchment/90">Actieve en gepauzeerde alerts</h2>
      {loading ? (
        <p className="text-sm text-parchment/50">Laden…</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-parchment/50">Nog geen alerts ingesteld.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-2xl border border-hairline bg-panel p-4"
            >
              <div>
                <p className="font-display text-sm">
                  {alert.symbol} {alert.direction === "above" ? "boven" : "onder"}{" "}
                  {alert.thresholdType === "amount"
                    ? `€${alert.thresholdValue.toLocaleString("nl-NL")}`
                    : `${alert.thresholdValue >= 0 ? "+" : ""}${alert.thresholdValue}%`}
                </p>
                <p className="font-mono text-xs text-parchment/50">
                  {alert.channel === "dashboard" ? "Dashboard" : alert.channel === "push" ? "Push" : "Dashboard + push"}
                  {alert.thresholdType === "percentage" && ` · referentie €${alert.referencePrice.toLocaleString("nl-NL")}`}
                  {!alert.active && " · gepauzeerd"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(alert)}
                  className="rounded-lg border border-hairline px-3 py-1.5 font-mono text-xs text-parchment/70 hover:bg-panel2"
                >
                  {alert.active ? "Pauzeer" : "Hervat"}
                </button>
                <button
                  onClick={() => remove(alert.id)}
                  className="rounded-lg border border-hairline px-3 py-1.5 font-mono text-xs text-risky hover:bg-panel2"
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
