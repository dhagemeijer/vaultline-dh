import { fetchPrices, fetchMarketMovers } from "@/lib/bitvavo";
import { availableBalanceEUR, holdings } from "@/lib/portfolio";
import { RiskTier } from "@/lib/types";
import DashboardView from "@/components/DashboardView";

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
    <DashboardView
      holdings={holdings}
      prices={prices}
      priceError={priceError}
      marketGainers={marketGainers}
      marketLosers={marketLosers}
      availableBalanceEUR={availableBalanceEUR}
      totalValue={totalValue}
      totalsByTier={totalsByTier}
      dayChangeEUR={dayChangeEUR}
      dayChangePct={dayChangePct}
      investedPct={investedPct}
      dayChangeGaugePercent={dayChangeGaugePercent}
    />
  );
}
