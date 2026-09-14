import type { Trend } from "@/data/types";
import { trendMeta } from "@/data/shelves";

const TONE: Record<string, { bg: string; fg: string; ink: string }> = {
  teal: { bg: "var(--vl-teal)", fg: "var(--vl-paper)", ink: "var(--vl-teal)" },
  navy: { bg: "var(--vl-navy)", fg: "var(--vl-paper)", ink: "var(--vl-navy)" },
  mustard: { bg: "var(--vl-mustard)", fg: "var(--vl-ink)", ink: "var(--vl-brown)" },
  red: { bg: "var(--vl-red)", fg: "var(--vl-paper)", ink: "var(--vl-red)" },
};

/**
 * 傾向の印。
 * 廃番＝ゴム印（傾いた二重枠）／それ以外＝塗りの札。
 * size は cqw 比例で使いたいので数値は em 基準にし、親で font-size を決める。
 */
export default function TrendStamp({ trend, className = "" }: { trend: Trend; className?: string }) {
  const m = trendMeta[trend];
  const t = TONE[m.tone];
  if (trend === "discontinued") {
    return (
      <span
        className={`vl-stamp font-display-en whitespace-nowrap ${className}`}
        style={{ color: t.ink, fontSize: "1em" }}
        aria-label={`${m.ja} ${m.en}`}
      >
        <span className="mr-[0.3em] text-[1.15em] leading-none">{m.mark}</span>
        <span className="text-[0.95em]">{m.en}</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-[0.35em] whitespace-nowrap rounded-full pr-[0.7em] pl-[0.25em] py-[0.18em] ${className}`}
      style={{ background: t.bg, color: t.fg, fontSize: "1em" }}
      aria-label={`${m.ja} ${m.en}`}
    >
      <span
        className="grid h-[1.5em] w-[1.5em] place-items-center rounded-full text-[1em] font-bold leading-none"
        style={{ background: t.fg, color: t.bg }}
      >
        {m.mark}
      </span>
      <span className="font-display-en text-[0.95em] leading-none tracking-[0.1em]">{m.en}</span>
    </span>
  );
}
