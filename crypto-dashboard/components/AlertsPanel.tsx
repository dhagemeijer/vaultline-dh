import { Bell } from "lucide-react";
import { Alert, PriceInfo } from "@/lib/types";

interface Props {
  alerts: Alert[];
  prices: Record<string, PriceInfo>;
}

export default function AlertsPanel({ alerts, prices }: Props) {
  return (
    <div className="rounded-2xl border border-hairline bg-panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <Bell size={16} className="text-parchment/60" />
        <h2 className="font-display text-lg text-parchment/90">Meldingen</h2>
      </div>
      {alerts.length === 0 ? (
        <p className="text-sm text-parchment/50">Nog geen meldingen ingesteld.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((a) => {
            const price = prices[a.symbol]?.price;
            const label =
              a.mode === "percentage"
                ? `Waarschuw als ${a.symbol} meer dan ${a.threshold}% ${a.type === "onder" ? "daalt" : "stijgt"}`
                : `Waarschuw als ${a.symbol} ${a.type} €${a.threshold.toLocaleString("nl-NL")} komt`;
            return (
              <div key={a.id} className="flex items-center justify-between border-b border-hairline/40 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-parchment/70">{label}</span>
                <span className="font-mono text-xs text-parchment/40">
                  {price ? `nu: €${price.toLocaleString("nl-NL")}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-4 font-mono text-xs text-parchment/40">
        Alleen visuele meldingen — geen automatische verkoop (dat komt in een latere fase).
      </p>
    </div>
  );
}
