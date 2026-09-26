import type { Metadata } from "next";
import PrintCard from "@/components/PrintCard";
import { values } from "@/data/values";

export const metadata: Metadata = {
  title: "札の下見 | 価値観一覧図鑑",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  const picks = ["001", "002", "003", "004", "005"].map((no) => values.find((x) => x.no === no)!);

  return (
    <div className="vl-lab">
      <div className="mx-auto max-w-[1180px] px-5 py-16 md:px-10 md:py-24">
        <p className="font-type text-[11px] tracking-[0.18em] text-[rgba(242,237,224,0.5)]">
          札の下見 · 5 枚
        </p>
        <h1 className="mt-4 max-w-[22ch] text-[clamp(30px,5vw,52px)] font-black leading-[1.15] text-[#f2ede0]">
          版に起こして､網をかける｡
        </h1>
        <p className="mt-5 max-w-[46ch] text-[14px] leading-[1.9] text-[rgba(242,237,224,0.66)]">
          図版は一枚ずつ違う網で刷ってある｡
          <br />
          スクロールすると網が送られて､色が上から回る｡
        </p>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {picks.map((v) => (
            <PrintCard key={v.no} v={v} />
          ))}
        </div>

        {/* 送りを見るための余白 */}
        <div className="h-[70vh]" />
      </div>
    </div>
  );
}
