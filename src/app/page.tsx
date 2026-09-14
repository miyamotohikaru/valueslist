import { values, stats } from "@/data/values";
import { trendMeta } from "@/data/shelves";
import IndexView from "@/components/IndexView";
import ExplodedCard from "@/components/ExplodedCard";
import TrendStamp from "@/components/TrendStamp";
import type { Trend } from "@/data/types";

const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* ヒーロー */}
      <section className="relative grid gap-8 py-10 md:grid-cols-[1.15fr_1fr] md:items-center md:py-16">
        <div>
          <p className="font-type text-[11px] tracking-[0.35em] text-vl-ink-soft">
            情報を並べるシリーズ 14 · SERIES No.14
          </p>
          <h1 className="font-display-ja mt-4 text-[40px] leading-[1.05] md:text-[64px]">価値観一覧図鑑</h1>
          <p className="font-display-en mt-2 text-[64px] leading-[0.86] tracking-[0.01em] text-vl-red md:text-[112px]">
            VALUES
            <br />
            CATALOG
          </p>
          <p className="mt-6 text-[16px] font-bold leading-relaxed md:text-[19px]">
            その価値観には、製造年がある。
          </p>
          <p className="mt-3 max-w-[44ch] text-[13px] leading-[1.9] text-vl-ink-soft md:text-[14px]">
            「昔からの伝統」に見える価値観には、
            <br />
            明治の翻訳語や、高度成長期の新製品が少なくない。
            <br />
            逆に、いちばん新しく見える言葉が、
            <br className="md:hidden" />
            150年前の在庫の再出荷だったりする。
            <br />
            日本の価値観を、製造・廃番・再入荷の年で棚に並べ、
            <br className="md:hidden" />
            一つずつ出典で裏を取った。
          </p>

          {/* 在庫の数字 */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [stats.total, "ITEMS", "在庫"],
              [5, "SHELVES", "棚"],
              [stats.law, "DOCUMENTS", "法令・初出で特定"],
              [stats.curve, "CURVES", "統計で追跡"],
            ].map(([n, en, ja]) => (
              <div key={String(en)} className="vl-offset-sm border-2 border-vl-ink bg-vl-card px-3 py-2">
                <p className="font-display-en text-[24px] leading-none">{n}</p>
                <p className="font-type mt-1 text-[8px] tracking-[0.15em] text-vl-ink-soft">
                  {en} · {ja}
                </p>
              </div>
            ))}
          </div>

          {/* 印の凡例 */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
            <span className="font-type tracking-[0.2em] text-vl-ink-soft">傾向の印</span>
            {TRENDS.map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <TrendStamp trend={t} className="text-[8px]" />
                <span>{trendMeta[t].ja}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <ExplodedCard className="mx-auto w-full max-w-[420px]" />
          <span className="font-script absolute -top-2 right-4 rotate-[-8deg] text-[26px] text-vl-red md:text-[30px]">
            fact-checked!
          </span>
        </div>
      </section>

      <div className="vl-rule" />

      <IndexView values={values} />
    </div>
  );
}
