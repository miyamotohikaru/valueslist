import type { Value } from "@/data/types";
import { scaleYear, ERAS, ERA_MAX } from "@/lib/timescale";

/**
 * 小さな年表｡製造→廃番（または現在）を帯で､廃番を赤い×､再入荷を赤い点で描く｡
 * 棒の形は SVG（viewBox 100×10､横に伸ばす）､時代のラベルは読める大きさで HTML に重ねる｡
 */
export default function SpanStrip({
  v,
  accent = "var(--vl-ink)",
  showLabels = true,
  outline = false,
}: {
  v: Value;
  accent?: string;
  showLabels?: boolean;
  /** 淡い色（からし）の棒に墨の縁を付ける */
  outline?: boolean;
}) {
  const start = v.made ? scaleYear(v.made.year) * 100 : 0;
  const endYear = v.discontinued ? v.discontinued.year : ERA_MAX;
  const end = scaleYear(endYear) * 100;
  const restock = v.restocked ? scaleYear(v.restocked.year) * 100 : null;
  const approx = v.made?.approx;
  // 制度は廃止されたが､価値観としては残っている（傾向が｢廃番｣ではない）
  const persists = !!v.discontinued && v.trend !== "discontinued" && !v.restocked;
  const hatchId = `vl-hatch-${accent.replace(/[^a-z0-9]/gi, "")}`;
  const mid = 5;
  const barH = 4.4;
  const barY = mid - barH / 2;
  const stroke = outline ? { stroke: "var(--vl-ink)", strokeWidth: 0.5 } : {};

  return (
    <div className="w-full">
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="block h-[2.1em] w-full" aria-hidden>
        <defs>
          <pattern id={hatchId} width="1.6" height="10" patternUnits="userSpaceOnUse">
            <rect width="0.8" height="10" fill={outline ? "var(--vl-ink)" : accent} />
          </pattern>
        </defs>
        <line x1="0" y1={mid} x2="100" y2={mid} stroke="var(--vl-line)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        {ERAS.slice(1).map((e) => (
          <line
            key={e.from}
            x1={scaleYear(e.from) * 100}
            y1={1}
            x2={scaleYear(e.from) * 100}
            y2={9}
            stroke="var(--vl-line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {v.made && (
          <>
            {approx && <rect x={Math.max(0, start - 6)} y={barY} width={6} height={barH} fill={`url(#${hatchId})`} />}
            <rect
              x={start}
              y={barY}
              width={Math.max(0.8, end - start)}
              height={barH}
              fill={accent}
              {...stroke}
              vectorEffect="non-scaling-stroke"
            />
            {v.discontinued ? (
              <g stroke="var(--vl-red)" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke">
                <line x1={end - 1.3} y1={0.8} x2={end + 1.3} y2={9.2} vectorEffect="non-scaling-stroke" />
                <line x1={end + 1.3} y1={0.8} x2={end - 1.3} y2={9.2} vectorEffect="non-scaling-stroke" />
              </g>
            ) : (
              <polygon points={`${end - 2},${barY - 1} ${end + 0.4},${mid} ${end - 2},${barY + barH + 1}`} fill={outline ? "var(--vl-ink)" : accent} />
            )}
          </>
        )}
        {v.made && persists && (
          <g opacity="0.85">
            <line
              x1={Math.min(97, end + 1.6)}
              y1={mid}
              x2={98}
              y2={mid}
              stroke={outline ? "var(--vl-ink)" : accent}
              strokeWidth="2"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            <polygon points={`97.6,${mid - 1.8} 100,${mid} 97.6,${mid + 1.8}`} fill={outline ? "var(--vl-ink)" : accent} />
          </g>
        )}
        {restock !== null && (
          <g>
            <line
              x1={end}
              y1={mid}
              x2={restock}
              y2={mid}
              stroke="var(--vl-red)"
              strokeWidth="2"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            <ellipse cx={restock} cy={mid} rx="1.5" ry="3.4" fill="var(--vl-red)" />
            <ellipse cx={restock} cy={mid} rx="0.55" ry="1.25" fill="var(--vl-paper)" />
          </g>
        )}
      </svg>
      {showLabels && (
        <div className="relative mt-1 h-[1.3em] text-[12px] leading-none text-vl-ink-soft">
          {ERAS.map((e, i) => (
            <span
              key={e.ja}
              className="absolute top-0 whitespace-nowrap"
              style={{ left: `${scaleYear(e.from) * 100}%`, transform: i === 0 ? "none" : "translateX(3px)" }}
            >
              {e.ja}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
