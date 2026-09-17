import type { ShelfMeta } from "@/data/types";
import BreakText from "./BreakText";
import { SHELF_ACCENT } from "./ValueCard";

/** 棚札｡丸いメダルに棚番号､右に名前と説明｡証拠の種類と件数は説明の下にまとめる */
export default function ShelfHeader({ shelf, count }: { shelf: ShelfMeta; count: number }) {
  const acc = SHELF_ACCENT[String(shelf.id)];
  return (
    <div className="mb-8 flex items-start gap-4 md:gap-6">
      <div
        className="vl-medal shrink-0"
        style={{ ["--medal-bg" as string]: acc.bg, ["--medal-fg" as string]: acc.fg }}
        aria-hidden
      >
        <span className="font-type text-[11px] font-bold tracking-[0.14em]">SHELF</span>
        <span className="font-display-en text-[40px] leading-[0.9] md:text-[48px]">{shelf.no}</span>
      </div>
      <div className="min-w-0 pt-1">
        <p className="font-display-en text-[13px] tracking-[0.18em] text-vl-red-deep md:text-[14px]">{shelf.en}</p>
        <h2 className="font-display-ja mt-1 text-[24px] leading-tight md:text-[32px]">{shelf.name}</h2>
        <p className="mt-2 text-[14px] leading-[1.75] md:text-[15px]">
          <BreakText text={shelf.lead} />
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-vl-ink-soft">
          <span>
            <BreakText text={shelf.evidenceNote} />
          </span>
          <span className="font-bold text-vl-ink">{count}点</span>
        </p>
      </div>
    </div>
  );
}
