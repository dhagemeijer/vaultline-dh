export type RiskTier = "risky" | "safe" | "stable";

export interface Holding {
  symbol: string; // e.g. "BTC"
  name: string; // e.g. "Bitcoin"
  amount: number; // hoeveelheid coins in bezit
  avgBuyPrice: number; // gemiddelde aankoopprijs in EUR
  riskTier: RiskTier;
}

export interface PriceInfo {
  symbol: string;
  price: number; // huidige prijs in EUR
  change24h: number; // percentage
}

export interface Alert {
  id: string;
  symbol: string;
  type: "boven" | "onder";
  threshold: number; // percentage of prijsniveau, afhankelijk van 'mode'
  mode: "percentage" | "prijs";
  active: boolean;
}

export const RISK_LABELS: Record<RiskTier, string> = {
  risky: "Risicovol",
  safe: "Relatief veilig",
  stable: "Stabiel / beschermend",
};

export const RISK_COLORS: Record<RiskTier, string> = {
  risky: "#8B0000",
  safe: "#5C5952",
  stable: "#141210",
};
