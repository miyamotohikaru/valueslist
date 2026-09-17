import type { Metadata } from "next";
import { stats, values } from "@/data/values";
import { shelves } from "@/data/shelves";
import ExplodedCard from "@/components/ExplodedCard";
import Emblem from "@/components/Emblem";
import TitleLockup from "@/components/TitleLockup";

export const metadata: Metadata = {
  title: "OG card",
  robots: { index: false, follow: false },
};

/**
 * 共有時に出る絵（1200×630）の版下｡索引のヒーローと同じ部品で組む｡
 * 焼き方: node tools/shoot-og.mjs（public/og.png と src/app/og-version.ts を書き換える）
 */
export default function OgCard() {
  const shelfCount = shelves.filter((s) => s.id !== "meta").length;
  const earliest = Math.min(...values.map((v) => v.made?.year ?? 9999));
  const band = `★ ${stats.total} VALUES ★ ${shelfCount} SHELVES ★ FACT-CHECKED ★ SINCE ${earliest} `;

  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-vl-paper">
      <style>{`header, footer, nav, nextjs-portal { display: none !important } main { padding: 0 !important } body { overflow: hidden }`}</style>

      {/* 放射状の光（右の図の後ろ） */}
      <div
        className="vl-sunburst pointer-events-none absolute top-[282px] left-[900px] aspect-square w-[1150px] -translate-x-1/2 -translate-y-1/2 text-vl-red opacity-[0.16]"
        aria-hidden
      />

      {/* 左: 題字 */}
      <div className="absolute top-[44px] left-[64px] w-[560px]">
        <p className="text-[19px] font-bold">情報を並べるシリーズ 14</p>
        <div className="mt-4">
          <TitleLockup className="block h-auto w-[540px]" />
        </div>
        <p className="font-display-ja mt-5 text-[36px] leading-none">その価値観には､製造年がある｡</p>
      </div>

      {/* 右: 分解図と紋章 */}
      <div className="absolute top-[92px] right-[70px] w-[440px]">
        <ExplodedCard className="relative block h-auto w-full" />
        <div className="absolute -top-[54px] -right-[58px] rotate-[10deg]">
          <Emblem size={150} className="block" />
        </div>
        <span className="font-script absolute -bottom-[6px] left-[4px] rotate-[-8deg] text-[40px] text-vl-red">fact-checked!</span>
      </div>

      {/* 下: 全幅の帯 */}
      <div className="absolute inset-x-0 bottom-0 flex h-[64px] items-center justify-between border-t-[3px] border-vl-ink bg-vl-red-deep px-[64px] text-vl-paper">
        <span className="font-display-en text-[27px] leading-none tracking-[0.1em] whitespace-nowrap">{band}</span>
        <span className="font-type text-[18px] font-bold tracking-[0.08em] text-vl-mustard">valueslist.vercel.app</span>
      </div>
    </div>
  );
}
