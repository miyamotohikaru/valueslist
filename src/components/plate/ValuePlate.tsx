import Link from "next/link";
import type { Value } from "@/data/types";
import { categoryMeta, evidenceMeta } from "@/data/shelves";
import { SHELF_ACCENT, nameLines } from "../ValueCard";
import TrendStamp from "../TrendStamp";
import SpanStrip from "../SpanStrip";
import { PLATE_ART } from "./index";
import Illust, { hasIllust } from "../illust";

/**
 * 札の面｡大きさは ID-1（85.60×53.98mm）の横型にそろえる｡
 * 左に図版､右に名前と年｡文字はカードの幅に比例させる（cqw）｡
 */
function PawMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="currentColor">
        <ellipse cx="50" cy="62" rx="26" ry="22" />
        <ellipse cx="25" cy="34" rx="10" ry="13" />
        <ellipse cx="43" cy="24" rx="9.5" ry="13" />
        <ellipse cx="61" cy="24" rx="9.5" ry="13" />
        <ellipse cx="78" cy="34" rx="10" ry="13" />
      </g>
    </svg>
  );
}

export default function ValuePlate({
  v,
  index = 0,
  interactive = true,
}: {
  v: Value;
  index?: number;
  interactive?: boolean;
}) {
  const acc = SHELF_ACCENT[String(v.shelf)];
  const Art = PLATE_ART[v.no];
  // 商品名は読点で2行に割り､長い行に合わせて大きさを決める
  const lines = nameLines(v.name);
  const nameLen = Math.max(...lines.map((l) => [...l].reduce((a, ch) => a + (/[\x20-\x7e]/.test(ch) ? 0.55 : 1), 0)));
  const from = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  const to = v.discontinued ? String(v.discontinued.year) : v.restocked ? String(v.restocked.year) : "いま";

  const body = (
    <article
      className="vl-plate vl-offset"
      style={{
        ["--plate-bg" as string]: acc.bg,
        ["--plate-fg" as string]: acc.fg,
        ["--name-len" as string]: nameLen.toFixed(1),
      }}
    >
      <header className="vl-plate__top">
        <span className="vl-plate__no">
          <span className="vl-plate__no-k">NO.</span>
          {v.no}
        </span>
        <span className="vl-plate__cat">
          {v.category}
          <span className="vl-plate__cat-en"> · {categoryMeta[v.category].en}</span>
        </span>
      </header>

      <div className="vl-plate__art">
        <div className="vl-dots-fine vl-plate__art-dots" aria-hidden />
        {Art ? (
          <Art className="vl-plate__art-svg" />
        ) : hasIllust(v.no) ? (
          <Illust no={v.no} className="vl-plate__art-svg" />
        ) : (
          <PawMark className="vl-plate__art-paw" />
        )}
      </div>

      <div className="vl-plate__main">
        <p className="vl-plate__en">{v.en}</p>
        <h3 className="vl-plate__name">
          {lines.map((l, k) => (
            <span key={k} className="block">
              {l}
            </span>
          ))}
        </h3>
        <p className="vl-plate__reading">{v.reading}</p>
        <div className="vl-plate__span">
          <SpanStrip v={v} accent="currentColor" outline={false} showLabels={false} />
        </div>
        <p className="vl-plate__years">
          <span>{from}</span>
          <span aria-hidden>—</span>
          <span>{to}</span>
          <span className="vl-plate__stamp">
            <TrendStamp trend={v.trend} seed={v.no} />
          </span>
        </p>
      </div>

      <span className="sr-only">{evidenceMeta[v.evidence].ja}</span>
    </article>
  );

  if (!interactive) {
    return (
      <div className="vl-card-wrap" aria-hidden>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/values/${v.no}`}
      className="vl-card-wrap vl-rise group"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      {body}
    </Link>
  );
}
