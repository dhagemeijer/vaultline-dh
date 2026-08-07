"use client";

import Link from "next/link";
import { useDensity } from "@/lib/density-context";
import { Holding, PriceInfo, RiskTier } from "@/lib/types";
import { MarketMover } from "@/lib/bitvavo";

import WalletSummary from "@/components/WalletSummary";
import RiskSpectrum from "@/components/RiskSpectrum";
import HoldingsTable from "@/components/HoldingsTable";
import PerformanceChart from "@/components/PerformanceChart";
import TopMovers from "@/components/TopMovers";
import ConnectionStatus from "@/components/ConnectionStatus";
import Gauge from "@/components/Gauge";

interface Props {
  holdings: Holding[];
  prices: Record<string, PriceInfo>;
  priceError: boolean;
  marketGainers: MarketMover[];
  marketLosers: MarketMover[];
  availableBalanceEUR: number;
  totalValue: number;
  totalsByTier: Record<RiskTier, number>;
  dayChangeEUR: number;
  dayChangePct: number;
  investedPct: number;
  dayChangeGaugePercent: number;
}

export default function DashboardView({
  holdings,
  prices,
  priceError,
  marketGainers,
  marketLosers,
  availableBalanceEUR,
  totalValue,
  totalsByTier,
  dayChangeEUR,
  dayChangePct,
  investedPct,
  dayChangeGaugePercent,
}: Props) {
  const { density } = useDensity();
  const clean = density === "clean";

  return (
    <main className={`mx-auto max-w-5xl px-4 sm:px-6 ${clean ? "py-8 sm:py-12" : "py-4 sm:py-6"}`}>
      <header
        className={`flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between ${clean ? "mb-6" : "mb-3"}`}
      >
        <div>
          <h1 className={`font-display italic text-parchment ${clean ? "text-2xl" : "text-lg"}`}>
            Jouw crypto, in één oogopslag
          </h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-parchment/40">
          <ConnectionStatus />
          <span>Bitvavo</span>
          <span>·</span>
          <Link href="/ideeen" className="underline hover:text-parchment/70">
            ideeën &amp; roadmap
          </Link>
        </div>
      </header>

      {priceError && (
        <div className="mb-6 rounded-xl border border-risky/40 bg-risky/10 px-4 py-3 text-sm text-risky">
          Live prijzen konden niet worden opgehaald van Bitvavo. Waarden hieronder zijn gebaseerd op je
          aankoopprijzen totdat de verbinding herstelt.
        </div>
      )}

      <section className={clean ? "mb-5" : "mb-3"}>
        <WalletSummary
          totalValue={totalValue}
          availableBalance={availableBalanceEUR}
          dayChangeEUR={dayChangeEUR}
          dayChangePct={dayChangePct}
        />
      </section>

      <section className={`grid grid-cols-2 gap-3 ${clean ? "mb-5" : "mb-3"}`}>
        <Gauge
          label="Sinds gisteren 00:00u"
          value={`${dayChangePct >= 0 ? "+" : ""}${dayChangePct.toFixed(1)}%`}
          percent={dayChangeGaugePercent}
          color={dayChangePct >= 0 ? "#4CAF7D" : "#C23B3B"}
        />
        <Gauge
          label="Belegd vs. saldo"
          value={`${investedPct.toFixed(0)}% belegd`}
          percent={investedPct}
          color="#F3F1EA"
        />
      </section>

      <section className={`grid grid-cols-1 gap-3 md:grid-cols-3 ${clean ? "mb-5" : "mb-3"}`}>
        <div className="md:col-span-2">
          <HoldingsTable holdings={holdings} prices={prices} />
        </div>
        <TopMovers holdings={holdings} prices={prices} marketGainers={marketGainers} marketLosers={marketLosers} />
      </section>

      <section className={clean ? "mb-5" : "mb-3"}>
        <PerformanceChart currentValue={totalValue} />
      </section>

      <section>
        <div className={`rounded-2xl border border-hairline bg-panel ${clean ? "p-4" : "p-3"}`}>
          <RiskSpectrum totalsByTier={totalsByTier} total={totalValue} />
        </div>
      </section>
    </main>
  );
}
