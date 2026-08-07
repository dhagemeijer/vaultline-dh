interface Props {
  label: string;
  value: string;
  /** 0-100, hoever de naald/boog staat */
  percent: number;
  color: string;
}

export default function Gauge({ label, value, percent, color }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  // Halve cirkel: 0% = links (180°), 100% = rechts (0°)
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="rounded-2xl border border-hairline bg-panel p-4 text-center">
      <p className="mb-2 font-mono text-xs text-parchment/50">{label}</p>
      <svg viewBox="0 0 100 55" className="mx-auto w-full max-w-[120px]">
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          className="text-hairline"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <p className="-mt-1 font-display text-lg" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
