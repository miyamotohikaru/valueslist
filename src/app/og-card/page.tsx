import type { Metadata } from "next";
import { values } from "@/data/values";
import PrintCard from "@/components/PrintCard";

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

  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-vl-paper">
      <style>{`
        header, footer, nav, nextjs-portal { display: none !important }
        main { padding: 0 !important }
        body { overflow: hidden }
        /* 図版は色が回りきった状態で焼く(スクロールに依らないように) */
        .vl-print__layer--ink { clip-path: inset(100% 0 0 0) !important }
      `}</style>

      {/* 左: 題字 */}
      <div className="absolute top-1/2 left-[64px] w-[300px] -translate-y-1/2">
        <h1 className="text-[86px] leading-[1.06] font-black tracking-[-0.02em]">
          価値観
          <br />
          一覧表
        </h1>
        <p className="mt-[26px] text-[27px] leading-[1.45] font-bold">
          その価値観には､
          <br />
          成立年がある｡
        </p>
      </div>

      {/* 右: 札を3枚｡高さを揃えて横に並べる */}
      <div className="absolute top-1/2 left-[396px] flex -translate-y-1/2 gap-[22px]">
        {cards.map((v) => (
          <div key={v.no} className="w-[240px]">
            <PrintCard v={v} lang="ja" interactive={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
