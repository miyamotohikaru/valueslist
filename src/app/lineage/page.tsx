import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { lineages } from "@/data/lineages";
import LineageIndex from "@/components/LineageIndex";
import LineageDiagram from "@/components/LineageDiagram";

export const metadata: Metadata = {
  title: "系譜 | 価値観一覧図鑑",
  description: "廃番になった価値観が、別の名前で再入荷するまでの道筋。系譜ごとに層へ分解して並べる。",
};

export default function LineagePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出しと目次 */}
      <section className="grid gap-10 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end md:gap-12 md:py-16">
        <div>
          <p className="font-type text-[11px] tracking-[0.35em] text-vl-ink-soft">LINEAGE · 再入荷の系譜</p>
          <h1 className="font-display-ja mt-4 text-[40px] leading-[1.05] md:text-[64px]">系譜</h1>
          <p className="font-display-en mt-2 text-[56px] leading-[0.86] tracking-[0.01em] text-vl-red md:text-[92px]">
            BACK IN STOCK
          </p>
          <p className="mt-6 text-[16px] font-bold leading-relaxed md:text-[19px]">
            廃番になった価値観は、
            <br className="md:hidden" />
            しばしば別の名前で再入荷する。
          </p>
          <p className="mt-3 text-[13px] leading-[1.9] text-vl-ink-soft md:text-[14px]">
            近世の在庫が、輸入品のパッケージで帰ってくる。
            <br />
            150年前の廃番が、流行語として棚に戻る。
            <br />
            その道筋を、古い順に層へ分解して並べる。
          </p>
        </div>
        <LineageIndex lineages={lineages} />
      </section>

      <div className="vl-rule" />

      {/* 系譜ごとの分解図 */}
      {lineages.map((l, i) => (
        <Fragment key={l.id}>
          <LineageDiagram lineage={l} index={i} />
          <div className="vl-rule" />
        </Fragment>
      ))}

      {/* 次へ */}
      <div className="flex flex-wrap gap-4 py-12">
        <Link
          href="/timeline"
          className="vl-offset-sm border-2 border-vl-ink bg-vl-card px-6 py-3 transition-colors hover:bg-vl-mustard"
        >
          <span className="block text-[14px] font-bold tracking-[0.15em]">年表へ →</span>
          <span className="font-type mt-1 block text-[9px] tracking-[0.25em] text-vl-ink-soft">TIMELINE</span>
        </Link>
        <Link
          href="/"
          className="vl-offset-sm border-2 border-vl-ink bg-vl-card px-6 py-3 transition-colors hover:bg-vl-mustard"
        >
          <span className="block text-[14px] font-bold tracking-[0.15em]">索引へ →</span>
          <span className="font-type mt-1 block text-[9px] tracking-[0.25em] text-vl-ink-soft">INDEX</span>
        </Link>
      </div>
    </div>
  );
}
