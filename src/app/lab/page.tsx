import type { Metadata } from "next";
import Illust from "@/components/illust";
import ValueCard from "@/components/ValueCard";
import { values } from "@/data/values";

export const metadata: Metadata = {
  title: "図版の下見 | 価値観一覧図鑑",
  robots: { index: false, follow: false },
};

/** 図版（イラスト）の下見用。索引からは辿れない。方向が決まったら消す */
export default function LabPage() {
  const items = values.filter((v) => ["001", "002", "003", "004"].includes(v.no));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <p className="font-type text-[12px] font-bold tracking-[0.12em] text-vl-red-deep">PREVIEW · 図版の下見</p>
      <h1 className="font-display-ja mt-2 text-[30px] md:text-[40px]">イラストの下見（NO.001〜004）</h1>
      <p className="mt-3 max-w-[40em] text-[15px] leading-[1.9]">
        アメリカンレトロの2色刷りを想定した図版です。
        <br />
        色は墨・クリーム・朱の3色だけで、面の陰影は網点で作っています。
      </p>

      {/* 大きく */}
      <section className="mt-10">
        <p className="text-[13px] font-bold text-vl-ink-soft">1. 大きく見る（220px）</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((v) => (
            <figure key={v.no} className="vl-offset border-2 border-vl-ink bg-vl-card p-4">
              <Illust no={v.no} className="block h-auto w-full" />
              <figcaption className="mt-2 border-t-2 border-vl-ink pt-2 text-[13px] font-bold">
                NO.{v.no} {v.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 濃い地の上 */}
      <section className="mt-12">
        <p className="text-[13px] font-bold text-vl-ink-soft">2. 濃い地の上（帯やポスターに置いたとき）</p>
        <div className="mt-4 grid gap-6 border-2 border-vl-ink bg-vl-ink p-6 sm:grid-cols-4">
          {items.map((v) => (
            <div key={v.no} className="bg-vl-card p-2">
              <Illust no={v.no} className="block h-auto w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* カードの中 */}
      <section className="mt-12">
        <p className="text-[13px] font-bold text-vl-ink-soft">3. カードに入れたとき（PC の4列・携帯の1列）</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((v, i) => (
            <ValueCard key={v.no} v={v} index={i} />
          ))}
        </div>
        <div className="mt-6 grid max-w-[420px] gap-5">
          {items.slice(0, 2).map((v, i) => (
            <ValueCard key={v.no} v={v} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
