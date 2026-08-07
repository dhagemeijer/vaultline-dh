"use client";

import { useEffect, useState } from "react";
import { AlertNotification } from "@/lib/types";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } catch {
      // stil falen — badge blijft dan op de laatst bekende stand
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, status: "snoozed" | "dismissed") => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      // bij falen: volgende poll herstelt de echte staat
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Meldingen${notifications.length > 0 ? ` (${notifications.length} ongelezen)` : ""}`}
        className="relative rounded-full p-2 text-parchment/70 hover:bg-parchment/5 hover:text-parchment"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-risky px-1 font-mono text-[10px] text-parchment">
            {notifications.length}
          </span>
        )}
      </button>

      <NotificationPanel
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        onAction={handleAction}
      />
    </>
  );
}
