import Link from "next/link";
import type { Value } from "@/data/types";
import { categoryMeta, evidenceMeta } from "@/data/shelves";
import { SHELF_ACCENT } from "../ValueCard";
import TrendStamp from "../TrendStamp";
import { PLATE_ART } from "./index";

/**
 * 新しい札の面｡棚の色を地にして､真ん中に図版を置く｡
 * 大きさはカードの幅に比例させる（cqw）ので､扇の中でも開いた先でも同じ形で出る｡
 */
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
  const from = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  const to = v.discontinued ? String(v.discontinued.year) : v.restocked ? String(v.restocked.year) : "いま";

  const body = (
    <article
      className="vl-plate vl-offset"
      style={{ ["--plate-bg" as string]: acc.bg, ["--plate-fg" as string]: acc.fg }}
    >
      <header className="vl-plate__top">
        <span className="vl-plate__no">
          <span className="vl-plate__no-k">NO.</span>
          {v.no}
        </span>
        <span className="vl-plate__stamp">
          <TrendStamp trend={v.trend} seed={v.no} />
        </span>
      </header>

      <p className="vl-plate__years">
        {from} — {to}
      </p>

      <div className="vl-plate__art">
        <div className="vl-dots-fine vl-plate__art-dots" aria-hidden />
        {Art && <Art className="vl-plate__art-svg" />}
      </div>

      <div className="vl-plate__id">
        <p className="vl-plate__reading">{v.reading}</p>
        <h3 className="vl-plate__name">{v.name}</h3>
        <p className="vl-plate__en">{v.en}</p>
      </div>

      <p className="vl-plate__foot">{v.hitokoto}</p>
      <span className="sr-only">
        {v.category} · {categoryMeta[v.category].en} / {evidenceMeta[v.evidence].ja}
      </span>
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
