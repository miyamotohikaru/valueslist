import { values, stats } from "@/data/values";
import { shelves } from "@/data/shelves";
import IndexView from "@/components/IndexView";

export default function Home() {
  const earliest = Math.min(...values.map((v) => v.made?.year ?? 9999));
  const band = `★ ${stats.total} VALUES ★ ${shelves.filter((s) => s.id !== "meta").length} SHELVES ★ FACT-CHECKED ★ SINCE ${earliest} ★ 価値観一覧図鑑 `;

  return (
    <>
      {/* 開いてすぐカードが見えるように、索引を先頭に置く */}
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <IndexView values={values} />
      </div>

      {/* 全幅の帯 */}
      <div className="vl-marquee" aria-label={band.replace(/★/g, "")}>
        <div className="vl-marquee__track" aria-hidden>
          <span>{band.repeat(4)}</span>
          <span>{band.repeat(4)}</span>
        </div>
      </div>

    </>
  );
}
