interface Props {
  totalValue: number;
  availableBalance: number;
  dayChangeEUR: number;
  dayChangePct: number;
}

function formatEUR(v: number) {
  return v.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

export default function WalletSummary({ totalValue, availableBalance, dayChangeEUR, dayChangePct }: Props) {
  const positive = dayChangeEUR >= 0;
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs uppercase tracking-wider text-parchment/50">Totale walletwaarde</span>
      <div className="flex items-end gap-3">
        <span className="font-display text-3xl italic tabular sm:text-5xl">{formatEUR(totalValue)}</span>
        <span
          className={`mb-1 font-mono text-sm tabular ${positive ? "text-pos" : "text-neg"}`}
        >
          {positive ? "+" : ""}
          {formatEUR(dayChangeEUR)} ({positive ? "+" : ""}
          {dayChangePct.toFixed(2)}%) vandaag
        </span>
      </div>
      <span className="mt-2 font-mono text-sm text-parchment/60">
        Beschikbaar saldo: <span className="text-parchment/90 tabular">{formatEUR(availableBalance)}</span>
      </span>
    </div>
  );
}
