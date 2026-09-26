import type { Metadata } from "next";
import ValueCard from "@/components/ValueCard";
import { values } from "@/data/values";

export const metadata: Metadata = {
  title: "札の下見 | 価値観一覧図鑑",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  const picks = ["001", "002", "004", "020", "022", "046", "035", "048"].map((no) => values.find((x) => x.no === no)!);
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-10">
      <h1 className="text-[28px] font-black">札の下見</h1>
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
        {picks.map((v) => (
          <ValueCard key={v.no} v={v} interactive={false} />
        ))}
      </div>
    </div>
  );
}
