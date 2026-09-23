/**
 * カードの裏面｡山札に積むときと､配るときの裏返しに使う｡
 * 1950年代のトランプの裏のように､菱の格子と二重の縁で組む｡
 */
export default function CardBack({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 280" className={className} role="presentation" aria-hidden>
      <defs>
        <pattern id="vl-back-lattice" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="20" height="20" fill="var(--vl-red)" />
          <rect width="10" height="10" fill="var(--vl-red-deep)" />
          <rect x="10" y="10" width="10" height="10" fill="var(--vl-red-deep)" />
          <circle cx="10" cy="10" r="1.6" fill="var(--vl-card)" opacity="0.55" />
        </pattern>
      </defs>

      <rect x="1.5" y="1.5" width="197" height="277" fill="var(--vl-card)" stroke="var(--vl-ink)" strokeWidth="3" />
      <rect x="10" y="10" width="180" height="260" fill="url(#vl-back-lattice)" stroke="var(--vl-ink)" strokeWidth="2" />
      <rect x="18" y="18" width="164" height="244" fill="none" stroke="var(--vl-card)" strokeWidth="1.6" opacity="0.8" />

      {/* 中央の紋 */}
      <g transform="translate(100 140)">
        <circle r="46" fill="var(--vl-card)" stroke="var(--vl-ink)" strokeWidth="2.5" />
        <circle r="38" fill="none" stroke="var(--vl-red)" strokeWidth="1.6" />
        <text
          y="-6"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="1.6"
          fill="var(--vl-ink)"
          fontFamily="var(--font-courier), monospace"
          fontWeight="700"
        >
          SERIES
        </text>
        <text
          y="28"
          textAnchor="middle"
          fontSize="40"
          fill="var(--vl-red)"
          fontFamily="var(--font-anton), Impact, sans-serif"
        >
          14
        </text>
      </g>
    </svg>
  );
}
