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

export type AlertThresholdType = "amount" | "percentage";
export type AlertDirection = "above" | "below";
export type AlertChannel = "dashboard" | "push" | "both";

export interface PriceAlert {
  id: string;
  symbol: string;
  thresholdType: AlertThresholdType;
  /** Bij 'amount': drempelwaarde in EUR. Bij 'percentage': percentage t.o.v. referencePrice. */
  thresholdValue: number;
  direction: AlertDirection;
  channel: AlertChannel;
  /** Vastgezette prijs op het moment van instellen — basis voor percentage-berekening. */
  referencePrice: number;
  active: boolean; // false = gepauzeerd door gebruiker
  createdAt: string; // ISO timestamp
}

export interface AlertNotification {
  id: string;
  alertId: string;
  symbol: string;
  message: string; // bv. "BTC boven €65.000"
  priceAtTrigger: number;
  triggeredAt: string; // ISO timestamp
  /** Snoozed = verborgen tot de alert opnieuw afgaat. Dismissed = definitief weg. */
  status: "unread" | "snoozed" | "dismissed";
}

export const RISK_LABELS: Record<RiskTier, string> = {
  risky: "Risicovol",
  safe: "Relatief veilig",
  stable: "Stabiel / beschermend",
};

export const RISK_COLORS: Record<RiskTier, string> = {
  risky: "#C23B3B",
  safe: "#8A8680",
  stable: "#F3F1EA",
};
