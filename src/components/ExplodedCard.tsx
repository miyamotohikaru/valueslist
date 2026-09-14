/**
 * 「価値観の解剖図」— 一枚のカードを層に分解して、何が書いてあるかを示す分解図。
 * サンドイッチの分解図のように、左に札、右に浮いた層。赤の線画＋クリーム。
 */
const RED = "var(--vl-red)";
const INK = "var(--vl-ink)";
const PAPER = "var(--vl-card)";

type Layer = { label: string; en: string; text: string; h?: number; gap?: number; dots?: boolean };

const LAYERS: Layer[] = [
  { label: "傾向", en: "TREND", text: "× 廃番", h: 10 },
  { label: "商品名", en: "NAME", text: "仇討ち", h: 26 },
  { label: "製造", en: "MFD.", text: "近世 届出制で公認", h: 14 },
  { label: "廃番", en: "DISC.", text: "1873.02.07 太政官布告第37号", h: 14, dots: true },
  { label: "再入荷", en: "RESTOCK", text: "—", h: 12 },
  { label: "証拠", en: "EVIDENCE", text: "法令・初出型／カーブ型", h: 18, dots: true },
];

const W = 200; // 層の幅
const SK = 46; // 奥行きの横ずれ
const DP = 22; // 奥行きの縦
const X0 = 150; // 層の左端
const GAP = 22; // 層と層のすきま

export default function ExplodedCard({ className = "" }: { className?: string }) {
  let y = 24;
  const rows = LAYERS.map((l) => {
    const h = l.h ?? 14;
    const r = { ...l, y, h };
    y += DP + h + GAP;
    return r;
  });
  const H = y + 10;

  return (
    <svg viewBox={`0 0 ${X0 + W + SK + 24} ${H}`} className={className} role="img" aria-label="価値観カードの分解図">
      <defs>
        <pattern id="ex-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.1" fill={RED} opacity="0.55" />
        </pattern>
        <pattern id="ex-lines" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2" height="6" fill={RED} opacity="0.35" />
        </pattern>
      </defs>
      {rows.map((r, i) => {
        const x = X0;
        const top = `${x + SK},${r.y} ${x + SK + W},${r.y} ${x + W},${r.y + DP} ${x},${r.y + DP}`;
        const front = `${x},${r.y + DP} ${x + W},${r.y + DP} ${x + W},${r.y + DP + r.h} ${x},${r.y + DP + r.h}`;
        const side = `${x + W},${r.y + DP} ${x + SK + W},${r.y} ${x + SK + W},${r.y + r.h} ${x + W},${r.y + DP + r.h}`;
        const cy = r.y + DP / 2 + 2;
        return (
          <g key={i}>
            {/* 引き出し線と札 */}
            <line x1={112} y1={cy} x2={x + 8} y2={r.y + DP - 4} stroke={RED} strokeWidth="1.4" strokeDasharray="3 3" />
            <circle cx={x + 8} cy={r.y + DP - 4} r="2.4" fill={RED} />
            <rect x={8} y={cy - 11} width={104} height={22} rx="11" fill={RED} />
            <text x={60} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={PAPER} fontFamily="var(--font-zen-kaku), sans-serif">
              {r.label}
              <tspan fontSize="8" fontFamily="var(--font-courier), monospace" dx="5" dy="0">
                {r.en}
              </tspan>
            </text>
            {/* 層 */}
            <polygon points={side} fill={r.dots ? "url(#ex-lines)" : PAPER} stroke={RED} strokeWidth="2" strokeLinejoin="round" />
            <polygon points={front} fill={r.dots ? "url(#ex-dots)" : PAPER} stroke={RED} strokeWidth="2" strokeLinejoin="round" />
            <polygon points={top} fill={PAPER} stroke={RED} strokeWidth="2" strokeLinejoin="round" />
            <text
              x={x + SK / 2 + W / 2}
              y={r.y + DP / 2 + 4}
              textAnchor="middle"
              fontSize={r.label === "商品名" ? 15 : 10}
              fontWeight="700"
              fill={INK}
              fontFamily={r.label === "商品名" ? "var(--font-dela), sans-serif" : "var(--font-courier), monospace"}
            >
              {r.text}
            </text>
          </g>
        );
      })}
      {/* 台座 */}
      <g>
        <line x1={X0 - 10} y1={H - 6} x2={X0 + W + SK + 10} y2={H - 6} stroke={RED} strokeWidth="2" />
        <text x={X0 + W + SK + 10} y={H - 12} textAnchor="end" fontSize="8" fill={RED} fontFamily="var(--font-courier), monospace" letterSpacing="1.5">
          FIG.1 ANATOMY OF A VALUE
        </text>
      </g>
    </svg>
  );
}
