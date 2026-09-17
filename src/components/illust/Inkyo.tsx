import IllustFrame, { INK, PAPER, RED, SW, SW_THIN, Sparkle } from "./base";

/** NO.004 隠居 — 家督を譲ったあとの､急須と湯呑み */
export default function Inkyo({ className = "" }: { className?: string }) {
  const id = "il-inkyo";
  return (
    <IllustFrame id={id} label="急須と湯呑みの図" className={className}>
      {/* 湯気 */}
      <g stroke={INK} strokeWidth="3.2" fill="none" opacity="0.85">
        <path d="M58,42 C50,34 66,28 58,18" />
        <path d="M78,38 C70,30 86,24 78,14" />
      </g>

      {/* 急須（赤い胴） */}
      <g>
        <path d="M40,80 L12,68 L14,92 L40,100 Z" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <path d="M36,68 h58 a30,30 0 0 1 0,46 h-58 a30,30 0 0 1 0,-46 Z" fill={RED} stroke={INK} strokeWidth={SW} />
        <path d="M38,88 h56" stroke={PAPER} strokeWidth="7" />
        <path d="M46,68 a22,15 0 0 1 40,0 Z" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <circle cx="66" cy="51" r="6.5" fill={RED} stroke={INK} strokeWidth="2.6" />
        <rect x="100" y="58" width="13" height="36" rx="6.5" transform="rotate(22 106 76)" fill={INK} />
      </g>

      {/* 湯呑み */}
      <g transform="translate(8 0)">
        <path d="M108,102 h30 l-4,26 a11,11 0 0 1 -22,0 Z" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <ellipse cx="123" cy="102" rx="15" ry="5.5" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <path d="M110,114 h26" stroke={RED} strokeWidth="5" />
      </g>

      {/* 盆 */}
      <rect x="16" y="126" width="128" height="12" rx="6" fill={PAPER} stroke={INK} strokeWidth={SW} />
      <path d="M26,132 h108" stroke={INK} strokeWidth={SW_THIN} opacity="0.35" />

      <Sparkle x={132} y={42} r={8} />
    </IllustFrame>
  );
}
