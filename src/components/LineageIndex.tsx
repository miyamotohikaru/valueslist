import type { Lineage } from "@/data/lineages";
import { lineageKindMeta } from "@/data/lineages";
import { ChainTitle, parseSpan } from "./LineageDiagram";

/** 目次では､長い系譜名を最初と最後の2点に縮める（半券の幅で語の途中から折れないように） */
function shortTitle(title: string) {
  const parts = title.split(/\s*→\s*/);
  return parts.length > 2 ? `${parts[0]} → ${parts[parts.length - 1]}` : title;
}

/** 系譜の目次｡同じ幅の半券を2列にそろえ､年数の枠を縦に並べる */
export default function LineageIndex({ lineages }: { lineages: Lineage[] }) {
  return (
    <nav aria-label="系譜の目次">
      <p className="text-[11px] font-bold text-vl-ink-soft">目次 · {lineages.length}本の系譜</p>
      <ul className="mt-2 grid gap-1.5 md:mt-3 md:gap-3 sm:grid-cols-2">
        {lineages.map((l, i) => {
          const span = parseSpan(l.span);
          return (
            <li key={l.id}>
              <a href={`#${l.id}`} className="vl-ticket group block h-full bg-vl-ink p-[2px] transition-transform duration-150 hover:-translate-y-0.5">
                <span className="vl-ticket grid h-full grid-cols-[minmax(0,1fr)_54px] bg-vl-card transition-colors group-hover:bg-vl-mustard md:grid-cols-[minmax(0,1fr)_76px]">
                  <span className="min-w-0 py-1.5 pr-2 pl-3 md:py-2.5 md:pl-5">
                    <span className="font-type block text-[9.5px] font-bold text-vl-red-deep md:text-[11px]">
                      {String(i + 1).padStart(2, "0")} · {lineageKindMeta[l.kind].ja}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-[1.35] font-bold md:text-[13px] md:leading-[1.45]">
                      <ChainTitle title={shortTitle(l.title)} />
                    </span>
                  </span>
                  <span className="flex flex-col items-center justify-center border-l-2 border-dashed border-vl-ink py-1.5 pr-2 leading-none md:py-2 md:pr-3">
                    <span className="flex items-baseline">
                      {span.pre && <span className="text-[9px] font-bold md:text-[11px]">{span.pre}</span>}
                      <span className="font-display-en text-[16px] text-vl-red md:text-[22px]">{span.num || span.post}</span>
                      {span.num && <span className="text-[9px] font-bold md:text-[11px]">{span.post}</span>}
                    </span>
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
