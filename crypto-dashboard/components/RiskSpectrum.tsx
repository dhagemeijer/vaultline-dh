"use client";

import { RISK_COLORS, RISK_LABELS, RiskTier } from "@/lib/types";

interface Props {
  totalsByTier: Record<RiskTier, number>;
  total: number;
}

const ORDER: RiskTier[] = ["stable", "safe", "risky"];

export default function RiskSpectrum({ totalsByTier, total }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-base text-parchment/90">Risicospreiding</h2>
        <span className="font-mono text-xs text-parchment/50">van veilig naar risicovol →</span>
      </div>

      <div className="flex h-4 w-full overflow-hidden rounded-full border border-hairline">
        {ORDER.map((tier) => {
          const value = totalsByTier[tier] ?? 0;
          const pct = total > 0 ? (value / total) * 100 : 0;
          if (pct <= 0) return null;
          return (
            <div
              key={tier}
              style={{ width: `${pct}%`, backgroundColor: RISK_COLORS[tier] }}
              className="h-full transition-all duration-500"
              title={`${RISK_LABELS[tier]}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {ORDER.map((tier) => {
          const value = totalsByTier[tier] ?? 0;
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={tier} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: RISK_COLORS[tier] }}
              />
              <span className="text-parchment/70">{RISK_LABELS[tier]}</span>
              <span className="font-mono tabular text-parchment/90">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
