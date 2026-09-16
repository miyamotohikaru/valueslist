import Link from "next/link";
import type { Value } from "@/data/types";
import { SHELF_ACCENT } from "./ValueCard";

type Pair = {
  from: Value;
  to: Value | undefined;
  toName: string;
  gap: number;
  year: number;
  fromDisc: boolean;
};

/** 「再入荷」と判定したもので、元の在庫から50年以上へだてて戻ったもの */
export function longRestocks(values: Value[], all: Value[]): Pair[] {
  return values
    .filter((v) => v.restocked && v.trend === "restocked")
    .map((v) => {
      const to = all.find((x) => x.name === v.restocked!.as);
      const fromDisc = !!v.discontinued;
      const fromYear = v.discontinued?.year ?? v.made?.year ?? 0;
      return {
        from: v,
        to,
        toName: v.restocked!.as ?? "",
        gap: v.restocked!.year - fromYear,
        year: v.restocked!.year,
        fromDisc,
      };
    })
    .filter((p) => p.gap >= 50)
    .sort((a, b) => b.gap - a.gap);
}

/** 半券の商品名を、欄の幅に1行で収まる大きさにする（欄は @container） */
function fitName(name: string) {
  let n = 0;
  for (const ch of name) n += /[\x20-\x7e]/.test(ch) ? 0.55 : 1;
  return `min(22px, calc(100cqw / ${(n + 0.3).toFixed(2)}))`;
}

function Ticket({ p }: { p: Pair }) {
  const accFrom = SHELF_ACCENT[String(p.from.shelf)];
  const startYear = p.fromDisc ? p.from.discontinued!.year : p.from.made!.year;
  return (
    <li className="vl-offset flex h-full flex-col border-2 border-vl-ink bg-vl-card">
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {/* 元の在庫 */}
        <Link href={`/values/${p.from.no}`} className="group flex min-w-0 flex-col gap-1 p-4 @container">
          <span
            className="font-type self-start px-1.5 py-0.5 text-[11px] font-bold tracking-[0.1em]"
            style={{ background: accFrom.bg, color: accFrom.fg }}
          >
            NO.{p.from.no}
          </span>
          <span className="font-display-ja mt-1 leading-tight whitespace-nowrap group-hover:text-vl-red" style={{ fontSize: fitName(p.from.name) }}>
            {p.from.name}
          </span>
          <span className="text-[12px] text-vl-ink-soft">
            {p.fromDisc ? "廃番" : "製造"}
            <span className="font-type ml-1 font-bold text-vl-ink">{p.from.made?.approx && !p.fromDisc ? "c." : ""}{startYear}</span>
          </span>
        </Link>

        {/* ミシン目と年数 */}
        <div className="flex flex-col items-center justify-center border-x-2 border-dashed border-vl-ink/40 px-3 py-3 text-center">
          <span className="text-[12px] font-bold">{p.fromDisc ? "廃番から" : "製造から"}</span>
          <span className="font-display-en text-[40px] leading-none text-vl-red">{p.gap}</span>
          <span className="text-[12px] font-bold">年</span>
          <svg viewBox="0 0 40 12" className="mt-1 h-3 w-9" aria-hidden>
            <line x1="0" y1="6" x2="30" y2="6" stroke="var(--vl-red)" strokeWidth="2" strokeDasharray="3 2" />
            <polygon points="28,1 40,6 28,11" fill="var(--vl-red)" />
          </svg>
        </div>

        {/* 再入荷品 */}
        <div className="flex min-w-0 flex-col items-end gap-1 p-4 text-right @container">
          <span className="font-type border-2 border-vl-red px-1.5 py-0.5 text-[11px] font-bold tracking-[0.1em] text-vl-red-deep">
            RESTOCK
          </span>
          {p.to ? (
            <Link
              href={`/values/${p.to.no}`}
              className="mt-1 leading-tight font-bold whitespace-nowrap underline decoration-vl-red decoration-2 underline-offset-4 hover:text-vl-red"
              style={{ fontSize: fitName(p.toName) }}
            >
              <span className={/^[\x20-\x7e]+$/.test(p.toName) ? "font-display-en tracking-[0.04em]" : "font-display-ja"}>
                {p.toName}
              </span>
            </Link>
          ) : (
            <span
              className={`mt-1 leading-tight whitespace-nowrap ${
                /^[\x20-\x7e]+$/.test(p.toName) ? "font-display-en tracking-[0.04em]" : "font-display-ja"
              }`}
              style={{ fontSize: fitName(p.toName) }}
            >
              {p.toName}
            </span>
          )}
          <span className="text-[12px] text-vl-ink-soft">
            再入荷<span className="font-type ml-1 font-bold text-vl-ink">{p.year}</span>
          </span>
        </div>
      </div>
      <div className="vl-checker-red h-[8px] w-full opacity-80" style={{ backgroundRepeat: "round" }} aria-hidden />
    </li>
  );
}

/**
 * 第5棚: 長距離再入荷の陳列。起点（廃番から／製造から）ごとに分けて、同じ物差しで比べられるようにする。
 */
export default function RestockPairs({ values, all }: { values: Value[]; all: Value[] }) {
  const pairs = longRestocks(values, all);
  if (pairs.length === 0) return null;
  const groups = [
    { key: "disc", title: "廃番から、再入荷まで", note: "制度や法令で一度終わった日から数える。", items: pairs.filter((p) => p.fromDisc) },
    { key: "made", title: "製造から、再入荷まで", note: "廃番の日付がないので、製造の年から数える。", items: pairs.filter((p) => !p.fromDisc) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.key} aria-label={g.title}>
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-vl-ink pb-2">
            <h3 className="text-[16px] font-bold md:text-[18px]">{g.title}</h3>
            <p className="text-[12px] text-vl-ink-soft">{g.note}</p>
          </div>
          <ul className="grid gap-5 lg:grid-cols-2">
            {g.items.map((p) => (
              <Ticket key={p.from.no} p={p} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
