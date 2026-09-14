import type { Value } from "@/data/types";
import { shelfById, categoryMeta, evidenceMeta, trendMeta } from "@/data/shelves";
import { SHELF_ACCENT } from "./ValueCard";
import TrendStamp from "./TrendStamp";

/**
 * 製品仕様表。罫線の表に Courier のラベル、値は太字。
 * 製造／廃番／再入荷の根拠（fact と出典）は「日付の帳票」（LawTimeline）にまとめ、ここでは値だけを出す。
 */


function Tr({ ja, en, children }: { ja: string; en: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-vl-line align-top">
      <th scope="row" className="w-[88px] py-2.5 pr-3 pl-4 text-left font-normal md:w-[108px] md:pl-5">
        <span className="block text-[12px] font-bold tracking-[0.05em] text-vl-ink">{ja}</span>
        <span className="font-type block text-[9px] tracking-[0.22em] text-vl-ink-soft">{en}</span>
      </th>
      <td className="border-l border-vl-line py-2.5 pr-4 pl-3 text-[14px] leading-snug font-bold md:pr-5">{children}</td>
    </tr>
  );
}

export default function DetailSpec({ v }: { v: Value }) {
  const shelf = shelfById(v.shelf);
  const acc = SHELF_ACCENT[String(v.shelf)];
  const ev = evidenceMeta[v.evidence];
  return (
    <div className="vl-offset border-2 border-vl-ink bg-vl-card">
      <div
        className="font-type flex items-center justify-between px-4 py-2 text-[10px] font-bold tracking-[0.25em] md:px-5"
        style={{ background: acc.bg, color: acc.fg }}
      >
        <span>SPEC SHEET · 仕様</span>
        <span>NO.{v.no}</span>
      </div>
      <table className="w-full border-collapse">
        <tbody>
          <Tr ja="型番" en="CAT. NO.">
            <span className="font-type tracking-[0.12em]">NO.{v.no}</span>
          </Tr>
          <Tr ja="棚" en="SHELF">
            <span className="flex items-start gap-2">
              <span
                className="mt-[3px] inline-block h-[11px] w-[11px] shrink-0 border border-vl-ink"
                style={{ background: acc.bg }}
                aria-hidden
              />
              <span>
                {shelf.no} · {shelf.name}
                <span className="font-type block text-[9px] font-normal tracking-[0.2em] text-vl-ink-soft">{shelf.en}</span>
              </span>
            </span>
          </Tr>
          <Tr ja="分類" en="TYPE">
            {v.category}
            <span className="font-type ml-2 text-[10px] font-normal tracking-[0.2em] text-vl-ink-soft">
              {categoryMeta[v.category].en}
            </span>
          </Tr>
          <Tr ja="証拠" en="EVIDENCE">
            {ev.ja}
            <span className="font-type block text-[9px] font-normal tracking-[0.2em] text-vl-ink-soft">{ev.en}</span>
          </Tr>
          <Tr ja="製造" en="MFD.">
            {v.made ? (
              <>
                {v.made.approx && <span className="font-type mr-1 text-[10px] text-vl-ink-soft">c.</span>}
                {v.made.label}
              </>
            ) : (
              "—"
            )}
          </Tr>
          <Tr ja="廃番" en="DISC.">
            {v.discontinued ? (
              <>
                {v.discontinued.approx && <span className="font-type mr-1 text-[10px] text-vl-ink-soft">c.</span>}
                <span className="text-vl-red">{v.discontinued.label}</span>
              </>
            ) : (
              <>
                現役
                <span className="font-type ml-2 text-[10px] font-normal tracking-[0.2em] text-vl-ink-soft">IN STOCK</span>
              </>
            )}
          </Tr>
          <Tr ja="再入荷" en="RESTOCK">
            {v.restocked ? (
              <>
                {v.restocked.label}
                {v.restocked.as && (
                  <span className="font-type ml-2 text-[10px] font-normal tracking-[0.12em] text-vl-ink-soft">
                    AS “{v.restocked.as}”
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
          </Tr>
          <Tr ja="傾向" en="TREND">
            <span className="flex flex-wrap items-center gap-2">
              <TrendStamp trend={v.trend} className="text-[10px]" />
              <span>{trendMeta[v.trend].ja}</span>
            </span>
          </Tr>
          <Tr ja="確度" en="CONFIDENCE">
            <span className="font-type inline-flex items-center gap-1" aria-label={`確度 ${v.confidence}`}>
              {(["A", "B", "C"] as const).map((c) => (
                <span
                  key={c}
                  className={`grid h-6 w-6 place-items-center border text-[11px] ${
                    c === v.confidence
                      ? "border-vl-ink bg-vl-ink font-bold text-vl-paper"
                      : "border-vl-line font-normal text-vl-ink-soft"
                  }`}
                >
                  {c}
                </span>
              ))}
              <span className="ml-2 text-[9px] font-normal tracking-[0.2em] text-vl-ink-soft">
                {v.confidence === "A" ? "VERIFIED" : v.confidence === "B" ? "SUPPORTED" : "UNCONFIRMED"}
              </span>
            </span>
          </Tr>
        </tbody>
      </table>
    </div>
  );
}
