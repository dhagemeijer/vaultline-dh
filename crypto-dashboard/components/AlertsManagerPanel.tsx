"use client";

import { useState } from "react";
import { holdings } from "@/lib/portfolio";
import { AlertChannel, AlertDirection, AlertThresholdType, PriceAlert } from "@/lib/types";
import { usePushNotifications } from "@/lib/use-push-notifications";

interface Props {
  open: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  onChange: () => void;
}

interface FormState {
  symbol: string;
  thresholdType: AlertThresholdType;
  thresholdValue: string;
  direction: AlertDirection;
  channel: AlertChannel;
}

const emptyForm: FormState = {
  symbol: holdings[0]?.symbol ?? "BTC",
  thresholdType: "amount",
  thresholdValue: "",
  direction: "above",
  channel: "dashboard",
};

export default function AlertsManagerPanel({ open, onClose, alerts, onChange }: Props) {
  const { status: pushStatus, subscribe } = usePushNotifications();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const startCreate = () => {
    setForm(emptyForm);
    setCreating(true);
    setEditingId(null);
  };

  const startEdit = (alert: PriceAlert) => {
    setForm({
      symbol: alert.symbol,
      thresholdType: alert.thresholdType,
      thresholdValue: String(alert.thresholdValue),
      direction: alert.direction,
      channel: alert.channel,
    });
    setEditingId(alert.id);
    setCreating(false);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(form.thresholdValue);
    if (Number.isNaN(value)) return;

    if ((form.channel === "push" || form.channel === "both") && pushStatus !== "subscribed") {
      await subscribe();
    }

    setSubmitting(true);
    if (editingId) {
      await fetch("/api/alerts/list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          symbol: form.symbol,
          thresholdType: form.thresholdType,
          thresholdValue: value,
          direction: form.direction,
          channel: form.channel,
        }),
      });
    } else {
      await fetch("/api/alerts/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: form.symbol,
          thresholdType: form.thresholdType,
          thresholdValue: value,
          direction: form.direction,
          channel: form.channel,
        }),
      });
    }
    setSubmitting(false);
    cancelForm();
    onChange();
  };

  const remove = async (id: string) => {
    await fetch(`/api/alerts/list?id=${id}`, { method: "DELETE" });
    onChange();
  };

  const toggleActive = async (alert: PriceAlert) => {
    await fetch("/api/alerts/list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: alert.id, active: !alert.active }),
    });
    onChange();
  };

  const showForm = creating || editingId !== null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto bg-ink px-5 py-6 shadow-lg sm:max-w-[33vw] sm:min-w-[340px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg italic text-parchment">Alerts</h2>
          <button onClick={onClose} aria-label="Sluiten" className="text-parchment/50 hover:text-parchment">
            ✕
          </button>
        </div>

        {!showForm && (
          <button
            onClick={startCreate}
            className="mb-4 rounded-xl border border-hairline px-3.5 py-2.5 text-left font-mono text-xs text-parchment/70 hover:bg-panel2"
          >
            + Nieuwe alert
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-5 rounded-2xl border border-hairline bg-panel p-4">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block font-mono text-xs text-parchment/50">Coin</label>
                <select
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                  className="w-full rounded-lg border border-hairline bg-ink px-2 py-1.5 text-sm text-parchment"
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
                  value={form.thresholdType}
                  onChange={(e) => setForm({ ...form, thresholdType: e.target.value as AlertThresholdType })}
                  className="w-full rounded-lg border border-hairline bg-ink px-2 py-1.5 text-sm text-parchment"
                >
                  <option value="amount">Bedrag (€)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-parchment/50">Richting</label>
                <select
                  value={form.direction}
                  onChange={(e) => setForm({ ...form, direction: e.target.value as AlertDirection })}
                  className="w-full rounded-lg border border-hairline bg-ink px-2 py-1.5 text-sm text-parchment"
                >
                  <option value="above">Boven</option>
                  <option value="below">Onder</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-parchment/50">Waarde</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={form.thresholdValue}
                  onChange={(e) => setForm({ ...form, thresholdValue: e.target.value })}
                  className="w-full rounded-lg border border-hairline bg-ink px-2 py-1.5 text-sm text-parchment"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="mb-1 block font-mono text-xs text-parchment/50">Melding via</label>
              <div className="flex gap-1.5">
                {(["dashboard", "push", "both"] as AlertChannel[]).map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm({ ...form, channel: c })}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-xs ${
                      form.channel === c
                        ? "border-parchment bg-parchment text-ink"
                        : "border-hairline text-parchment/60"
                    }`}
                  >
                    {c === "dashboard" ? "Dashboard" : c === "push" ? "Push" : "Beide"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-parchment px-3 py-2 font-mono text-xs font-medium text-ink disabled:opacity-50"
              >
                {submitting ? "Bezig…" : editingId ? "Opslaan" : "Aanmaken"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg border border-hairline px-3 py-2 font-mono text-xs text-parchment/60"
              >
                Annuleer
              </button>
            </div>
          </form>
        )}

        {alerts.length === 0 && !showForm ? (
          <p className="text-sm text-parchment/50">Nog geen alerts ingesteld.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-hairline bg-panel p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-display text-sm">
                    {alert.symbol} {alert.direction === "above" ? "boven" : "onder"}{" "}
                    {alert.thresholdType === "amount"
                      ? `€${alert.thresholdValue.toLocaleString("nl-NL")}`
                      : `${alert.thresholdValue >= 0 ? "+" : ""}${alert.thresholdValue}%`}
                  </p>
                  {!alert.active && <span className="font-mono text-xs text-parchment/40">gepauzeerd</span>}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => startEdit(alert)}
                    className="flex-1 rounded-lg border border-hairline px-2 py-1 font-mono text-xs text-parchment/70 hover:bg-panel2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(alert)}
                    className="flex-1 rounded-lg border border-hairline px-2 py-1 font-mono text-xs text-parchment/70 hover:bg-panel2"
                  >
                    {alert.active ? "Pauzeer" : "Hervat"}
                  </button>
                  <button
                    onClick={() => remove(alert.id)}
                    className="rounded-lg border border-hairline px-2 py-1 font-mono text-xs text-risky hover:bg-panel2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
