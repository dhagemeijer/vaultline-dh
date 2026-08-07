import { Holding, PriceInfo, RISK_COLORS, RISK_LABELS } from "@/lib/types";

interface Props {
  holdings: Holding[];
  prices: Record<string, PriceInfo>;
}

function formatEUR(v: number) {
  return v.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

function computeRow(h: Holding, prices: Record<string, PriceInfo>) {
  const p = prices[h.symbol];
  const price = p?.price ?? h.avgBuyPrice;
  const value = h.amount * price;
  const cost = h.amount * h.avgBuyPrice;
  const pl = value - cost;
  const plPct = cost > 0 ? (pl / cost) * 100 : 0;
  const change24h = p?.change24h ?? 0;
  return { value, pl, plPct, change24h, positive: pl >= 0 };
}

export default function HoldingsTable({ holdings, prices }: Props) {
  return (
    <>
      {/* Desktop / tablet: table */}
      <div className="hidden w-full overflow-hidden rounded-2xl border border-hairline bg-panel md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs uppercase tracking-wider text-parchment/50">
              <th className="px-5 py-3 font-body font-normal">Coin</th>
              <th className="px-5 py-3 font-body font-normal text-right">Bezit</th>
              <th className="px-5 py-3 font-body font-normal text-right">Waarde</th>
              <th className="px-5 py-3 font-body font-normal text-right">Resultaat</th>
              <th className="px-5 py-3 font-body font-normal text-right">24u</th>
              <th className="px-5 py-3 font-body font-normal">Risico</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const { value, pl, plPct, change24h, positive } = computeRow(h, prices);
              return (
                <tr key={h.symbol} className="border-b border-hairline/50 last:border-0 hover:bg-panel2/60">
                  <td className="px-5 py-4">
                    <div className="font-display text-base">{h.name}</div>
                    <div className="font-mono text-xs text-parchment/50">{h.symbol}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-mono tabular text-parchment/80">
                    {h.amount.toLocaleString("nl-NL", { maximumFractionDigits: 6 })}
                  </td>
                  <td className="px-5 py-4 text-right font-mono tabular">{formatEUR(value)}</td>
                  <td className={`px-5 py-4 text-right font-mono tabular ${positive ? "text-pos" : "text-neg"}`}>
                    {positive ? "+" : ""}
                    {formatEUR(pl)}
                    <div className="text-xs opacity-80">
                      {positive ? "+" : ""}
                      {plPct.toFixed(1)}%
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-right font-mono tabular ${change24h >= 0 ? "text-pos" : "text-neg"}`}>
                    {change24h >= 0 ? "+" : ""}
                    {change24h.toFixed(2)}%
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
                      style={{ borderColor: RISK_COLORS[h.riskTier], color: RISK_COLORS[h.riskTier] }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RISK_COLORS[h.riskTier] }} />
                      {RISK_LABELS[h.riskTier]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {holdings.map((h) => {
          const { value, pl, plPct, change24h, positive } = computeRow(h, prices);
          return (
            <div key={h.symbol} className="rounded-2xl border border-hairline bg-panel p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="font-display text-base">{h.name}</div>
                  <div className="font-mono text-xs text-parchment/50">
                    {h.amount.toLocaleString("nl-NL", { maximumFractionDigits: 6 })} {h.symbol}
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"
                  style={{ borderColor: RISK_COLORS[h.riskTier], color: RISK_COLORS[h.riskTier] }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RISK_COLORS[h.riskTier] }} />
                  {RISK_LABELS[h.riskTier]}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-mono tabular text-lg">{formatEUR(value)}</span>
                <div className="text-right">
                  <div className={`font-mono text-sm tabular ${positive ? "text-pos" : "text-neg"}`}>
                    {positive ? "+" : ""}
                    {formatEUR(pl)} ({positive ? "+" : ""}
                    {plPct.toFixed(1)}%)
                  </div>
                  <div className={`font-mono text-xs tabular ${change24h >= 0 ? "text-pos" : "text-neg"}`}>
                    {change24h >= 0 ? "+" : ""}
                    {change24h.toFixed(2)}% (24u)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
