import { PriceInfo } from "./types";

const BITVAVO_24H_ENDPOINT = "https://api.bitvavo.com/v2/ticker/24h";

interface Bitvavo24hResponse {
  market: string; // e.g. "BTC-EUR"
  last: string;
  open: string;
  high: string;
  low: string;
}

/**
 * Haalt live prijzen + 24u verandering op voor de opgegeven symbolen (EUR-paren).
 * Gebruikt de publieke Bitvavo endpoint — geen API-key of authenticatie nodig.
 * Stablecoins zoals USDC hebben mogelijk geen EUR-markt op Bitvavo; die vallen
 * terug op een vaste prijs van 1.
 */
export interface MarketMover {
  symbol: string;
  change24h: number;
}

/**
 * Haalt de grootste stijgers en dalers op over de hele Bitvavo EUR-markt
 * (niet beperkt tot je eigen holdings).
 */
export async function fetchMarketMovers(limit = 3): Promise<{ gainers: MarketMover[]; losers: MarketMover[] }> {
  const res = await fetch(BITVAVO_24H_ENDPOINT, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Bitvavo API fout: ${res.status}`);
  }
  const data: Bitvavo24hResponse[] = await res.json();

  const movers: MarketMover[] = data
    .filter((m) => m.market.endsWith("-EUR"))
    .map((m) => {
      const last = parseFloat(m.last);
      const open = parseFloat(m.open);
      const change24h = open > 0 ? ((last - open) / open) * 100 : 0;
      return { symbol: m.market.replace("-EUR", ""), change24h };
    })
    .filter((m) => Number.isFinite(m.change24h));

  const sorted = [...movers].sort((a, b) => b.change24h - a.change24h);
  return {
    gainers: sorted.slice(0, limit),
    losers: sorted.slice(-limit).reverse(),
  };
}

export async function fetchPrices(symbols: string[]): Promise<Record<string, PriceInfo>> {
  const res = await fetch(BITVAVO_24H_ENDPOINT, { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error(`Bitvavo API fout: ${res.status}`);
  }
  const data: Bitvavo24hResponse[] = await res.json();

  const bySymbol: Record<string, PriceInfo> = {};

  for (const symbol of symbols) {
    const market = data.find((m) => m.market === `${symbol}-EUR`);
    if (market) {
      const last = parseFloat(market.last);
      const open = parseFloat(market.open);
      const change24h = open > 0 ? ((last - open) / open) * 100 : 0;
      bySymbol[symbol] = { symbol, price: last, change24h };
    } else if (symbol === "USDC" || symbol === "USDT" || symbol === "EUR") {
      // Stablecoin fallback: geen directe EUR-markt of 1-op-1
      bySymbol[symbol] = { symbol, price: symbol === "USDC" || symbol === "USDT" ? 0.92 : 1, change24h: 0 };
    }
  }

  return bySymbol;
}
