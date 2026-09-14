import Link from "next/link";
import type { Value } from "@/data/types";
import { SHELF_ACCENT } from "./ValueCard";

/**
 * 第5棚: 長距離再入荷の陳列。
 * restocked を持つ商品（元の在庫）と、その再入荷品（as）を一枚のチケットで結ぶ。
 */
/** 「再入荷」と判定したもので、元の在庫から50年以上へだてて戻ったもの */
export function longRestocks(values: Value[], all: Value[]) {
  return values
    .filter((v) => v.restocked && v.trend === "restocked")
    .map((v) => {
      const to = all.find((x) => x.name === v.restocked!.as);
      const fromDisc = !!v.discontinued;
      const fromYear = v.discontinued?.year ?? v.made?.year ?? 0;
      const gap = v.restocked!.year - fromYear;
      return { from: v, to, toName: v.restocked!.as ?? "", gap, year: v.restocked!.year, fromDisc };
    })
    .filter((p) => p.gap >= 50)
    .sort((a, b) => b.gap - a.gap);
}

export default function RestockPairs({ values, all }: { values: Value[]; all: Value[] }) {
  const pairs = longRestocks(values, all);

  if (pairs.length === 0) return null;

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {pairs.map((p) => {
        const accFrom = SHELF_ACCENT[String(p.from.shelf)];
        const accTo = p.to ? SHELF_ACCENT[String(p.to.shelf)] : SHELF_ACCENT["4"];
        return (
          <li key={p.from.no} className="vl-offset border-2 border-vl-ink bg-vl-card">
            <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
              {/* 元の在庫 */}
              <Link href={`/values/${p.from.no}`} className="group flex flex-col p-4 md:p-5">
                <span
                  className="font-type self-start px-1.5 py-0.5 text-[10px] font-bold tracking-[0.15em]"
                  style={{ background: accFrom.bg, color: accFrom.fg }}
                >
                  NO.{p.from.no}
                </span>
                <span className="font-display-ja mt-2 text-[19px] leading-tight group-hover:text-vl-red md:text-[22px]">
                  {p.from.name}
                </span>
                <span className="font-type mt-1 text-[10px] tracking-[0.12em] text-vl-ink-soft">
                  {p.from.made?.label ?? ""}
                  {p.from.discontinued ? ` → ${p.from.discontinued.label}` : ""}
                </span>
              </Link>

              {/* 中央: 年数と矢印 */}
              <div className="relative flex flex-col items-center justify-center border-x-2 border-dashed border-vl-line px-3">
                <span className="font-display-en text-[30px] leading-none text-vl-red md:text-[36px]">
                  {p.gap > 0 ? p.gap : "—"}
                </span>
                <span className="font-type text-[9px] tracking-[0.25em] text-vl-ink-soft">YEARS</span>
                <span className="mt-0.5 text-[9px] font-bold text-vl-ink-soft">{p.fromDisc ? "廃番から" : "製造から"}</span>
                <svg viewBox="0 0 40 16" className="mt-1 h-3 w-8" aria-hidden>
                  <line x1="0" y1="8" x2="30" y2="8" stroke="var(--vl-red)" strokeWidth="2" strokeDasharray="3 2" />
                  <polygon points="28,2 40,8 28,14" fill="var(--vl-red)" />
                </svg>
              </div>

              {/* 再入荷品 */}
              {p.to ? (
                <Link href={`/values/${p.to.no}`} className="group flex flex-col items-end p-4 text-right md:p-5">
                  <span
                    className="font-type px-1.5 py-0.5 text-[10px] font-bold tracking-[0.15em]"
                    style={{ background: accTo.bg, color: accTo.fg }}
                  >
                    NO.{p.to.no}
                  </span>
                  <span className="font-display-ja mt-2 text-[19px] leading-tight group-hover:text-vl-red md:text-[22px]">
                    {p.to.name}
                  </span>
                  <span className="font-type mt-1 text-[10px] tracking-[0.12em] text-vl-ink-soft">
                    {p.to.made?.label ?? String(p.year)}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-end p-4 text-right md:p-5">
                  <span className="font-type border border-vl-ink px-1.5 py-0.5 text-[10px] font-bold tracking-[0.15em]">
                    RESTOCK
                  </span>
                  <span className="font-display-ja mt-2 text-[19px] leading-tight md:text-[22px]">{p.toName}</span>
                  <span className="font-type mt-1 text-[10px] tracking-[0.12em] text-vl-ink-soft">{p.year}</span>
                </div>
              )}
            </div>
            <div className="vl-checker-red h-[8px] w-full opacity-70" aria-hidden />
          </li>
        );
      })}
    </ul>
  );
}
