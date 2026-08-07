"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Range = "uur" | "dag" | "week" | "maand";

const RANGE_POINTS: Record<Range, number> = { uur: 12, dag: 24, week: 7, maand: 30 };
const RANGE_LABELS: Record<Range, string> = {
  uur: "Afgelopen uur",
  dag: "Afgelopen dag",
  week: "Afgelopen week",
  maand: "Afgelopen maand",
};

// Genereert een plausibele placeholder-reeks rond de huidige waarde.
// Vervang door echte historische snapshots zodra die worden opgeslagen (zie README).
function generateSeries(current: number, points: number) {
  const series: { t: string; v: number }[] = [];
  let v = current * (0.94 + Math.random() * 0.04);
  for (let i = 0; i < points; i++) {
    v = v * (1 + (Math.random() - 0.48) * 0.015);
    series.push({ t: String(i), v: Math.round(v) });
  }
  series[series.length - 1].v = Math.round(current);
  return series;
}

export default function PerformanceChart({ currentValue }: { currentValue: number }) {
  const [range, setRange] = useState<Range>("dag");
  const data = useMemo(() => generateSeries(currentValue, RANGE_POINTS[range]), [range, currentValue]);

  return (
    <div className="rounded-2xl border border-hairline bg-panel p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="font-display text-base text-parchment/90">Ontwikkeling wallet</h2>
        <div className="flex gap-1 rounded-full border border-hairline p-1">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                range === r ? "bg-panel2 text-parchment" : "text-parchment/50 hover:text-parchment/80"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 font-mono text-xs text-parchment/40">
        {RANGE_LABELS[range]} · placeholder-data — wordt live zodra historie wordt opgeslagen
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
          <Tooltip
            contentStyle={{ background: "#151618", border: "1px solid #2A2D30", borderRadius: 8, color: "#F3F1EA" }}
            labelFormatter={() => ""}
            formatter={(v: number) => [`€${v.toLocaleString("nl-NL")}`, "Waarde"]}
          />
          <Line type="monotone" dataKey="v" stroke="#C23B3B" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
