import Link from "next/link";
import { PriceAlert } from "@/lib/types";

interface Props {
  alerts: PriceAlert[];
}

export default function AlertsPanel({ alerts }: Props) {
  const activeCount = alerts.filter((a) => a.active).length;

  return (
    <div className="rounded-2xl border border-hairline bg-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-parchment/90">Prijs-alerts</h2>
        <Link href="/alerts" className="font-mono text-xs text-parchment/50 underline hover:text-parchment/80">
          beheren
        </Link>
      </div>
      {activeCount === 0 ? (
        <p className="text-sm text-parchment/50">
          Nog geen alerts ingesteld. <Link href="/alerts" className="underline">Stel er een in</Link>.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts
            .filter((a) => a.active)
            .slice(0, 4)
            .map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-parchment/70">
                  {a.symbol} {a.direction === "above" ? "boven" : "onder"}{" "}
                  {a.thresholdType === "amount"
                    ? `€${a.thresholdValue.toLocaleString("nl-NL")}`
                    : `${a.thresholdValue >= 0 ? "+" : ""}${a.thresholdValue}%`}
                </span>
              </div>
            ))}
          {activeCount > 4 && (
            <p className="font-mono text-xs text-parchment/40">+{activeCount - 4} meer</p>
          )}
        </div>
      )}
      <p className="mt-4 font-mono text-xs text-parchment/40">
        Alerts blijven actief en kunnen herhaaldelijk afgaan — meldingen komen binnen via de belknop bovenaan.
      </p>
    </div>
  );
}
