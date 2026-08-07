"use client";

import Link from "next/link";
import { AlertNotification } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: AlertNotification[];
  onAction: (id: string, status: "snoozed" | "dismissed") => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

export default function NotificationPanel({ open, onClose, notifications, onAction }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-ink px-5 py-6 shadow-lg sm:max-w-[33vw] sm:min-w-[320px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg italic text-parchment">Meldingen</h2>
          <button onClick={onClose} aria-label="Sluiten" className="text-parchment/50 hover:text-parchment">
            ✕
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-parchment/50">Geen nieuwe meldingen.</p>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="rounded-2xl border border-hairline bg-panel p-3.5">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <span className="font-display text-sm">{n.message}</span>
                  <span className="shrink-0 font-mono text-xs text-parchment/40">{formatTime(n.triggeredAt)}</span>
                </div>
                <p className="mb-3 font-mono text-xs text-parchment/50">
                  Prijs bij trigger: €{n.priceAtTrigger.toLocaleString("nl-NL")}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/#coin-${n.symbol}`}
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-hairline px-2.5 py-1.5 text-center font-mono text-xs text-parchment/80 hover:bg-panel2"
                  >
                    Naar {n.symbol}
                  </Link>
                  <button
                    onClick={() => onAction(n.id, "snoozed")}
                    className="flex-1 rounded-lg border border-hairline px-2.5 py-1.5 font-mono text-xs text-parchment/60 hover:bg-panel2"
                  >
                    Snooze
                  </button>
                  <button
                    onClick={() => onAction(n.id, "dismissed")}
                    aria-label="Sluiten"
                    className="rounded-lg border border-hairline px-2.5 py-1.5 font-mono text-xs text-parchment/60 hover:bg-panel2"
                  >
                    ✕
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
