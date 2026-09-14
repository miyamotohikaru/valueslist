import type { Value } from "@/data/types";
import { SourceText } from "@/lib/source";

/**
 * 裏取りメモ。keyfacts を番号付きで並べ、最後に出典を列挙する。
 * 確度（A/B/C）はゴム印で。
 */

const STAMP: Record<Value["confidence"], { text: string; color: string }> = {
  A: { text: "VERIFIED / A", color: "var(--vl-red)" },
  B: { text: "SUPPORTED / B", color: "var(--vl-navy)" },
  C: { text: "UNCONFIRMED / C", color: "var(--vl-brown)" },
};

function Source({ s }: { s: string }) {
  return <SourceText s={s} />;
}

export default function FactList({ v }: { v: Value }) {
  const stamp = STAMP[v.confidence];
  return (
    <section aria-labelledby="factcheck">
      <header className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b-[3px] border-vl-ink pb-2">
        <h2 id="factcheck" className="flex items-baseline gap-3">
          <span className="font-display-en text-[24px] leading-none tracking-[0.04em] text-vl-red md:text-[30px]">
            FACT CHECK
          </span>
          <span className="font-display-ja text-[15px] leading-none md:text-[18px]">裏取りメモ</span>
        </h2>
        <span className="font-type ml-auto text-[10px] tracking-[0.25em] text-vl-ink-soft">
          {v.keyfacts.length} FACTS · {v.sources.length} SOURCES
        </span>
      </header>

      <div className="vl-offset relative mt-6 border-2 border-vl-ink bg-vl-card px-4 py-5 md:px-7 md:py-7">
        <span
          className="vl-stamp font-display-en absolute -top-4 right-3 text-[16px] md:-top-5 md:right-6 md:text-[22px]"
          style={{ color: stamp.color }}
        >
          {stamp.text}
        </span>

        {v.keyfacts.length > 0 ? (
          <ol className="divide-y divide-vl-line">
            {v.keyfacts.map((k, i) => (
              <li key={i} className="grid grid-cols-[38px_1fr] gap-x-3 py-4 first:pt-1 md:grid-cols-[48px_1fr] md:gap-x-4">
                <span className="font-display-en pt-[2px] text-[24px] leading-none text-vl-red md:text-[28px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="vl-justify text-[14px] leading-[1.9] md:text-[15px]">{k.text}</p>
                  {k.source && (
                    <p className="font-type mt-1.5 text-[10px] leading-relaxed tracking-[0.06em] text-vl-ink-soft md:text-[11px]">
                      <Source s={k.source} />
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="font-type py-2 text-[12px] tracking-[0.12em] text-vl-ink-soft">裏取りメモは準備中。</p>
        )}

        <div className="mt-5 border-t-2 border-vl-ink pt-4">
          <p className="font-type text-[10px] tracking-[0.3em] text-vl-ink-soft">SOURCES · 出典</p>
          {v.sources.length > 0 ? (
            <ol className="font-type mt-2 list-decimal space-y-1.5 pl-5 text-[11px] leading-relaxed md:text-[12px]">
              {v.sources.map((s, i) => (
                <li key={i} className="pl-1">
                  <Source s={s} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="font-type mt-2 text-[11px] tracking-[0.12em] text-vl-ink-soft">出典は準備中。</p>
          )}
        </div>
      </div>
    </section>
  );
}
