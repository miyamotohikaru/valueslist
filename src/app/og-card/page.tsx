import type { Metadata } from "next";
import { stats } from "@/data/values";
import ExplodedCard from "@/components/ExplodedCard";
import TrendStamp from "@/components/TrendStamp";

export const metadata: Metadata = {
  title: "OG card",
  robots: { index: false, follow: false },
};

/**
 * 共有時に出る絵（1200×630）の版下。
 * 撮り方: node ~/.claude/skills/shot/shot.mjs http://localhost:3014/og-card --w 1200 --vh 630 --viewport --scale 1 --pc --name og
 *        → できた og-pc.png を public/og.png に置き、layout.tsx の OG_VERSION を上げる。
 */
export default function OgCard() {
  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-vl-paper">
      <style>{`header, footer, nav { display: none !important } main { padding: 0 !important } body { overflow: hidden }`}</style>
      <div className="vl-checker absolute inset-x-0 top-0 h-[14px] opacity-90" />
      <div className="absolute left-[64px] top-[58px]">
        <p className="font-type text-[15px] tracking-[0.35em] text-vl-ink-soft">情報を並べるシリーズ 14 · SERIES No.14</p>
        <h1 className="font-display-ja mt-4 text-[74px] leading-none">価値観一覧図鑑</h1>
        <p className="font-display-en mt-2 text-[150px] leading-[0.84] text-vl-red">
          VALUES
          <br />
          CATALOG
        </p>
        <p className="mt-6 text-[26px] font-bold">その価値観には、製造年がある。</p>
      </div>
      <div className="absolute right-[56px] top-[70px] w-[470px]">
        <ExplodedCard className="w-full" />
        <span className="font-script absolute -bottom-2 left-0 rotate-[-6deg] text-[40px] text-vl-red">fact-checked!</span>
      </div>
      <div className="absolute bottom-[40px] left-[64px] flex items-center gap-4">
        {[
          [stats.total, "ITEMS"],
          [5, "SHELVES"],
        ].map(([n, l]) => (
          <div key={String(l)} className="vl-offset-sm border-2 border-vl-ink bg-vl-card px-4 py-2">
            <span className="font-display-en text-[30px] leading-none">{n}</span>
            <span className="font-type ml-2 text-[11px] tracking-[0.25em] text-vl-ink-soft">{l}</span>
          </div>
        ))}
        <div className="ml-4 flex items-center gap-2">
          <TrendStamp trend="discontinued" className="text-[13px]" />
          <TrendStamp trend="restocked" className="text-[13px]" />
          <TrendStamp trend="up" className="text-[13px]" />
        </div>
      </div>
      <p className="font-type absolute bottom-[44px] right-[64px] text-[13px] tracking-[0.3em] text-vl-ink-soft">
        valueslist.vercel.app
      </p>
      <div className="vl-checker absolute inset-x-0 bottom-0 h-[14px] opacity-90" />
    </div>
  );
}
