import type { Metadata } from "next";
import ValuePlate from "@/components/plate/ValuePlate";
import { values } from "@/data/values";

export const metadata: Metadata = {
  title: "図版の下見 | 価値観一覧図鑑",
  robots: { index: false, follow: false },
};

/** 札の面の下見用｡索引からは辿れない */
export default function LabPage() {
  const v = values.find((x) => x.no === "001")!;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h1 className="font-display-ja text-[28px]">NO.001 の新しい面</h1>
      <div className="mt-6 flex flex-wrap items-start gap-8">
        {[168, 265, 340].map((w) => (
          <div key={w} style={{ width: w, containerType: "inline-size" }}>
            <ValuePlate v={v} interactive={false} />
            <p className="mt-2 text-[12px] font-bold text-vl-ink-soft">{w}px</p>
          </div>
        ))}
      </div>
    </div>
  );
}
