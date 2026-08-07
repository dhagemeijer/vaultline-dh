import { fetchPrices, fetchMarketMovers } from "@/lib/bitvavo";
import { availableBalanceEUR, holdings } from "@/lib/portfolio";
import { RiskTier } from "@/lib/types";
import Link from "next/link";

import WalletSummary from "@/components/WalletSummary";
import RiskSpectrum from "@/components/RiskSpectrum";
import HoldingsTable from "@/components/HoldingsTable";
import PerformanceChart from "@/components/PerformanceChart";
import TopMovers from "@/components/TopMovers";
import ConnectionStatus from "@/components/ConnectionStatus";
import Gauge from "@/components/Gauge";

export const revalidate = 30;

export default async function DashboardPage() {
  const symbols = holdings.map((h) => h.symbol);
  let prices: Awaited<ReturnType<typeof fetchPrices>> = {};
  let priceError = false;
  try {
    prices = await fetchPrices(symbols);
  } catch {
    priceError = true;
  }

  let marketGainers: Awaited<ReturnType<typeof fetchMarketMovers>>["gainers"] = [];
  let marketLosers: Awaited<ReturnType<typeof fetchMarketMovers>>["losers"] = [];
  try {
    const market = await fetchMarketMovers(3);
    marketGainers = market.gainers;
    marketLosers = market.losers;
  } catch {
    // stil falen — sectie toont dan leeg, portfolio-deel blijft werken
  }

  const totalValue = holdings.reduce((sum, h) => sum + h.amount * (prices[h.symbol]?.price ?? h.avgBuyPrice), 0);

  const totalsByTier: Record<RiskTier, number> = { risky: 0, safe: 0, stable: 0 };
  for (const h of holdings) {
    const value = h.amount * (prices[h.symbol]?.price ?? h.avgBuyPrice);
    totalsByTier[h.riskTier] += value;
  }

  // "Sinds gisteren 00:00u" — we gebruiken de 24u-verandering van Bitvavo als
  // benadering hiervan (een echte 00:00u-snapshot vereist opgeslagen historie,
  // zie de placeholder-grafiek verderop).
  const dayChangeEUR = holdings.reduce((sum, h) => {
    const p = prices[h.symbol];
    if (!p) return sum;
    const value = h.amount * p.price;
    const yesterdayValue = value / (1 + p.change24h / 100);
    return sum + (value - yesterdayValue);
  }, 0);
  const dayChangePct = totalValue > 0 ? (dayChangeEUR / (totalValue - dayChangeEUR)) * 100 : 0;

  const investedValue = totalValue;
  const totalWithBalance = investedValue + availableBalanceEUR;
  const investedPct = totalWithBalance > 0 ? (investedValue / totalWithBalance) * 100 : 0;

  const dayChangeGaugePercent = Math.max(0, Math.min(100, 50 + dayChangePct * 5));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-10 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-parchment">Jouw crypto, in één oogopslag</h1>
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

      <section className="mb-8">
        <WalletSummary
          totalValue={totalValue}
          availableBalance={availableBalanceEUR}
          dayChangeEUR={dayChangeEUR}
          dayChangePct={dayChangePct}
        />
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3">
        <Gauge
          label="Sinds gisteren 00:00u"
          value={`${dayChangePct >= 0 ? "+" : ""}${dayChangePct.toFixed(1)}%`}
          percent={dayChangeGaugePercent}
          color={dayChangePct >= 0 ? "#2F6B3A" : "#8B0000"}
        />
        <Gauge
          label="Belegd vs. saldo"
          value={`${investedPct.toFixed(0)}% belegd`}
          percent={investedPct}
          color="#141210"
        />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <HoldingsTable holdings={holdings} prices={prices} />
        </div>
        <TopMovers holdings={holdings} prices={prices} marketGainers={marketGainers} marketLosers={marketLosers} />
      </section>

      <section className="mb-8">
        <PerformanceChart currentValue={totalValue} />
      </section>

      <section>
        <div className="rounded-2xl border border-hairline bg-panel p-5">
          <RiskSpectrum totalsByTier={totalsByTier} total={totalValue} />
        </div>
      </section>
    </main>
  );
}
