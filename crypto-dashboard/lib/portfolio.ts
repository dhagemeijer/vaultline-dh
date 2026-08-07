import { Holding } from "./types";

// Jouw echte Bitvavo-posities. Werk dit bij zodra je koopt/verkoopt,
// of vervang later door een live koppeling met de Bitvavo account-API.
export const holdings: Holding[] = [
  { symbol: "ETH", name: "Ethereum", amount: 0.00863631, avgBuyPrice: 2308.86, riskTier: "safe" },
  { symbol: "BAT", name: "Basic Attention Token", amount: 5.63945352, avgBuyPrice: 1.1029, riskTier: "risky" },
];

export const availableBalanceEUR = 0;
