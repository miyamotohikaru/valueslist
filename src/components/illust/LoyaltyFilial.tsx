import IllustFrame, { INK, PAPER, RED, SW, SW_THIN, Sparkle } from "./base";

/** NO.002 忠孝 — 学校へ配られた勅語の謄本（巻物）と､授業の鐘 */
export default function LoyaltyFilial({ className = "" }: { className?: string }) {
  const id = "il-loyalty";
  return (
    <IllustFrame id={id} label="巻物と鐘の図" className={className}>
      {/* 巻物 */}
      <g transform="rotate(-6 80 92)">
        <rect x="30" y="62" width="100" height="60" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <g stroke={INK} strokeWidth={SW_THIN} opacity="0.55">
          <line x1="44" y1="72" x2="44" y2="112" />
          <line x1="56" y1="72" x2="56" y2="104" />
          <line x1="68" y1="72" x2="68" y2="112" />
          <line x1="80" y1="72" x2="80" y2="100" />
          <line x1="92" y1="72" x2="92" y2="112" />
          <line x1="104" y1="72" x2="104" y2="104" />
        </g>
        {/* 両端の軸 */}
        <rect x="18" y="54" width="16" height="76" rx="8" fill={RED} stroke={INK} strokeWidth={SW} />
        <rect x="126" y="54" width="16" height="76" rx="8" fill={RED} stroke={INK} strokeWidth={SW} />
        {/* 結んだ紐 */}
        <path d="M26,92 C8,86 8,110 26,104" fill="none" stroke={INK} strokeWidth={SW} />
      </g>

      {/* 鐘（学校で鳴らす手持ちの鐘） */}
      <g transform="rotate(14 118 40) translate(2 -8)">
        <path d="M100,50 C100,30 106,20 118,20 C130,20 136,30 136,50 Z" fill={RED} stroke={INK} strokeWidth={SW} />
        <rect x="96" y="50" width="44" height="7" rx="3.5" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <circle cx="118" cy="62" r="4.5" fill={INK} />
        <rect x="114" y="10" width="8" height="12" rx="4" fill={INK} />
      </g>
      {/* 鳴っている線 */}
      <g stroke={INK} strokeWidth="3" fill="none" opacity="0.85" strokeLinecap="round">
        <path d="M92,20 L84,14" />
        <path d="M88,34 L78,32" />
        <path d="M148,24 L156,18" />
        <path d="M152,38 L162,36" />
      </g>

      <Sparkle x={34} y={34} r={8} />
    </IllustFrame>
  );
}
