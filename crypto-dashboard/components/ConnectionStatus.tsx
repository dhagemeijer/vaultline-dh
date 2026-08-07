"use client";

import { useEffect, useState } from "react";

type Status = "connecting" | "connected" | "disconnected";

const STATUS_COLOR: Record<Status, string> = {
  connecting: "#C7973D",
  connected: "#4CAF7D",
  disconnected: "#C23B3B",
};

const STATUS_LABEL: Record<Status, string> = {
  connecting: "Connecting",
  connected: "Connected",
  disconnected: "Disconnected",
};

export default function ConnectionStatus() {
  const [status, setStatus] = useState<Status>("connecting");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setStatus((s) => (s === "disconnected" ? "connecting" : s));
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setStatus(data.connected ? "connected" : "disconnected");
      } catch {
        if (!cancelled) setStatus("disconnected");
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <span
      title={STATUS_LABEL[status]}
      className="inline-flex items-center gap-1.5 cursor-default"
      aria-label={`Bitvavo verbinding: ${STATUS_LABEL[status]}`}
    >
      <span
        className="h-2 w-2 rounded-full transition-colors duration-300"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
    </span>
  );
}
