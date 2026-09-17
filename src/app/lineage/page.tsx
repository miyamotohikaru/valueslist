import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { lineages } from "@/data/lineages";
import LineageIndex from "@/components/LineageIndex";
import LineageDiagram from "@/components/LineageDiagram";
import MobileBreak from "@/components/MobileBreak";

export const metadata: Metadata = {
  title: "系譜 | 価値観一覧図鑑",
  description: "廃番になった価値観が、別の名前で再入荷するまでの道筋。系譜ごとに層へ分解して並べる。",
};

export default function LineagePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出しと目次 */}
      <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-12 md:py-16">
        <div>
          <h1 className="font-display-ja mt-4 text-[40px] leading-[1.05] md:text-[64px]">系譜</h1>
          <p className="font-display-en vl-misreg mt-2 text-[56px] leading-[0.86] tracking-[0.01em] text-vl-red md:text-[92px]">
            BACK IN STOCK
          </p>
          <p className="font-display-ja mt-6 text-[20px] leading-snug md:text-[24px]">
            価値観は、
            <MobileBreak />
            名前を変えて棚に戻ってくる。
          </p>
          <p className="mt-4 text-[15px] leading-[1.9]">
            近世の在庫が、輸入品のパッケージで帰ってくる。
            <br />
            同じものに、時代ごとに別の名札が付く。
            <br />
            その道筋を、古い順に層へ分解して並べる。
            <br />
            直系でないものは、そう書いてある。
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
      <div className="grid gap-5 py-14 md:grid-cols-2 md:gap-6 md:py-20">
        <Link
          href="/timeline"
          className="vl-offset flex items-center justify-between gap-4 border-2 border-vl-ink bg-vl-red px-5 py-5 text-vl-paper transition-transform hover:-translate-y-0.5 md:px-7 md:py-6"
        >
          <span>
            <span className="font-display-ja mt-1 block text-[24px] leading-none md:text-[28px]">年表へ</span>
          </span>
          <span className="text-[36px] leading-none font-bold">→</span>
        </Link>
        <Link
          href="/"
          className="vl-offset flex items-center justify-between gap-4 border-2 border-vl-ink bg-vl-card px-5 py-5 transition-transform hover:-translate-y-0.5 md:px-7 md:py-6"
        >
          <span>
            <span className="font-display-ja mt-1 block text-[24px] leading-none md:text-[28px]">索引へ</span>
          </span>
          <span className="text-[36px] leading-none font-bold">→</span>
        </Link>
      </div>
    </div>
  );
}
