"use client";

import { useMemo, useState } from "react";
import type { Value, Category, Trend, Evidence, ShelfId } from "@/data/types";
import { shelves, trendMeta, evidenceMeta } from "@/data/shelves";
import ValueCard from "./ValueCard";
import ShelfHeader from "./ShelfHeader";
import RestockPairs, { longRestocks } from "./RestockPairs";

type SortKey = "no" | "made" | "disc";

const CATS: Category[] = ["規範", "人生観", "判断基準"];
const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];
const EVS: Evidence[] = ["law", "curve"];

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-type whitespace-nowrap border-2 border-vl-ink px-3 py-1 text-[11px] font-bold tracking-[0.12em] transition-colors ${
        on ? "vl-offset-sm bg-vl-ink text-vl-paper" : "bg-vl-card text-vl-ink hover:bg-vl-paper-2"
      }`}
      aria-pressed={on}
    >
      {children}
    </button>
  );
}

function toggle<T>(set: Set<T>, x: T) {
  const n = new Set(set);
  if (n.has(x)) n.delete(x);
  else n.add(x);
  return n;
}

export default function IndexView({ values }: { values: Value[] }) {
  const [shelfF, setShelfF] = useState<Set<ShelfId>>(new Set());
  const [catF, setCatF] = useState<Set<Category>>(new Set());
  const [trendF, setTrendF] = useState<Set<Trend>>(new Set());
  const [evF, setEvF] = useState<Set<Evidence>>(new Set());
  const [sort, setSort] = useState<SortKey>("no");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = values.filter(
      (v) =>
        (shelfF.size === 0 || shelfF.has(v.shelf)) &&
        (catF.size === 0 || catF.has(v.category)) &&
        (trendF.size === 0 || trendF.has(v.trend)) &&
        (evF.size === 0 || evF.has(v.evidence)),
    );
    if (sort === "made") {
      list = list.slice().sort((a, b) => (a.made?.year ?? 9999) - (b.made?.year ?? 9999));
    } else if (sort === "disc") {
      list = list
        .slice()
        .sort(
          (a, b) =>
            (a.discontinued?.year ?? a.restocked?.year ?? 9999) -
            (b.discontinued?.year ?? b.restocked?.year ?? 9999),
        );
    }
    return list;
  }, [values, shelfF, catF, trendF, evF, sort]);

  const active = shelfF.size + catF.size + trendF.size + evF.size;
  const reset = () => {
    setShelfF(new Set());
    setCatF(new Set());
    setTrendF(new Set());
    setEvF(new Set());
  };

  return (
    <div>
      {/* 絞り込みバー */}
      <div className="sticky top-[62px] z-30 -mx-4 bg-vl-paper/95 px-4 py-3 md:top-[66px] md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="font-type vl-offset-sm border-2 border-vl-ink bg-vl-mustard px-3 py-1 text-[11px] font-bold tracking-[0.12em]"
          >
            絞り込み {open ? "∧" : "∨"}
            {active > 0 && <span className="ml-2 rounded-full bg-vl-ink px-1.5 text-vl-paper">{active}</span>}
          </button>
          <span className="font-type ml-1 text-[10px] tracking-[0.2em] text-vl-ink-soft">SORT</span>
          {(
            [
              ["no", "型番順"],
              ["made", "製造年順"],
              ["disc", "廃番・再入荷順"],
            ] as [SortKey, string][]
          ).map(([k, label]) => (
            <Chip key={k} on={sort === k} onClick={() => setSort(k)}>
              {label}
            </Chip>
          ))}
          <span className="font-type ml-auto text-[11px] tracking-[0.15em] text-vl-ink-soft">
            {filtered.length} / {values.length}
          </span>
        </div>
        {open && (
          <div className="mt-3 space-y-2 border-2 border-vl-ink bg-vl-card p-3">
            <Row label="棚 SHELF">
              {shelves
                .filter((s) => !s.virtual)
                .map((s) => (
                  <Chip key={String(s.id)} on={shelfF.has(s.id)} onClick={() => setShelfF(toggle(shelfF, s.id))}>
                    {s.no}. {s.name}
                  </Chip>
                ))}
            </Row>
            <Row label="分類 TYPE">
              {CATS.map((c) => (
                <Chip key={c} on={catF.has(c)} onClick={() => setCatF(toggle(catF, c))}>
                  {c}
                </Chip>
              ))}
            </Row>
            <Row label="傾向 TREND">
              {TRENDS.map((t) => (
                <Chip key={t} on={trendF.has(t)} onClick={() => setTrendF(toggle(trendF, t))}>
                  {trendMeta[t].mark} {trendMeta[t].ja}
                </Chip>
              ))}
            </Row>
            <Row label="証拠 EVIDENCE">
              {EVS.map((e) => (
                <Chip key={e} on={evF.has(e)} onClick={() => setEvF(toggle(evF, e))}>
                  {evidenceMeta[e].ja}
                </Chip>
              ))}
              {active > 0 && (
                <button type="button" onClick={reset} className="font-type vl-link ml-2 text-[11px]">
                  すべて解除
                </button>
              )}
            </Row>
          </div>
        )}
      </div>

      {/* 棚ごと */}
      {sort === "no" ? (
        <div className="mt-10 space-y-20">
          {shelves.map((s) => {
            if (s.virtual) {
              // 第5棚: 再入荷ペアの陳列（絞り込み中は元の在庫が残っているものだけ）
              const pairs = longRestocks(filtered, values);
              if (pairs.length === 0 || active > 0) return null;
              return (
                <section key={String(s.id)} id={`shelf-${s.no}`} className="scroll-mt-32">
                  <ShelfHeader shelf={s} count={pairs.length} />
                  <RestockPairs values={filtered} all={values} />
                  <div className="mt-10 h-[10px] border-y-[3px] border-vl-ink bg-vl-paper-2" aria-hidden />
                </section>
              );
            }
            const items = filtered.filter((v) => v.shelf === s.id);
            if (items.length === 0) return null;
            return (
              <section key={String(s.id)} id={`shelf-${s.no}`} className="scroll-mt-32">
                <ShelfHeader shelf={s} count={items.length} />
                <Grid items={items} />
                <div className="mt-10 h-[10px] border-y-[3px] border-vl-ink bg-vl-paper-2" aria-hidden />
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10">
          <Grid items={filtered} />
        </div>
      )}

      {filtered.length === 0 && (
        <p className="font-type mt-16 text-center text-[13px] tracking-[0.15em] text-vl-ink-soft">
          該当する在庫がありません。
        </p>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-type w-[104px] shrink-0 text-[10px] tracking-[0.2em] text-vl-ink-soft">{label}</span>
      {children}
    </div>
  );
}

function Grid({ items }: { items: Value[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-x-6 md:gap-y-8 lg:grid-cols-4">
      {items.map((v, i) => (
        <li key={v.no}>
          <ValueCard v={v} index={i} />
        </li>
      ))}
    </ul>
  );
}
