import { Holding, PriceInfo } from "@/lib/types";
import { MarketMover } from "@/lib/bitvavo";

interface Props {
  holdings: Holding[];
  prices: Record<string, PriceInfo>;
  marketGainers: MarketMover[];
  marketLosers: MarketMover[];
}

function MoverRow({ label, change }: { label: string; change: number }) {
  const positive = change >= 0;
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-parchment/70">
        {positive ? "↑" : "↓"} {label}
      </span>
      <span className={`font-mono text-sm tabular ${positive ? "text-pos" : "text-neg"}`}>
        {positive ? "+" : ""}
        {change.toFixed(2)}%
      </span>
    </div>
  );
}

export default function TopMovers({ holdings, prices, marketGainers, marketLosers }: Props) {
  const withChange = holdings
    .map((h) => ({ ...h, change24h: prices[h.symbol]?.change24h ?? 0 }))
    .sort((a, b) => b.change24h - a.change24h);

  const best = withChange[0];
  const worst = withChange[withChange.length - 1];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-hairline bg-panel p-5">
        <h2 className="mb-4 font-display text-lg text-parchment/90">Jouw grootste bewegers</h2>
        <div className="flex flex-col gap-3">
          {best && <MoverRow label={best.name} change={best.change24h} />}
          {worst && <MoverRow label={worst.name} change={worst.change24h} />}
        </div>
      </div>

      <div className="rounded-2xl border border-hairline bg-panel p-5">
        <h2 className="mb-4 font-display text-lg text-parchment/90">Grootste bewegers · hele markt</h2>
        <div className="flex flex-col gap-3">
          {marketGainers.map((m) => (
            <MoverRow key={`g-${m.symbol}`} label={m.symbol} change={m.change24h} />
          ))}
          {marketLosers.map((m) => (
            <MoverRow key={`l-${m.symbol}`} label={m.symbol} change={m.change24h} />
          ))}
        </div>
      </div>
    </div>
  );
}
