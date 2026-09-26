import type { Value } from "@/data/types";
import { SourceText } from "@/lib/source";

/**
 * 裏取りメモ｡PC は2段組（左に番号付きの事実､右に確度の印と出典の一覧）｡
 * 事実の行長は 40em 以内｡出典は同じものを1つにまとめる｡
 */
const STAMP: Record<Value["confidence"], { text: string; ja: string; color: string }> = {
  A: { text: "VERIFIED · A", ja: "公文書・統計で年月日まで特定", color: "var(--vl-red)" },
  B: { text: "SUPPORTED · B", ja: "学術書などで裏づけ", color: "var(--vl-navy)" },
  C: { text: "UNCONFIRMED · C", ja: "通説の域", color: "var(--vl-brown)" },
};

const norm = (s: string) => s.replace(/\s+/g, "").replace(/[（）()]/g, "");

export default function FactList({ v }: { v: Value }) {
  const stamp = STAMP[v.confidence];
  const seen = new Set<string>();
  const sources = v.sources.filter((s) => {
    const k = norm(s);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <section aria-labelledby="factcheck">
      <header className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b-[3px] border-vl-ink pb-2">
        <h2 id="factcheck" className="flex items-baseline gap-3">
          <span className="font-display-en text-[19px] leading-none tracking-[0.03em] text-vl-red md:text-[34px]">FACT CHECK</span>
          <span className="font-display-ja text-[13px] leading-none md:text-[20px]">裏取りメモ</span>
        </h2>
        <span className="font-type ml-auto text-[12px] font-bold tracking-[0.1em]">
          {v.keyfacts.length} FACTS · {sources.length} SOURCES
        </span>
      </header>

      <div className="vl-offset mt-6 grid border-2 border-vl-ink bg-vl-card lg:grid-cols-[minmax(0,1fr)_320px]">
        <ol className="divide-y-2 divide-vl-ink/10 px-4 py-2 md:px-7">
          {v.keyfacts.map((k, i) => (
            <li key={i} className="grid grid-cols-[34px_minmax(0,1fr)] gap-x-3 py-4 md:grid-cols-[44px_minmax(0,1fr)]">
              <span className="font-display-en pt-[2px] text-[18px] leading-none text-vl-red md:text-[30px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="max-w-[40em] min-w-0">
                <p className="vl-justify text-[12px] leading-[1.8] md:text-[15px] md:leading-[1.85]">{k.text}</p>
                {k.source && (
                  <p className="mt-1.5 text-[12px] leading-relaxed text-vl-ink-soft">
                    <SourceText s={k.source} />
                  </p>
                )}
              </div>
            </li>
          ))}
          {v.keyfacts.length === 0 && <li className="py-4 text-[14px] text-vl-ink-soft">裏取りメモは準備中｡</li>}
        </ol>

        <aside className="relative border-t-2 border-vl-ink px-4 pt-8 pb-5 md:px-6 lg:border-t-0 lg:border-l-2">
          <div className="flex items-center gap-3">
            <span className="vl-stamp font-display-en text-[13px] md:text-[22px]" style={{ color: stamp.color }}>
              {stamp.text}
            </span>
          </div>
          <p className="mt-3 text-[13px] font-bold">確度 {v.confidence}：{stamp.ja}</p>
          <p className="mt-6 text-[12px] font-bold text-vl-ink-soft">出典</p>
          {sources.length > 0 ? (
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-[13px] leading-relaxed">
              {sources.map((s, i) => (
                <li key={i} className="pl-1 break-words">
                  <SourceText s={s} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-[13px] text-vl-ink-soft">出典は準備中｡</p>
          )}
        </aside>
      </div>
    </section>
  );
}
