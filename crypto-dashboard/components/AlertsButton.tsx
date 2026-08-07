"use client";

import { useEffect, useState } from "react";
import { PriceAlert } from "@/lib/types";
import AlertsManagerPanel from "./AlertsManagerPanel";

export default function AlertsButton() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/alerts/list", { cache: "no-store" });
      const data = await res.json();
      setAlerts(data.alerts ?? []);
    } catch {
      // stil falen
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeCount = alerts.filter((a) => a.active).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Alerts beheren${activeCount > 0 ? ` (${activeCount} actief)` : ""}`}
        className="relative rounded-full p-2 text-ink/70 hover:bg-ink/5 hover:text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 2a10 10 0 1 0 10 10" />
          <path d="M12 2v10l7-7" />
        </svg>
        {activeCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ink px-1 font-mono text-[10px] text-parchment">
            {activeCount}
          </span>
        )}
      </button>

      <AlertsManagerPanel open={open} onClose={() => setOpen(false)} alerts={alerts} onChange={load} />
    </>
  );
}
