import type { Value } from "@/data/types";
import { ERAS, eraOf } from "@/lib/timescale";

/**
 * FIG.1 製造工場別 出荷数。
 * 時代（＝工場）ごとに、そこで製造された価値観の数を横向きの棒で描く。
 * 棚の色は使わず、赤一色＋クリーム。数字は Anton、ラベルは Courier。
 */
const RED = "var(--vl-red)";
const INK = "var(--vl-ink)";
const SOFT = "var(--vl-ink-soft)";
const LINE = "var(--vl-line)";
const COURIER = "var(--font-courier), monospace";
const ANTON = "var(--font-anton), Impact, sans-serif";

const W = 360; // viewBox の幅（携帯でほぼ等倍になる）
const LABEL_W = 118; // 左のラベル欄
const NUM_W = 44; // 右の数字欄
const ROW = 46;
const TOP = 14;
const BAR_H = 22;

/** 時代ごとの製造数（made の無いものは数えない） */
export function countByEra(items: Value[]) {
  return ERAS.map((e) => items.filter((v) => v.made && eraOf(v.made.year) === e).length);
}

export default function EraBars({ items, className = "" }: { items: Value[]; className?: string }) {
  const counts = countByEra(items);
  const max = Math.max(1, ...counts);
  const step = max > 24 ? 10 : max > 10 ? 5 : max > 4 ? 2 : 1;
  const gridMax = Math.ceil(max / step) * step;
  const barMax = W - LABEL_W - NUM_W;
  const x = (n: number) => LABEL_W + (n / gridMax) * barMax;
  const baseY = TOP + ROW * ERAS.length;
  const H = baseY + 36;
  const ticks: number[] = [];
  for (let t = 0; t <= gridMax; t += step) ticks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="製造時代別の出荷数">
      <defs>
        <pattern id="era-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1" fill="var(--vl-red-deep)" />
        </pattern>
      </defs>
      {/* 目盛（点線） */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={TOP - 4} x2={x(t)} y2={baseY} stroke={LINE} strokeWidth="0.8" strokeDasharray="2 2.5" />
          <text x={x(t)} y={baseY + 15} textAnchor="middle" fontSize="11" fill={INK} fontFamily={COURIER}>
            {t}
          </text>
        </g>
      ))}

      {ERAS.map((e, i) => {
        const y = TOP + i * ROW + 4;
        const n = counts[i];
        const w = (n / gridMax) * barMax;
        return (
          <g key={e.from}>
            <text x={0} y={y + 11} fontSize="14" fontWeight="700" fill={INK} fontFamily="var(--font-zen-kaku), sans-serif">
              {e.ja}
            </text>
            <text x={0} y={y + 25} fontSize="11" fill={SOFT} fontFamily={COURIER}>
              {e.from}–{e.to === 2030 ? "" : e.to}
            </text>
            {n > 0 && (
              <>
                {/* 棒は赤の面に網点を重ねる（影は付けない＝長さを飾りで変えない） */}
                <rect x={LABEL_W} y={y} width={w} height={BAR_H} fill={RED} stroke={INK} strokeWidth="1.5" />
                <rect x={LABEL_W} y={y} width={w} height={BAR_H} fill="url(#era-dots)" />
              </>
            )}
            <text
              x={LABEL_W + w + (n > 0 ? 10 : 4)}
              y={y + BAR_H - 2}
              fontSize="22"
              fill={n > 0 ? INK : SOFT}
              fontFamily={ANTON}
            >
              {n}
            </text>
          </g>
        );
      })}

      {/* 軸 */}
      <line x1={LABEL_W} y1={TOP - 4} x2={LABEL_W} y2={baseY} stroke={INK} strokeWidth="2" />
      <line x1={LABEL_W - 1} y1={baseY} x2={W} y2={baseY} stroke={INK} strokeWidth="2" />
      <text
        x={W}
        y={H - 3}
        textAnchor="end"
        fontSize="11"
        fill={RED}
        fontFamily={COURIER}
        letterSpacing="0.8"
      >
        FIG.1 SHIPMENTS BY FACTORY
      </text>
    </svg>
  );
}
