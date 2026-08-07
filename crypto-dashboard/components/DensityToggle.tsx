"use client";

import { useDensity } from "@/lib/density-context";

export default function DensityToggle() {
  const { density, setDensity } = useDensity();

  return (
    <div className="flex items-center rounded-full border border-hairline p-0.5 font-mono text-[10px]">
      <button
        onClick={() => setDensity("clean")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          density === "clean" ? "bg-parchment text-ink" : "text-parchment/50 hover:text-parchment/80"
        }`}
      >
        clean
      </button>
      <button
        onClick={() => setDensity("advanced")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          density === "advanced" ? "bg-parchment text-ink" : "text-parchment/50 hover:text-parchment/80"
        }`}
      >
        advanced
      </button>
    </div>
  );
}
