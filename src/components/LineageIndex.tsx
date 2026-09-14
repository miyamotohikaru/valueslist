import type { Lineage } from "@/data/lineages";
import { ChainTitle, parseSpan } from "./LineageDiagram";

/**
 * 系譜の目次。チケット（半券）を横に並べ、押すとその系譜へ飛ぶ。
 * 外側の墨色にも内側のクリームにも vl-ticket を掛けて、穴に縁が付くようにしている。
 */
export default function LineageIndex({ lineages }: { lineages: Lineage[] }) {
  return (
    <nav aria-label="系譜の目次">
      <p className="font-type text-[10px] tracking-[0.3em] text-vl-ink-soft">
        CONTENTS · 系譜 {lineages.length} 本
      </p>
      <ul className="mt-3 flex flex-wrap gap-3">
        {lineages.map((l, i) => {
          const nn = String(i + 1).padStart(2, "0");
          const span = parseSpan(l.span);
          return (
            <li key={l.id} className="max-w-full">
              <a
                href={`#${l.id}`}
                className="vl-ticket group block max-w-full bg-vl-ink p-[2px] transition-transform duration-150 hover:-translate-y-0.5"
              >
                <span className="vl-ticket flex max-w-full items-stretch bg-vl-card transition-colors group-hover:bg-vl-mustard">
                  <span className="flex min-w-0 items-center gap-2.5 py-2 pl-5 pr-3">
                    <span className="font-type shrink-0 text-[9px] font-bold tracking-[0.2em] text-vl-red">{nn}</span>
                    <span className="text-[12px] font-bold leading-[1.45]">
                      <ChainTitle title={l.title} />
                    </span>
                  </span>
                  <span aria-hidden className="my-[5px] border-l-2 border-dashed border-vl-ink" />
                  <span className="flex shrink-0 items-baseline py-2 pl-3 pr-5 leading-none">
                    {span.pre && <span className="text-[9px] font-bold">{span.pre}</span>}
                    {span.num ? (
                      <>
                        <span className="font-display-en text-[15px] text-vl-red">{span.num}</span>
                        <span className="text-[10px] font-bold">{span.post}</span>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold">{span.post}</span>
                    )}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
