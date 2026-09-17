/**
 * 「価値観の解剖図」— 一枚のカードを層に分解して、何が書いてあるかを示す分解図。
 * サンドイッチの分解図のように、左に札、右に浮いた層。赤一色の線画と網点の面。
 */
const RED = "var(--vl-red)";
const INK = "var(--vl-ink)";
const PAPER = "var(--vl-card)";

type Layer = { label: string; en: string; text: string; h: number; face: "plain" | "dots" | "hatch" };

const LAYERS: Layer[] = [
  { label: "傾向", en: "TREND", text: "× 廃番", h: 12, face: "plain" },
  { label: "商品名", en: "NAME", text: "仇討ち", h: 28, face: "dots" },
  { label: "製造", en: "MFD.", text: "近世 届出制で公認", h: 14, face: "plain" },
  { label: "廃番", en: "DISC.", text: "1873.02.07 太政官布告第37号", h: 14, face: "hatch" },
  { label: "証拠", en: "EVIDENCE", text: "法令・初出型", h: 18, face: "dots" },
];

const W = 240; // 層の幅
const SK = 50; // 奥行きの横ずれ
const DP = 26; // 奥行きの縦
const X0 = 138; // 層の左端
const GAP = 20; // 層と層のすきま

export default function ExplodedCard({ className = "" }: { className?: string }) {
  let y = 14;
  const rows = LAYERS.map((l) => {
    const r = { ...l, y };
    y += DP + l.h + GAP;
    return r;
  });
  const H = y + 28;
  const VW = X0 + W + SK + 8;

  return (
    <svg viewBox={`0 0 ${VW} ${H}`} className={`vl-ex ${className}`} role="img" aria-label="価値観カードの分解図">
      <defs>
        <pattern id="ex-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.4" fill={RED} opacity="0.7" />
        </pattern>
        <pattern id="ex-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2.2" height="6" fill={RED} opacity="0.55" />
        </pattern>
        <pattern id="ex-dots-top" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1" fill={RED} opacity="0.35" />
        </pattern>
      </defs>
      {rows.map((r, i) => {
        const x = X0;
        const top = `${x + SK},${r.y} ${x + SK + W},${r.y} ${x + W},${r.y + DP} ${x},${r.y + DP}`;
        const front = `${x},${r.y + DP} ${x + W},${r.y + DP} ${x + W},${r.y + DP + r.h} ${x},${r.y + DP + r.h}`;
        const side = `${x + W},${r.y + DP} ${x + SK + W},${r.y} ${x + SK + W},${r.y + r.h} ${x + W},${r.y + DP + r.h}`;
        const cy = r.y + DP / 2 + 3;
        const faceFill = r.face === "dots" ? "url(#ex-dots)" : r.face === "hatch" ? "url(#ex-hatch)" : RED;
        const isName = r.label === "商品名";
        return (
          <g key={i} className="vl-ex-layer" style={{ ["--i" as string]: i }}>
            {/* 引き出し線と札 */}
            <line x1={120} y1={cy} x2={x + 10} y2={r.y + DP - 5} stroke={RED} strokeWidth="1.8" strokeDasharray="4 3" />
            <circle cx={x + 10} cy={r.y + DP - 5} r="3" fill={RED} />
            {/* 値札（左に紐の穴、右が矢印の形） */}
            <polygon
              points={`4,${cy - 14} 104,${cy - 14} 118,${cy} 104,${cy + 14} 4,${cy + 14}`}
              fill={RED}
              stroke={INK}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx={15} cy={cy} r="3" fill={PAPER} stroke={INK} strokeWidth="1.2" />
            <text x={62} y={cy + 5.5} textAnchor="middle" fontSize="15" fontWeight="700" fill={PAPER} fontFamily="var(--font-zen-kaku), sans-serif">
              {r.label}
            </text>
            {/* 層（側面・前面・天面） */}
            <polygon points={side} fill="url(#ex-hatch)" stroke={RED} strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points={front} fill={faceFill} opacity={r.face === "plain" ? 0.9 : 1} stroke={RED} strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points={top} fill={PAPER} stroke={RED} strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points={top} fill="url(#ex-dots-top)" />
            {/* 見出しの和文は 800 のみ。合成ボールドを起こさないよう weight を明示する */}
            <text
              x={x + SK / 2 + W / 2}
              y={r.y + DP / 2 + (isName ? 7 : 4.5)}
              textAnchor="middle"
              fontSize={isName ? 21 : 14}
              fontWeight={isName ? 800 : 700}
              fill={INK}
              fontFamily={isName ? "var(--font-ja-display), sans-serif" : "var(--font-zen-kaku), sans-serif"}
            >
              {r.text}
            </text>
          </g>
        );
      })}
      {/* 台座と図番号 */}
      <line x1={X0 - 6} y1={H - 16} x2={X0 + W + SK + 4} y2={H - 16} stroke={RED} strokeWidth="2.2" />
      <text x={X0 + W + SK + 4} y={H - 1} textAnchor="end" fontSize="13" fontWeight="700" fill={RED} fontFamily="var(--font-courier), monospace" letterSpacing="0.8">
        FIG.1 ANATOMY OF A VALUE
      </text>
    </svg>
  );
}
