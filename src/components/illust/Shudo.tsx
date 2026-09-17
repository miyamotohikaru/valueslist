import IllustFrame, { INK, PAPER, RED, SW, SW_THIN, Sparkle } from "./base";

/** NO.003 衆道 — 井原西鶴『男色大鑑』の和綴じ本と、半開きの扇 */
export default function Shudo({ className = "" }: { className?: string }) {
  const id = "il-shudo";
  return (
    <IllustFrame id={id} label="和綴じ本と扇の図" className={className}>
      {/* 扇（本の右後ろで半開き） */}
      <g transform="rotate(8 112 124) translate(26 -6)">
        {/* 要（かなめ）から開いた扇。骨は面の内側だけに引く */}
        <path d="M112,124 L74,56 A78,78 0 0 1 150,56 Z" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <path d="M112,124 L74,56 A78,78 0 0 1 150,56 Z" fill={`url(#${id}-dots)`} opacity="0.5" />
        <g stroke={INK} strokeWidth="2.2" opacity="0.8">
          <line x1="112" y1="124" x2="93" y2="49" />
          <line x1="112" y1="124" x2="112" y2="46" />
          <line x1="112" y1="124" x2="131" y2="49" />
        </g>
        <path d="M74,56 A78,78 0 0 1 150,56" fill="none" stroke={RED} strokeWidth="6.5" />
        <circle cx="112" cy="124" r="6" fill={INK} />
      </g>

      {/* 和綴じ本（赤い表紙） */}
      <g transform="rotate(-7 68 92)">
        {/* 小口（重なった紙） */}
        <rect x="34" y="42" width="78" height="100" rx="3" fill={PAPER} stroke={INK} strokeWidth={SW} />
        {/* 表紙 */}
        <rect x="26" y="38" width="78" height="100" rx="3" fill={RED} stroke={INK} strokeWidth={SW} />
        {/* 題簽 */}
        <rect x="38" y="48" width="28" height="48" rx="2" fill={PAPER} stroke={INK} strokeWidth="2.4" />
        <g stroke={INK} strokeWidth="2.6" opacity="0.8">
          <line x1="52" y1="56" x2="52" y2="68" />
          <line x1="52" y1="74" x2="52" y2="88" />
        </g>
        {/* 綴じ糸（表紙の上にクリームで抜く） */}
        <g stroke={PAPER} strokeWidth="3">
          <line x1="33" y1="48" x2="33" y2="60" />
          <line x1="33" y1="70" x2="33" y2="82" />
          <line x1="33" y1="92" x2="33" y2="104" />
          <line x1="33" y1="114" x2="33" y2="126" />
        </g>
      </g>

      <Sparkle x={34} y={28} r={8} />
      <Sparkle x={128} y={136} r={6} />
    </IllustFrame>
  );
}
