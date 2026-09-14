import type { ShelfMeta } from "@/data/types";
import { SHELF_ACCENT } from "./ValueCard";

/** 棚札。番号の大きなタグ＋名前＋証拠タイプの注記 */
export default function ShelfHeader({ shelf, count }: { shelf: ShelfMeta; count: number }) {
  const acc = SHELF_ACCENT[String(shelf.id)];
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-stretch gap-4">
        <div
          className="vl-offset-sm flex flex-col items-center justify-center border-2 border-vl-ink px-4 py-2"
          style={{ background: acc.bg, color: acc.fg }}
        >
          <span className="font-type text-[9px] tracking-[0.3em]">SHELF</span>
          <span className="font-display-en text-[40px] leading-none">{shelf.no}</span>
        </div>
        <div>
          <p className="font-display-en text-[13px] tracking-[0.22em] text-vl-red">{shelf.en}</p>
          <h2 className="font-display-ja text-[24px] leading-tight md:text-[30px]">{shelf.name}</h2>
          <p className="mt-1 max-w-[46ch] text-[13px] leading-relaxed text-vl-ink-soft">{shelf.lead}</p>
        </div>
      </div>
      <div className="font-type text-[11px] tracking-[0.12em] text-vl-ink-soft md:text-right">
        <p>{shelf.evidenceNote}</p>
        <p className="mt-1 font-bold text-vl-ink">{count} ITEMS</p>
      </div>
    </div>
  );
}
