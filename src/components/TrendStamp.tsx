import type { Trend } from "@/data/types";
import { trendMeta } from "@/data/shelves";

/**
 * 傾向の印。5種とも同じ造形のゴム印（角丸の二重枠＋かすれ）で、色だけで区別する。
 * 大きさは親の font-size（em）基準。傾きは seed（型番など）から -7〜+5deg で決める。
 */
const COLOR: Record<Trend, string> = {
  up: "var(--vl-teal)",
  steady: "var(--vl-navy)",
  down: "var(--vl-brown)",
  discontinued: "var(--vl-red)",
  restocked: "var(--vl-red)",
};

export function stampTilt(seed?: string) {
  if (!seed) return -4;
  let h = 7;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return -7 + (h % 13);
}

export default function TrendStamp({
  trend,
  className = "",
  seed,
  ja = false,
}: {
  trend: Trend;
  className?: string;
  /** 傾きを決める種（型番など） */
  seed?: string;
  /** 和文のラベルも添える */
  ja?: boolean;
}) {
  const m = trendMeta[trend];
  return (
    <span
      className={`vl-trend-stamp ${className}`}
      style={{ color: COLOR[trend], transform: `rotate(${stampTilt(seed)}deg)` }}
      aria-label={`${m.ja}（${m.en}）`}
    >
      <span className="vl-trend-stamp__mark" aria-hidden>
        {m.mark}
      </span>
      <span className="font-display-en">{m.en}</span>
      {ja && <span className="vl-trend-stamp__ja">{m.ja}</span>}
    </span>
  );
}
