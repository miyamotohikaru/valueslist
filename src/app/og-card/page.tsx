import type { Metadata } from "next";
import { stats, values } from "@/data/values";
import PrintCard from "@/components/PrintCard";
import { SHELF_ACCENT } from "@/components/ValueCard";

export const metadata: Metadata = {
  title: "OG card",
  robots: { index: false, follow: false },
};

/**
 * 共有時に出る絵（1200×630）の版下｡いまの札をそのまま3枚並べる｡
 * 焼き方: node tools/shoot-og.mjs（public/og.png と src/app/og-version.ts を書き換える）
 */
const PICKS = ["001", "029", "042"];

export default function OgCard() {
  const cards = PICKS.map((no) => values.find((v) => v.no === no)!);
  const earliest = Math.min(...values.map((v) => v.made?.year ?? 9999));

  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-vl-paper">
      <style>{`
        header, footer, nav, nextjs-portal { display: none !important }
        main { padding: 0 !important }
        body { overflow: hidden }
        /* 図版は色が回りきった状態で焼く（スクロールに依らないように） */
        .vl-print__layer--ink { clip-path: inset(100% 0 0 0) !important }
      `}</style>

      {/* 左: 題字 */}
      <div className="absolute top-[132px] left-[64px] w-[400px]">
        <p className="font-type text-[15px] font-bold tracking-[0.16em] text-vl-red">
          情報を並べるシリーズ 14
        </p>
        <h1 className="mt-[18px] text-[86px] leading-[1.06] font-black tracking-[-0.02em]">
          価値観
          <br />
          一覧表
        </h1>
        <p className="mt-[22px] text-[27px] leading-[1.45] font-bold">
          その価値観には､
          <br />
          製造年がある｡
        </p>
      </div>

      {/* 右: 札を3枚 */}
      <div className="absolute top-[112px] left-[500px] flex gap-[22px]">
        {cards.map((v, i) => (
          <div key={v.no} className="w-[206px]" style={{ marginTop: i * 38 }}>
            <PrintCard v={v} interactive={false} />
          </div>
        ))}
      </div>

      {/* 下: 墨の帯 */}
      <div className="absolute inset-x-0 bottom-0 flex h-[74px] items-center gap-[22px] bg-vl-ink px-[64px] text-vl-paper">
        <span className="flex gap-[6px]" aria-hidden>
          {["1", "2", "3", "4", "5"].map((k) => (
            <span key={k} className="block h-[16px] w-[16px]" style={{ background: SHELF_ACCENT[k].line }} />
          ))}
        </span>
        <span className="font-type text-[17px] font-bold tracking-[0.1em]">
          {stats.total} 点 · 製造年 / 廃番年 / 再入荷年を出典で特定 · SINCE {earliest}
        </span>
        <span className="font-type ml-auto text-[17px] font-bold tracking-[0.08em] text-vl-red">
          valueslist.vercel.app
        </span>
      </div>
    </div>
  );
}
