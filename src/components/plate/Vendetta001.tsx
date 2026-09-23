/**
 * NO.001 仇討ち — こすくまくんが刀を構える図｡
 * 1950年代のコミック表紙の描き方にならう:
 *   太い墨の輪郭 / 面は3色（クリーム・朱・紺）/ 影は網点 / 動きは線で描く
 */
const INK = "var(--vl-ink)";
const CREAM = "#f7f1dd";
const RED = "var(--vl-red)";
const RED_D = "var(--vl-red-deep)";
const NAVY = "var(--vl-navy)";
const LW = 3.6;

export default function Vendetta001({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 216" className={className} role="img" aria-label="刀を構えたこすくまくん">
      <defs>
        <pattern id="v1-dot-r" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill={RED_D} opacity="0.75" />
        </pattern>
        <pattern id="v1-dot-i" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1" fill={INK} opacity="0.42" />
        </pattern>
        <radialGradient id="v1-fade-g">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="v1-fade">
          <circle cx="186" cy="52" r="62" fill="url(#v1-fade-g)" />
        </mask>
        <pattern id="v1-wrap" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill={NAVY} />
          <path d="M0,4 h8" stroke={CREAM} strokeWidth="1.4" />
        </pattern>
      </defs>

      {/* 後ろの光（ふちをぼかした網点） */}
      <g opacity="0.55" mask="url(#v1-fade)">
        <circle cx="186" cy="52" r="62" fill="url(#v1-dot-r)" />
      </g>

      {/* 足もとの影 */}
      <ellipse cx="104" cy="200" rx="60" ry="9" fill="url(#v1-dot-i)" />

      {/* ───── 刀（後ろの手から前へ） ───── */}
      <g>
        <path d="M170,84 L228,12 L239,22 L181,94 Z" fill={CREAM} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M180,84 L228,25" stroke={INK} strokeWidth="1.8" opacity="0.35" />
        {/* 鍔 */}
        <g transform="rotate(-46 168 88)">
          <rect x="153" y="81" width="30" height="11" rx="4" fill={INK} />
          <circle cx="168" cy="86.5" r="3" fill={CREAM} />
        </g>
        {/* 柄 */}
        <g transform="rotate(-46 150 106)">
          <rect x="130" y="99" width="42" height="15" rx="6" fill="url(#v1-wrap)" stroke={INK} strokeWidth="2.8" />
        </g>
      </g>

      {/* ───── 体（着物＋羽織） ───── */}
      <g>
        {/* 着物 */}
        <path
          d="M72,128 C66,156 60,180 58,196 L146,196 C144,178 140,154 134,128 Z"
          fill={CREAM}
          stroke={INK}
          strokeWidth={LW}
          strokeLinejoin="round"
        />
        {/* 合わせ（V の襟） */}
        <path d="M92,124 L104,152 L118,124" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M104,152 L104,196" stroke={INK} strokeWidth="2.4" opacity="0.5" />
        {/* 羽織（朱） */}
        <path d="M74,126 C64,150 58,176 56,196 L78,196 C80,170 86,144 96,126 Z" fill={RED} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M132,126 C142,150 148,176 150,196 L128,196 C126,170 120,144 110,126 Z" fill={RED} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M132,126 C142,150 148,176 150,196 L128,196 C126,170 120,144 110,126 Z" fill="url(#v1-dot-r)" opacity="0.5" />
        {/* 袖 */}
        <path d="M60,134 C46,146 40,166 42,182 L66,178 C64,162 66,146 72,136 Z" fill={RED} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {/* 帯 */}
        <rect x="70" y="158" width="68" height="15" rx="3" fill={NAVY} stroke={INK} strokeWidth="2.8" />
        <rect x="96" y="154" width="18" height="23" rx="3" fill={NAVY} stroke={INK} strokeWidth="2.6" />
      </g>

      {/* 足 */}
      <g fill={CREAM} stroke={INK} strokeWidth={LW} strokeLinejoin="round">
        <path d="M62,196 h30 a9,9 0 0 1 0,14 H62 a7,7 0 0 1 0,-14 Z" />
        <path d="M112,196 h30 a9,9 0 0 1 0,14 h-30 a7,7 0 0 1 0,-14 Z" />
      </g>

      {/* ───── 腕 ───── */}
      <g fill="none" strokeLinecap="round">
        {/* 刀を構える右腕 */}
        <path d="M132,140 C144,136 152,124 156,110" stroke={INK} strokeWidth="23" />
        <path d="M132,140 C144,136 152,124 156,110" stroke={CREAM} strokeWidth="17" />
        {/* 体に沿う左腕 */}
        <path d="M76,140 C70,152 68,162 68,170" stroke={INK} strokeWidth="23" />
        <path d="M76,140 C70,152 68,162 68,170" stroke={CREAM} strokeWidth="17" />
      </g>
      {/* にぎり */}
      <g fill={CREAM} stroke={INK} strokeWidth="3.2">
        <circle cx="157" cy="106" r="12" />
        <circle cx="68" cy="174" r="10.5" />
      </g>

      {/* ───── 頭 ───── */}
      <g>
        <circle cx="70" cy="50" r="17" fill={CREAM} stroke={INK} strokeWidth={LW} />
        <circle cx="128" cy="50" r="17" fill={CREAM} stroke={INK} strokeWidth={LW} />
        <circle cx="70" cy="50" r="7.5" fill={RED} opacity="0.5" />
        <circle cx="128" cy="50" r="7.5" fill={RED} opacity="0.5" />

        <circle cx="99" cy="80" r="42" fill={CREAM} stroke={INK} strokeWidth={LW} />
        {/* 右の頬に網点の陰 */}
        <path d="M99,38 A42,42 0 0 1 99,122 Z" fill="url(#v1-dot-i)" opacity="0.5" />

        {/* 鉢巻き */}
        <path d="M60,66 C76,54 122,54 138,66 L138,80 C122,68 76,68 60,80 Z" fill={CREAM} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="99" cy="69" r="9" fill={RED} stroke={INK} strokeWidth="2.6" />
        {/* 結び目と垂れ */}
        <path d="M58,70 C44,64 34,72 30,84 C42,82 52,80 60,82 Z" fill={CREAM} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M58,78 C44,84 34,94 32,106 C44,98 54,92 62,88 Z" fill={CREAM} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />

        {/* 目 */}
        <g fill={INK}>
          <ellipse cx="84" cy="90" rx="4.4" ry="5" />
          <ellipse cx="114" cy="90" rx="4.4" ry="5" />
        </g>
        <g stroke={INK} strokeWidth="3.2" strokeLinecap="round">
          <line x1="75" y1="82" x2="89" y2="85" />
          <line x1="123" y1="82" x2="109" y2="85" />
        </g>
        {/* 口もと */}
        <ellipse cx="99" cy="104" rx="18" ry="13" fill={CREAM} stroke={INK} strokeWidth="2.8" />
        <ellipse cx="99" cy="99" rx="5" ry="3.6" fill={INK} />
        <path d="M99,102 L99,107 M99,107 C94,112 88,111 87,107 M99,107 C104,112 110,111 111,107" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        {/* ほお */}
        <circle cx="68" cy="100" r="7" fill={RED} opacity="0.45" />
        <circle cx="130" cy="100" r="7" fill={RED} opacity="0.45" />
      </g>

      {/* 振りの弧 */}
      <g fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round">
        <path d="M196,10 C218,22 230,44 228,66" />
        <path d="M176,4 C206,14 224,40 222,70" opacity="0.5" />
      </g>
    </svg>
  );
}
