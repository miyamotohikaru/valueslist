import { Fragment } from "react";
import type { Metadata } from "next";
import { lineages } from "@/data/lineages";
import LineageIndex from "@/components/LineageIndex";
import LineageDiagram from "@/components/LineageDiagram";

export const metadata: Metadata = {
  title: "系譜 | 価値観一覧図鑑",
  description: "廃番になった価値観が､別の名前で再入荷するまでの道筋｡系譜ごとに層へ分解して並べる｡",
};

export default function LineagePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出しと目次 */}
      <section className="grid gap-5 py-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-12">
        <div>
          <h1 className="font-display-ja text-[26px] leading-[1.1] md:mt-4 md:text-[64px]">系譜</h1>
          <p className="font-display-en mt-1 text-[22px] leading-[1] tracking-[0.01em] text-vl-red md:vl-misreg md:mt-2 md:text-[92px] md:leading-[0.86]">
            BACK IN STOCK
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

      <div className="h-12 md:h-20" />
    </div>
  );
}
