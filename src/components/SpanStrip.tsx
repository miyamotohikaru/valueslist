import type { Value } from "@/data/types";
import { scaleYear, ERAS, ERA_MAX } from "@/lib/timescale";

/**
 * カード面の小さな年表。製造→廃番（または現在）を太い帯で、再入荷を赤い点で描く。
 * 幅は親に合わせる（viewBox 100 x 14）。
 */
export default function SpanStrip({
  v,
  accent = "var(--vl-ink)",
  showLabels = true,
}: {
  v: Value;
  accent?: string;
  showLabels?: boolean;
}) {
  const start = v.made ? scaleYear(v.made.year) * 100 : 0;
  const endYear = v.discontinued ? v.discontinued.year : ERA_MAX;
  const end = scaleYear(endYear) * 100;
  const restock = v.restocked ? scaleYear(v.restocked.year) * 100 : null;
  const approx = v.made?.approx;
  // パターンの id は色ごとに分ける（同じ id が複数あると最初の色で全カードが塗られる）
  const hatchId = `vl-hatch-${accent.replace(/[^a-z0-9]/gi, "")}`;
  // 制度は廃止されたが、価値観としては残っている（傾向が「廃番」ではない）
  const persists = !!v.discontinued && v.trend !== "discontinued" && !v.restocked;
  const barY = 4;
  const barH = 4;
  return (
    <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="block h-[3.6em] w-full" aria-hidden>
      <defs>
        <pattern id={hatchId} width="1.6" height="4" patternUnits="userSpaceOnUse">
          <rect width="0.8" height="4" fill={accent} />
        </pattern>
      </defs>
      {/* 基線 */}
      <line x1="0" y1={barY + barH / 2} x2="100" y2={barY + barH / 2} stroke="var(--vl-line)" strokeWidth="0.6" />
      {/* 時代の目盛 */}
      {ERAS.map((e) => (
        <line
          key={e.from}
          x1={scaleYear(e.from) * 100}
          y1={barY - 1.2}
          x2={scaleYear(e.from) * 100}
          y2={barY + barH + 1.2}
          stroke="var(--vl-line)"
          strokeWidth="0.5"
        />
      ))}
      {/* 現役の帯 */}
      {v.made && (
        <>
          {approx && (
            <rect x={Math.max(0, start - 6)} y={barY} width={6} height={barH} fill={`url(#${hatchId})`} />
          )}
          <rect x={start} y={barY} width={Math.max(0.8, end - start)} height={barH} fill={accent} />
          {v.discontinued ? (
            <g stroke="var(--vl-red)" strokeWidth="1.1" strokeLinecap="round">
              <line x1={end - 1.6} y1={barY - 1} x2={end + 1.6} y2={barY + barH + 1} />
              <line x1={end + 1.6} y1={barY - 1} x2={end - 1.6} y2={barY + barH + 1} />
            </g>
          ) : (
            <polygon
              points={`${end - 2.2},${barY - 0.8} ${end + 0.6},${barY + barH / 2} ${end - 2.2},${barY + barH + 0.8}`}
              fill={accent}
            />
          )}
        </>
      )}
      {/* 制度の廃止後も残る */}
      {v.made && persists && (
        <g opacity="0.8">
          <line
            x1={Math.min(97, end + 2)}
            y1={barY + barH / 2}
            x2={98}
            y2={barY + barH / 2}
            stroke={accent}
            strokeWidth="0.9"
            strokeDasharray="1.3 1.1"
          />
          <polygon points={`97.4,${barY + barH / 2 - 1.5} 100,${barY + barH / 2} 97.4,${barY + barH / 2 + 1.5}`} fill={accent} />
        </g>
      )}
      {/* 再入荷 */}
      {restock !== null && (
        <g>
          <line
            x1={end}
            y1={barY + barH / 2}
            x2={restock}
            y2={barY + barH / 2}
            stroke="var(--vl-red)"
            strokeWidth="0.8"
            strokeDasharray="1.2 1.2"
          />
          <circle cx={restock} cy={barY + barH / 2} r="2.1" fill="var(--vl-red)" />
          <circle cx={restock} cy={barY + barH / 2} r="0.8" fill="var(--vl-paper)" />
        </g>
      )}
      {/* 時代ラベル */}
      {showLabels &&
        ERAS.map((e) => (
          <text
            key={e.ja}
            x={scaleYear(e.from) * 100 + 0.8}
            y={12.6}
            fontSize="2.4"
            fill="var(--vl-ink-soft)"
            fontFamily="var(--font-courier), monospace"
            letterSpacing="0.05"
          >
            {e.ja}
          </text>
        ))}
    </svg>
  );
}
