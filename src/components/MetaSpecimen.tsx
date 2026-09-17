import Link from "next/link";
import type { Value } from "@/data/types";
import TrendStamp from "./TrendStamp";
import FitLines from "./FitLines";

/**
 * メタ標本（江戸しぐさ）。索引の最後の見せ場。
 * 「伝統に見えて製造年がある」という店のコンセプトを、この1枚で回収する。
 * 文言はすべて values.json のもの（事実を足さない）。
 */
export default function MetaSpecimen({ v }: { v: Value }) {
  const year = v.made?.year;
  return (
    <section className="relative overflow-hidden border-2 border-vl-ink bg-vl-ink text-vl-paper" aria-label="メタ標本">
      {/* 斜めの帯 */}
      <div
        className="font-display-en absolute top-[26px] -right-[74px] w-[300px] rotate-[35deg] bg-vl-red py-1.5 text-center text-[13px] tracking-[0.2em] text-vl-paper md:top-[34px] md:-right-[64px] md:text-[15px]"
        aria-hidden
      >
        偽ヴィンテージ
      </div>

      <div className="grid gap-8 px-5 py-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:px-10 md:py-14">
        <div className="min-w-0">
          <p className="font-display-ja mt-4 text-[26px] leading-[1.35] text-vl-mustard md:text-[36px]">
            「伝統」にも、
            <br />
            製造年がある。
          </p>
          <h2 className="font-display-ja mt-6 text-[48px] leading-none md:text-[72px]">{v.name}</h2>
          <p className="mt-2 text-[13px] tracking-[0.12em] text-vl-paper/80">{v.reading}</p>
          <div className="mt-5 max-w-[34em] @container">
            <FitLines text={v.hitokoto} wideMax={24} narrowMax={16} maxPx={19} maxPxNarrow={16} className="leading-[1.8] font-bold" />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link
              href={`/values/${v.no}`}
              className="inline-flex items-center gap-2 border-2 border-vl-paper px-4 py-2 text-[14px] font-bold hover:bg-vl-paper hover:text-vl-ink"
            >
              標本を見る <span aria-hidden>→</span>
            </Link>
            <span className="text-[16px]">
              <TrendStamp trend={v.trend} seed={v.no} />
            </span>
          </div>
        </div>

        {year && (
          <div className="relative text-center md:text-right" aria-label={`製造年 ${year}`}>
            <p
              className="font-display-en leading-[0.85] text-transparent"
              style={{ fontSize: "clamp(96px, 26vw, 220px)", WebkitTextStroke: "2px var(--vl-paper)" }}
            >
              {year}
            </p>
            <p className="mt-2 text-[13px] text-vl-paper/85">{v.made?.label}</p>
          </div>
        )}
      </div>
      <div className="vl-checker h-[14px] w-full opacity-90" style={{ backgroundColor: "var(--vl-paper)", backgroundRepeat: "round" }} aria-hidden />
    </section>
  );
}
