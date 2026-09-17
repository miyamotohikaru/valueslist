import { values, stats } from "@/data/values";
import { shelves, trendMeta } from "@/data/shelves";
import IndexView from "@/components/IndexView";
import ExplodedCard from "@/components/ExplodedCard";
import Emblem from "@/components/Emblem";
import TrendStamp from "@/components/TrendStamp";
import MobileBreak from "@/components/MobileBreak";
import TitleLockup from "@/components/TitleLockup";
import type { Trend } from "@/data/types";

const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];

export default function Home() {
  const earliest = Math.min(...values.map((v) => v.made?.year ?? 9999));
  const band = `★ ${stats.total} VALUES ★ ${shelves.filter((s) => s.id !== "meta").length} SHELVES ★ FACT-CHECKED ★ SINCE ${earliest} ★ 価値観一覧図鑑 `;

  return (
    <>
      <div className="mx-auto max-w-6xl overflow-x-clip px-4 md:px-8">
        <section className="relative grid gap-10 pt-8 pb-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-center md:gap-10 md:pt-14 md:pb-10">
          <div className="relative z-10">
            <p className="text-[13px] font-bold">情報を並べるシリーズ 14</p>
            <h1 className="mt-4">
              <TitleLockup />
            </h1>
            <p className="font-display-ja mt-6 text-[22px] leading-snug md:text-[26px]">その価値観には、製造年がある。</p>
            <p className="mt-4 max-w-[32em] text-[16px] leading-[1.95]">
              「昔からの伝統」に見える価値観には、
              <br />
              明治の翻訳語や、
              <MobileBreak />
              高度成長期の新製品が少なくない。
              <br />
              逆に、いちばん新しく見える言葉が、
              <br />
              150年前の在庫の再出荷だったりする。
              <br />
              日本の価値観を、
              <MobileBreak />
              製造・廃番・再入荷の年で棚に並べ、
              <br />
              一つずつ出典で裏を取った。
            </p>
          </div>

          {/* 右: サンバースト＋紋章＋分解図 */}
          <div className="relative mx-auto w-full max-w-[520px] pt-14 pb-10 md:mr-0 md:ml-auto md:pt-20 md:pb-0">
            {/* 放射は紋章から出す（理由のある光にする） */}
            <div
              className="vl-sunburst vl-sunburst-spin pointer-events-none absolute -top-[120px] -right-[90px] aspect-square w-[520px] text-vl-red opacity-[0.07]"
              aria-hidden
            />
            <div className="relative">
              <ExplodedCard className="relative block h-auto w-full" />
              {/* 紋章は図の上に貼ったシールとして、いちばん手前に置く */}
              <div className="absolute -top-14 right-0 z-10 rotate-[-12deg] md:-top-16 md:-right-4">
                <Emblem size={132} className="block h-auto w-[92px] md:w-[112px]" />
              </div>
              <span className="font-script absolute -bottom-1 left-0 rotate-[-8deg] text-[28px] text-vl-red md:bottom-4 md:text-[34px]">
                fact-checked!
              </span>
            </div>
          </div>
        </section>

        {/* 傾向の印 */}
        <div className="mt-8 mb-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:mb-16">
          <p className="text-[13px] font-bold whitespace-nowrap">傾向の印</p>
          <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            {TRENDS.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="text-[11px]">
                  <TrendStamp trend={t} seed={t} />
                </span>
                <span className="text-[13px] font-bold">{trendMeta[t].ja}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 全幅の帯 */}
      <div className="vl-marquee" aria-label={band.replace(/★/g, "")}>
        <div className="vl-marquee__track" aria-hidden>
          <span>{band.repeat(4)}</span>
          <span>{band.repeat(4)}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <IndexView values={values} />
      </div>

      {/* 終わりの帯（逆向きに流れる） */}
      <div className="vl-marquee vl-marquee--rev mt-16" aria-hidden>
        <div className="vl-marquee__track">
          <span>{band.repeat(4)}</span>
          <span>{band.repeat(4)}</span>
        </div>
      </div>
    </>
  );
}
