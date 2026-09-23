import type { Metadata } from "next";
import ValuePlate from "@/components/plate/ValuePlate";
import { values } from "@/data/values";

export const metadata: Metadata = {
  title: "札の下見 | 価値観一覧図鑑",
  robots: { index: false, follow: false },
};

/** 札の面の下見用｡索引からは辿れない */
export default function LabPage() {
  const picks = ["001", "002", "022", "035", "048"].map((no) => values.find((x) => x.no === no)!);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h1 className="font-display-ja text-[28px]">札の面（85.60 × 53.98 mm）</h1>
      <div className="mt-6 flex flex-wrap items-start gap-6">
        {[324, 240, 168].map((w) => (
          <div key={w} style={{ width: w }}>
            <ValuePlate v={picks[0]} interactive={false} />
            <p className="mt-2 text-[12px] font-bold text-vl-ink-soft">{w}px</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((v) => (
          <ValuePlate key={v.no} v={v} interactive={false} />
        ))}
      </div>
    </div>
  );
}
