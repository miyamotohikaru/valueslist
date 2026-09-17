import { Fragment } from "react";
import Link from "next/link";
import type { Value } from "@/data/types";
import { categoryMeta, evidenceMeta } from "@/data/shelves";
import SpanStrip from "./SpanStrip";
import TrendStamp from "./TrendStamp";
import Illust, { hasIllust } from "./illust";

export const SHELF_ACCENT: Record<string, { bg: string; fg: string; bar: string }> = {
  "1": { bg: "var(--vl-brown)", fg: "var(--vl-paper)", bar: "var(--vl-brown)" },
  "2": { bg: "var(--vl-navy)", fg: "var(--vl-paper)", bar: "var(--vl-navy)" },
  // からしは淡いので、棒には墨の縁を付けて帯と同じ色で描く（SpanStrip の outline）
  "3": { bg: "var(--vl-mustard)", fg: "var(--vl-ink)", bar: "var(--vl-mustard)" },
  "4": { bg: "var(--vl-red)", fg: "var(--vl-paper)", bar: "var(--vl-red)" },
  "5": { bg: "var(--vl-teal)", fg: "var(--vl-paper)", bar: "var(--vl-teal)" },
  meta: { bg: "var(--vl-ink)", fg: "var(--vl-mustard)", bar: "var(--vl-ink)" },
};

/** 商品名を読点のあとで行に分ける（「夫は外で働き、／妻は家庭を守る」） */
export function nameLines(name: string): string[] {
  return name.split(/(?<=、)/).filter(Boolean);
}

/** 行の見た目の幅（全角=1、半角の英数字=0.55） */
function visualLen(s: string) {
  let n = 0;
  for (const ch of s) n += /[\x20-\x7e]/.test(ch) ? 0.55 : 1;
  return n;
}

/** 互換のため残す（旧 API）。最長行の文字数から cqw を返す */
export function nameSize(name: string) {
  const n = Math.max(...nameLines(name).map(visualLen));
  return Math.min(12, 84 / Math.max(n, 1));
}

export default function ValueCard({ v, index = 0 }: { v: Value; index?: number }) {
  const acc = SHELF_ACCENT[String(v.shelf)];
  const lines = nameLines(v.name);
  const longest = Math.max(...lines.map(visualLen));
  // 縦長カード: カード幅に比例（1行に収まる大きさ）。行カード: px で上限を持つ
  const nameV = `${Math.min(11.5, 84 / Math.max(longest, 1)).toFixed(2)}cqw`;
  const nameR = `${Math.min(26, Math.floor(262 / Math.max(longest, 1)))}px`;
  const second = v.restocked
    ? { k: "RESTOCK", t: v.restocked.label }
    : v.discontinued
      ? { k: "DISC.", t: v.discontinued.label }
      : { k: "NOW", t: "現役" };

  const illust = hasIllust(v.no);

  return (
    <Link
      href={`/values/${v.no}`}
      className="vl-card-wrap vl-rise group"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <article
        className={`vl-card vl-offset${illust ? " vl-card--illust" : ""}`}
        style={{ ["--band-bg" as string]: acc.bg, ["--band-fg" as string]: acc.fg, ["--name-v" as string]: nameV, ["--name-r" as string]: nameR }}
      >
        <header className="vl-card__band">
          <span className="vl-card__no">
            <span className="vl-card__no-k">NO.</span>
            {v.no}
          </span>
          <span className="vl-card__cat">
            {v.category}
            <span className="vl-card__cat-en"> · {categoryMeta[v.category].en}</span>
          </span>
        </header>

        <div className="vl-card__body">
          {illust && (
            <div className="vl-card__illust" aria-hidden>
              <Illust no={v.no} />
            </div>
          )}
          <div className="vl-card__head">
            <p className="vl-card__en">{v.en}</p>
            <h3 className="vl-card__name">
              {lines.map((l, i) => (
                <Fragment key={i}>
                  <span className="block">{l}</span>
                </Fragment>
              ))}
            </h3>
            <p className="vl-card__reading">{v.reading}</p>
          </div>

          <div className="vl-card__stamp">
            <TrendStamp trend={v.trend} seed={v.no} />
          </div>

          <div className="vl-card__facts">
            <SpanStrip v={v} accent={acc.bar} outline={v.shelf === 3} showLabels={false} />
            <dl className="vl-card__dates">
              <dt>MFD.</dt>
              <dd>{v.made?.label ?? "—"}</dd>
              <dt>{second.k}</dt>
              <dd>{second.t}</dd>
            </dl>
          </div>

          <p className="vl-card__hitokoto">{v.hitokoto}</p>
        </div>
        <span className="sr-only">{evidenceMeta[v.evidence].ja}</span>
      </article>
    </Link>
  );
}
