import Link from "next/link";
import type { Value } from "@/data/types";
import { lineagesOf, resolveNode } from "@/data/lineages";

/**
 * その商品が属する系譜を横並びで。現在の商品をハイライトし、
 * カードがある段は /values/{no} へ、系譜そのものは /lineage#{id} へ。
 */
export default function LineageStrip({ v }: { v: Value }) {
  const ls = lineagesOf(v);
  if (ls.length === 0) return null;
  return (
    <section aria-labelledby="lineage" className="mt-14 md:mt-20">
      <header className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b-[3px] border-vl-ink pb-2">
        <h2 id="lineage" className="flex items-baseline gap-3">
          <span className="font-display-en text-[24px] leading-none tracking-[0.04em] text-vl-red md:text-[30px]">
            LINEAGE
          </span>
          <span className="font-display-ja text-[15px] leading-none md:text-[18px]">系譜</span>
        </h2>
        <span className="font-type ml-auto text-[10px] tracking-[0.25em] text-vl-ink-soft">
          {ls.length} {ls.length > 1 ? "LINES" : "LINE"} · 再入荷のライン
        </span>
      </header>

      <div className="mt-6 space-y-8">
        {ls.map((l) => (
          <div key={l.id} className="vl-offset border-2 border-vl-ink bg-vl-card">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-vl-ink px-4 py-3 md:px-6">
              <p className="font-display-en text-[13px] tracking-[0.2em] text-vl-red">{l.en}</p>
              <h3 className="font-display-ja text-[15px] leading-snug md:text-[17px]">{l.title}</h3>
              <span className="font-type text-[10px] tracking-[0.2em] text-vl-ink-soft">SPAN · {l.span}</span>
              <Link href={`/lineage#${l.id}`} className="font-type vl-link ml-auto text-[11px] tracking-[0.12em]">
                系譜のページへ →
              </Link>
            </div>

            <ol className="vl-scroll-x flex items-stretch overflow-x-auto px-4 py-5 md:px-6">
              {l.nodes.map((n, i) => {
                const hit = resolveNode(n);
                const current = hit?.no === v.no;
                const body = (
                  <>
                    <p className={`font-type text-[10px] tracking-[0.15em] ${current ? "text-vl-paper/80" : "text-vl-ink-soft"}`}>
                      {n.yearLabel ?? (n.year ? String(n.year) : "—")}
                    </p>
                    <p className="font-display-ja mt-1 text-[15px] leading-tight md:text-[16px]">{n.label}</p>
                    {n.note && (
                      <p className={`mt-1.5 text-[11px] leading-snug ${current ? "text-vl-paper/85" : "text-vl-ink-soft"}`}>
                        {n.note}
                      </p>
                    )}
                    {(current || hit) && (
                      <p className="font-type mt-2 text-[9px] font-bold tracking-[0.2em]">
                        {current ? "● YOU ARE HERE" : `NO.${hit!.no} →`}
                      </p>
                    )}
                  </>
                );
                const box = current
                  ? "border-vl-red bg-vl-red text-vl-paper vl-offset-sm"
                  : "border-vl-ink bg-vl-paper";
                return (
                  <li key={i} className="flex shrink-0 items-stretch md:flex-1 md:shrink">
                    {hit && !current ? (
                      <Link
                        href={`/values/${hit.no}`}
                        className={`block w-[164px] border-2 px-3 py-3 transition-colors hover:bg-vl-card md:w-auto md:flex-1 ${box}`}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className={`w-[164px] border-2 px-3 py-3 md:w-auto md:flex-1 ${box}`} aria-current={current ? "page" : undefined}>
                        {body}
                      </div>
                    )}
                    {i < l.nodes.length - 1 && (
                      <span
                        className="font-display-en flex w-7 shrink-0 items-center justify-center text-[20px] text-vl-red md:w-9"
                        aria-hidden
                      >
                        →
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
