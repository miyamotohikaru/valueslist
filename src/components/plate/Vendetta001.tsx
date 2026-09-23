/**
 * NO.001 仇討ち — こすくまくんが刀を構える図｡
 * 姿かたちは消滅職業図鑑のこすくまくんに合わせる:
 *   体はうすいクリーム / 輪郭は墨 / 目は小さな黒い楕円ふたつ / 鼻は小さな楕円 / 口は描かない
 * 仕上げだけ1950年代のコミック表紙に寄せる（面は3色･影は網点･動きは線）｡
 */
const INK = "#241c18";
const FUR = "#f8f4d4";
const CREAM = "#faf4e3";
const RED = "var(--vl-red)";
const RED_D = "var(--vl-red-deep)";
const NAVY = "var(--vl-navy)";
const LW = 3;

export default function Vendetta001({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="刀を構えたこすくまくん">
      <defs>
        <pattern id="v1-dot-r" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill={RED_D} opacity="0.8" />
        </pattern>
        <pattern id="v1-dot-i" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1" fill={INK} opacity="0.4" />
        </pattern>
        <radialGradient id="v1-fade-g">
          <stop offset="0.3" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="v1-fade">
          <circle cx="188" cy="48" r="58" fill="url(#v1-fade-g)" />
        </mask>
        <pattern id="v1-wrap" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill={NAVY} />
          <path d="M0,4 h8" stroke={CREAM} strokeWidth="1.4" />
        </pattern>
      </defs>

      {/* 後ろの光 */}
      <g opacity="0.5" mask="url(#v1-fade)">
        <circle cx="188" cy="48" r="58" fill="url(#v1-dot-r)" />
      </g>
      {/* 足もとの影 */}
      <ellipse cx="104" cy="186" rx="54" ry="8" fill="url(#v1-dot-i)" />

      {/* ───── 刀 ───── */}
      <g>
        <path d="M164,74 L218,10 L228,19 L174,83 Z" fill={CREAM} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M173,74 L217,21" stroke={INK} strokeWidth="1.6" opacity="0.35" />
        <g transform="rotate(-48 162 81)">
          <rect x="148" y="75" width="28" height="10" rx="4" fill={INK} />
        </g>
        <g transform="rotate(-48 146 97)">
          <rect x="128" y="91" width="36" height="13" rx="5.5" fill="url(#v1-wrap)" stroke={INK} strokeWidth="2.4" />
        </g>
      </g>

      {/* ───── 体 ───── */}
      <g>
        {/* 胴（丸っこい） */}
        <path
          d="M108,110 C136,110 150,132 150,152 C150,172 132,182 108,182 C84,182 66,172 66,152 C66,132 80,110 108,110 Z"
          fill={FUR}
          stroke={INK}
          strokeWidth={LW}
          strokeLinejoin="round"
        />
        {/* 羽織（朱）: 肩から左右へ */}
        <path d="M84,114 C72,124 66,140 66,154 C66,168 76,177 88,180 C82,160 80,132 92,114 Z" fill={RED} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M132,114 C144,124 150,140 150,154 C150,168 140,177 128,180 C134,160 136,132 124,114 Z" fill={RED} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M132,114 C144,124 150,140 150,154 C150,168 140,177 128,180 C134,160 136,132 124,114 Z" fill="url(#v1-dot-r)" opacity="0.45" />
        {/* 帯 */}
        <rect x="78" y="146" width="60" height="13" rx="3" fill={NAVY} stroke={INK} strokeWidth="2.4" />
        <rect x="100" y="142" width="17" height="21" rx="3" fill={NAVY} stroke={INK} strokeWidth="2.2" />
      </g>

      {/* 足 */}
      <g fill={FUR} stroke={INK} strokeWidth={LW} strokeLinejoin="round">
        <ellipse cx="88" cy="182" rx="16" ry="10" />
        <ellipse cx="126" cy="182" rx="16" ry="10" />
      </g>

      {/* 腕 */}
      <g fill="none" strokeLinecap="round">
        <path d="M134,124 C144,120 150,110 152,98" stroke={INK} strokeWidth="21" />
        <path d="M134,124 C144,120 150,110 152,98" stroke={FUR} strokeWidth="15.5" />
        <path d="M80,126 C72,134 70,144 70,152" stroke={INK} strokeWidth="21" />
        <path d="M80,126 C72,134 70,144 70,152" stroke={FUR} strokeWidth="15.5" />
      </g>
      <g fill={FUR} stroke={INK} strokeWidth="2.8">
        <circle cx="153" cy="95" r="11" />
        <circle cx="70" cy="155" r="10" />
      </g>

      {/* ───── 頭 ───── */}
      <g>
        {/* 耳 */}
        <ellipse cx="74" cy="36" rx="18" ry="20" transform="rotate(-18 74 36)" fill={FUR} stroke={INK} strokeWidth={LW} />
        <ellipse cx="142" cy="36" rx="18" ry="20" transform="rotate(18 142 36)" fill={FUR} stroke={INK} strokeWidth={LW} />
        {/* 顔 */}
        <ellipse cx="108" cy="70" rx="48" ry="45" fill={FUR} stroke={INK} strokeWidth={LW} />
        {/* 右側に網点の陰 */}
        <path d="M108,25 A48,45 0 0 1 108,115 Z" fill="url(#v1-dot-i)" opacity="0.35" />

        {/* 鉢巻き */}
        <path d="M63,56 C80,44 136,44 153,56 L153,68 C136,56 80,56 63,68 Z" fill={CREAM} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <circle cx="108" cy="58" r="8.5" fill={RED} stroke={INK} strokeWidth="2.4" />
        <path d="M62,60 C48,54 38,62 34,74 C46,72 56,70 64,72 Z" fill={CREAM} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M62,68 C48,74 38,84 36,96 C48,88 58,82 66,78 Z" fill={CREAM} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />

        {/* 目と鼻（口は描かない） */}
        <g fill={INK}>
          <ellipse cx="92" cy="82" rx="5" ry="6.5" />
          <ellipse cx="124" cy="82" rx="5" ry="6.5" />
          <ellipse cx="108" cy="96" rx="6.5" ry="4.6" />
        </g>
      </g>

      {/* 振りの弧 */}
      <g fill="none" stroke={RED} strokeWidth="3.6" strokeLinecap="round">
        <path d="M192,6 C214,18 226,40 224,62" />
        <path d="M174,0 C202,10 220,36 218,66" opacity="0.5" />
      </g>
    </svg>
  );
}
