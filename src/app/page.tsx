import { values, stats } from "@/data/values";
import { shelves, trendMeta } from "@/data/shelves";
import IndexView from "@/components/IndexView";
import ExplodedCard from "@/components/ExplodedCard";
import Emblem from "@/components/Emblem";
import TrendStamp from "@/components/TrendStamp";
import MobileBreak from "@/components/MobileBreak";
import TitleLockup from "@/components/TitleLockup";
import type { Trend } from "@/data/types";
import TypeLabel from "@/components/TypeLabel";

const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];

export default function Home() {
  const earliest = Math.min(...values.map((v) => v.made?.year ?? 9999));
  const tickets: [number, string][] = [
    [stats.total, "点の在庫"],
    [shelves.filter((s) => s.id !== "meta").length, "つの棚"],
    [stats.law, "点を法令・初出で"],
    [stats.curve, "点を統計の線で"],
  ];
  const band = `★ ${stats.total} VALUES ★ ${shelves.filter((s) => s.id !== "meta").length} SHELVES ★ FACT-CHECKED ★ SINCE ${earliest} ★ 価値観一覧図鑑 `;

  return (
    <>
      <div className="mx-auto max-w-6xl overflow-x-clip px-4 md:px-8">
        <section className="relative grid gap-10 pt-8 pb-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-center md:gap-8 md:pt-14 md:pb-16">
          <div className="relative z-10">
            <p className="text-[13px] font-bold">
              <TypeLabel text="情報を並べるシリーズ 14 · SERIES No.14" />
            </p>
            <h1 className="mt-4">
              <TitleLockup />
            </h1>
            <p className="font-display-ja mt-6 text-[22px] leading-snug md:text-[26px]">その価値観には、製造年がある。</p>
            <p className="mt-4 max-w-[30em] text-[15px] leading-[1.9]">
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

            {/* 在庫の数字（1枚の半券） */}
            <div className="vl-offset mt-8 grid grid-cols-2 border-2 border-vl-ink bg-vl-card sm:grid-cols-4">
              {tickets.map(([n, label], i) => (
                <div
                  key={label}
                  className={`px-4 py-3 ${i % 2 === 1 ? "border-l-2 border-dashed border-vl-ink/40" : ""} ${
                    i >= 2 ? "border-t-2 border-dashed border-vl-ink/40 sm:border-t-0" : ""
                  } ${i === 2 ? "sm:border-l-2" : ""}`}
                >
                  <p className="font-display-en text-[44px] leading-none text-vl-red">{n}</p>
                  <p className="mt-1 text-[12px] font-bold whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>

            {/* 傾向の印の凡例 */}
            <div className="mt-6">
              <p className="text-[12px] font-bold text-vl-ink-soft">傾向の印</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
                {TRENDS.map((t) => (
                  <li key={t} className="flex flex-col items-start gap-1">
                    <span className="text-[11px]">
                      <TrendStamp trend={t} seed={t} />
                    </span>
                    <span className="text-[12px] font-bold">{trendMeta[t].ja}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右: サンバースト＋紋章＋分解図 */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="vl-sunburst pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 text-vl-red opacity-[0.16]" aria-hidden />
            <div className="relative">
              <ExplodedCard className="relative block h-auto w-full" />
              <div className="absolute -top-8 -right-2 rotate-[10deg] md:-top-12 md:-right-6">
                <Emblem size={132} className="block h-auto w-[104px] md:w-[132px]" />
              </div>
              <span className="font-script absolute bottom-4 left-0 rotate-[-8deg] text-[28px] text-vl-red md:text-[34px]">
                fact-checked!
              </span>
            </div>
          </div>
        </section>
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
    </>
  );
}
