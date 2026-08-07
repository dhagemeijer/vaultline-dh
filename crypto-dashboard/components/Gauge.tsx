interface Props {
  label: string;
  value: string;
  /** 0-100, hoever de naald/boog staat */
  percent: number;
  color: string;
  glow?: boolean;
}

export default function Gauge({ label, value, percent, color, glow = true }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  // Naaldpunt berekenen op basis van percent (0% = links/180°, 100% = rechts/0°)
  const angle = Math.PI - (clamped / 100) * Math.PI;
  const tipX = 50 + radius * Math.cos(angle);
  const tipY = 50 - radius * Math.sin(angle);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI - (i / 10) * Math.PI;
    const inner = radius - 6;
    const outer = radius;
    return {
      x1: 50 + inner * Math.cos(a),
      y1: 50 - inner * Math.sin(a),
      x2: 50 + outer * Math.cos(a),
      y2: 50 - outer * Math.sin(a),
    };
  });

  return (
    <div className="rounded-2xl border border-hairline bg-panel p-4 text-center">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-parchment/50">{label}</p>
      <svg viewBox="0 0 100 58" className="mx-auto w-full max-w-[130px]">
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="1" className="text-hairline" />
        ))}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-hairline"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={glow ? { filter: `drop-shadow(0 0 4px ${color}99)` } : undefined}
        />
        <circle cx={tipX} cy={tipY} r="3" fill={color} style={glow ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined} />
      </svg>
      <p className="-mt-1 font-mono text-lg font-medium tabular" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
