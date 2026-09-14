import Link from "next/link";
import type { Value } from "@/data/types";
import { categoryMeta, evidenceMeta } from "@/data/shelves";
import SpanStrip from "./SpanStrip";
import TrendStamp from "./TrendStamp";

export const SHELF_ACCENT: Record<string, { bg: string; fg: string; bar: string }> = {
  "1": { bg: "var(--vl-brown)", fg: "var(--vl-paper)", bar: "var(--vl-brown)" },
  "2": { bg: "var(--vl-navy)", fg: "var(--vl-paper)", bar: "var(--vl-navy)" },
  "3": { bg: "var(--vl-mustard)", fg: "var(--vl-ink)", bar: "var(--vl-brown)" },
  "4": { bg: "var(--vl-red)", fg: "var(--vl-paper)", bar: "var(--vl-red)" },
  "5": { bg: "var(--vl-teal)", fg: "var(--vl-paper)", bar: "var(--vl-teal)" },
  meta: { bg: "var(--vl-ink)", fg: "var(--vl-mustard)", bar: "var(--vl-ink)" },
};

/** 商品名の文字数に応じて cqw を決める（1行〜2行に収める） */
export function nameSize(name: string) {
  const n = name.length;
  if (n <= 4) return 13;
  if (n <= 6) return 11.5;
  if (n <= 8) return 10;
  if (n <= 12) return 8.6;
  return 7.6;
}

export default function ValueCard({ v, index = 0 }: { v: Value; index?: number }) {
  const acc = SHELF_ACCENT[String(v.shelf)];
  return (
    <Link
      href={`/values/${v.no}`}
      className="vl-rise group block"
      style={{ containerType: "inline-size", animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <article className="vl-offset relative flex aspect-[4/5] flex-col border-2 border-vl-ink bg-vl-card transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
        {/* 型番の帯 */}
        <div
          className="font-type flex items-center justify-between px-[4.5cqw] py-[2.4cqw] text-[4cqw] font-bold tracking-[0.16em]"
          style={{ background: acc.bg, color: acc.fg }}
        >
          <span>NO.{v.no}</span>
          <span className="text-[3.4cqw] opacity-90">
            {v.category} · {categoryMeta[v.category].en}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-[5.5cqw] pt-[4.5cqw] pb-[4.5cqw]">
          <p className="font-display-en text-[4.6cqw] uppercase leading-none tracking-[0.1em] text-vl-red">
            {v.en}
          </p>
          <h3
            className="font-display-ja mt-[2cqw] leading-[1.18]"
            style={{ fontSize: `${nameSize(v.name)}cqw` }}
          >
            {v.name}
          </h3>
          <p className="font-type mt-[1.2cqw] text-[3.1cqw] tracking-[0.12em] text-vl-ink-soft">{v.reading}</p>

          {/* 傾向の印（商品名と年表のあいだ、右寄せ） */}
          <div className="mt-[3cqw] flex justify-end pr-[1cqw]">
            <TrendStamp trend={v.trend} className="text-[3.7cqw]" />
          </div>

          <div className="mt-auto">
            <p className="font-type text-[2.7cqw] tracking-[0.22em] text-vl-ink-soft">
              {evidenceMeta[v.evidence].en}
            </p>
            <SpanStrip v={v} accent={acc.bar} />
            <dl className="font-type mt-[1.2cqw] grid grid-cols-[auto_1fr] gap-x-[2.5cqw] gap-y-[0.6cqw] text-[3.6cqw] leading-[1.35]">
              <dt className="text-vl-ink-soft">MFD.</dt>
              <dd className="truncate font-bold">{v.made?.label ?? "—"}</dd>
              <dt className="text-vl-ink-soft">{v.restocked ? "RESTOCK" : "DISC."}</dt>
              <dd className="truncate font-bold">
                {v.restocked ? v.restocked.label : (v.discontinued?.label ?? "現役")}
              </dd>
            </dl>
            <p className="mt-[3.2cqw] border-t border-vl-line pt-[2.8cqw] text-[3.9cqw] leading-[1.55]">
              {v.hitokoto}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
