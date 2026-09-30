import type { Trend } from "@/data/types";
import { trendMeta } from "@/data/shelves";
import type { Lang } from "@/i18n/lang";
import { trendName } from "@/i18n/ui.about";

/**
 * 傾向の印｡5種とも同じ造形のゴム印（角丸の二重枠＋かすれ）で､色だけで区別する｡
 * 大きさは親の font-size（em）基準｡傾きは seed（型番など）から -7〜+5deg で決める｡
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
  lang = "ja",
}: {
  trend: Trend;
  className?: string;
  /** 傾きを決める種（型番など） */
  seed?: string;
  /** 和文のラベルも添える */
  ja?: boolean;
  /** 添える言葉の言語｡指定が無いときは日本語 */
  lang?: Lang;
}) {
  const m = trendMeta[trend];
  const label = trendName(lang, trend);
  return (
    <span
      className={`vl-trend-stamp ${className}`}
      style={{ color: COLOR[trend], transform: `rotate(${stampTilt(seed)}deg)` }}
      aria-label={lang === "ja" ? `${label}(${m.en})` : label}
    >
      <span className="vl-trend-stamp__mark" aria-hidden>
        {m.mark}
      </span>
      <span className="font-display-en">{m.en}</span>
      {ja && <span className="vl-trend-stamp__ja">{label}</span>}
    </span>
  );
}
