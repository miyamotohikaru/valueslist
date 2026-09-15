"use client";

import { useMemo, useState } from "react";
import type { Value, Category, Trend, Evidence, ShelfId, ShelfMeta } from "@/data/types";
import { shelves, trendMeta, evidenceMeta } from "@/data/shelves";
import ValueCard, { SHELF_ACCENT } from "./ValueCard";
import ShelfHeader from "./ShelfHeader";
import RestockPairs, { longRestocks } from "./RestockPairs";
import MetaSpecimen from "./MetaSpecimen";

type SortKey = "no" | "made" | "disc";

const CATS: Category[] = ["規範", "人生観", "判断基準"];
const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];
const EVS: Evidence[] = ["law", "curve"];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap border-2 border-vl-ink px-3 py-1.5 text-[12px] font-bold tracking-[0.04em] transition-colors ${
        on ? "bg-vl-ink text-vl-paper" : "bg-vl-card text-vl-ink hover:bg-vl-paper-2"
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

/** 最終行の残りの枠を埋める札のクラス（Tailwind は完全なクラス名が要るので表で持つ） */
const FILL_SM = ["sm:hidden", "sm:block sm:col-span-1"];
const FILL_LG = ["lg:hidden", "lg:block lg:col-span-1", "lg:block lg:col-span-2"];
const FILL_XL = ["xl:hidden", "xl:block xl:col-span-1", "xl:block xl:col-span-2", "xl:block xl:col-span-3"];

function ShelfEnd({ shelf, items }: { shelf: ShelfMeta; items: Value[] }) {
  const n = items.length;
  const r2 = (2 - (n % 2)) % 2;
  const r3 = (3 - (n % 3)) % 3;
  const r4 = (4 - (n % 4)) % 4;
  if (r2 + r3 + r4 === 0) return null;
  const acc = SHELF_ACCENT[String(shelf.id)];
  const years = items.map((v) => v.made?.year).filter((y): y is number => typeof y === "number");
  const count = (t: Trend) => items.filter((v) => v.trend === t).length;
  const tally = TRENDS.filter((t) => count(t) > 0);
  return (
    <li className={`hidden ${FILL_SM[r2]} ${FILL_LG[r3]} ${FILL_XL[r4]}`} aria-hidden>
      <div className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden border-2 border-dashed border-vl-ink/50 p-5">
        <div className="vl-dots pointer-events-none absolute inset-0 opacity-[0.12]" style={{ color: acc.bg === "var(--vl-mustard)" ? "var(--vl-brown)" : acc.bg }} />
        <div className="relative">
          <p className="font-type text-[12px] font-bold tracking-[0.16em] text-vl-ink-soft">END OF SHELF {shelf.no}</p>
          <p className="font-display-ja mt-2 text-[22px] leading-tight">{shelf.name}</p>
        </div>
        <div className="relative mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div>
            <p className="font-display-en text-[44px] leading-none" style={{ color: acc.bg === "var(--vl-mustard)" ? "var(--vl-ink)" : acc.bg }}>
              {n}
            </p>
            <p className="text-[12px] font-bold">点の在庫</p>
          </div>
          {years.length > 0 && (
            <div>
              <p className="font-display-en text-[28px] leading-none">
                {Math.min(...years)}–{Math.max(...years)}
              </p>
              <p className="text-[12px] font-bold">製造年の幅</p>
            </div>
          )}
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
            {tally.map((t) => (
              <li key={t}>
                {trendMeta[t].mark} {trendMeta[t].ja}
                <span className="font-type ml-1 font-bold">{count(t)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function Grid({ items, shelf }: { items: Value[]; shelf?: ShelfMeta }) {
  return (
    <ul className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-8">
      {items.map((v, i) => (
        <li key={v.no}>
          <ValueCard v={v} index={i} />
        </li>
      ))}
      {shelf && <ShelfEnd shelf={shelf} items={items} />}
    </ul>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[64px] shrink-0 text-[12px] font-bold text-vl-ink-soft md:w-[76px]">{label}</span>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">{children}</div>
    </div>
  );
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
            (a.discontinued?.year ?? a.restocked?.year ?? 9999) - (b.discontinued?.year ?? b.restocked?.year ?? 9999),
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
      {/* 絞り込みと並べ替え（本文の列の幅に収める） */}
      <div className="sticky top-[62px] z-30 border-b-2 border-vl-ink bg-vl-paper py-3 md:top-[70px]">
        <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 border-2 border-vl-ink bg-vl-mustard px-3 py-1.5 text-[12px] font-bold"
            aria-expanded={open}
          >
            絞り込み {open ? "▲" : "▼"}
            {active > 0 && <span className="ml-2 rounded-full bg-vl-ink px-1.5 text-vl-paper">{active}</span>}
          </button>
          <span className="ml-1 shrink-0 text-[12px] font-bold text-vl-ink-soft">並べ替え</span>
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
          <span className="font-type ml-auto shrink-0 pl-2 text-[12px] font-bold">
            {filtered.length} / {values.length}
          </span>
        </div>
        {open && (
          <div className="mt-3 space-y-2 border-2 border-vl-ink bg-vl-card p-3">
            <Row label="棚">
              {shelves
                .filter((s) => !s.virtual)
                .map((s) => (
                  <Chip key={String(s.id)} on={shelfF.has(s.id)} onClick={() => setShelfF(toggle(shelfF, s.id))}>
                    {s.no}. {s.name}
                  </Chip>
                ))}
            </Row>
            <Row label="分類">
              {CATS.map((c) => (
                <Chip key={c} on={catF.has(c)} onClick={() => setCatF(toggle(catF, c))}>
                  {c}
                </Chip>
              ))}
            </Row>
            <Row label="傾向">
              {TRENDS.map((t) => (
                <Chip key={t} on={trendF.has(t)} onClick={() => setTrendF(toggle(trendF, t))}>
                  {trendMeta[t].mark} {trendMeta[t].ja}
                </Chip>
              ))}
            </Row>
            <Row label="証拠">
              {EVS.map((e) => (
                <Chip key={e} on={evF.has(e)} onClick={() => setEvF(toggle(evF, e))}>
                  {evidenceMeta[e].ja}
                </Chip>
              ))}
              {active > 0 && (
                <button type="button" onClick={reset} className="vl-link shrink-0 text-[12px] font-bold">
                  すべて解除
                </button>
              )}
            </Row>
          </div>
        )}
      </div>

      {sort === "no" ? (
        <div className="mt-12 space-y-20">
          {shelves.map((s) => {
            if (s.virtual) {
              const pairs = longRestocks(filtered, values);
              if (pairs.length === 0 || active > 0) return null;
              return (
                <section key={String(s.id)} id={`shelf-${s.no}`} className="scroll-mt-36">
                  <ShelfHeader shelf={s} count={pairs.length} />
                  <RestockPairs values={filtered} all={values} />
                </section>
              );
            }
            const items = filtered.filter((v) => v.shelf === s.id);
            if (items.length === 0) return null;
            if (s.id === "meta") {
              return (
                <section key={String(s.id)} id={`shelf-${s.no}`} className="scroll-mt-36">
                  {items.map((v) => (
                    <MetaSpecimen key={v.no} v={v} />
                  ))}
                </section>
              );
            }
            return (
              <section key={String(s.id)} id={`shelf-${s.no}`} className="scroll-mt-36">
                <ShelfHeader shelf={s} count={items.length} />
                <Grid items={items} shelf={s} />
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10">
          <Grid items={filtered} />
        </div>
      )}

      {filtered.length === 0 && <p className="mt-16 text-center text-[14px] font-bold text-vl-ink-soft">該当する在庫がありません。</p>}
    </div>
  );
}
