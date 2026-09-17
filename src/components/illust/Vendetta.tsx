import IllustFrame, { INK, PAPER, RED, SW, SW_THIN, Sparkle } from "./base";

/** NO.001 仇討ち — 刀と、奉行所に届け出る免状（巻紙）と、朱印 */
export default function Vendetta({ className = "" }: { className?: string }) {
  const id = "il-vendetta";
  return (
    <IllustFrame id={id} label="刀と免状の図" className={className}>
      {/* 刀（左下から右上へ） */}
      <g transform="rotate(-42 80 74)">
        {/* 刃 */}
        <path d="M70,8 L80,-6 L90,8 L90,74 L70,74 Z" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <path d="M75,12 L75,72" stroke={INK} strokeWidth="1.4" opacity="0.45" />
        {/* 鍔 */}
        <rect x="58" y="74" width="44" height="10" rx="4" fill={INK} />
        {/* 柄 */}
        <rect x="68" y="84" width="24" height="52" rx="8" fill={RED} stroke={INK} strokeWidth={SW} />
        <g stroke={INK} strokeWidth="2.4" opacity="0.9">
          <line x1="68" y1="96" x2="92" y2="104" />
          <line x1="68" y1="108" x2="92" y2="116" />
          <line x1="68" y1="120" x2="92" y2="128" />
        </g>
      </g>

      {/* 免状（巻紙）: 下段に横に置く */}
      <g transform="rotate(-5 80 116)">
        <rect x="20" y="102" width="120" height="30" rx="15" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <g stroke={INK} strokeWidth={SW_THIN} opacity="0.5">
          <line x1="44" y1="110" x2="44" y2="124" />
          <line x1="56" y1="110" x2="56" y2="124" />
          <line x1="68" y1="110" x2="68" y2="124" />
          <line x1="80" y1="110" x2="80" y2="124" />
        </g>
        <circle cx="22" cy="117" r="13" fill={PAPER} stroke={INK} strokeWidth={SW} />
        <circle cx="22" cy="117" r="4" fill={INK} />
        {/* 朱印 */}
        <g transform="rotate(-8 116 117)">
          <circle cx="116" cy="117" r="13" fill={RED} stroke={INK} strokeWidth="2.2" />
          <circle cx="116" cy="117" r="8" fill="none" stroke={PAPER} strokeWidth="2" />
          <path d="M112,113 v8 M116,112 v10 M120,113 v8" stroke={PAPER} strokeWidth="1.8" />
        </g>
      </g>

      <Sparkle x={130} y={34} r={10} />
      <Sparkle x={28} y={62} r={7} />
    </IllustFrame>
  );
}
