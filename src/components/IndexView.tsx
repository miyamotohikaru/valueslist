"use client";

import { useMemo, useState } from "react";
import type { Value, Category, Trend, Evidence, ShelfId } from "@/data/types";
import { shelves, trendMeta, evidenceMeta } from "@/data/shelves";
import ColumnGrid from "./ColumnGrid";

type SortKey = "no" | "made" | "disc";

const CATS: Category[] = ["規範", "人生観", "判断基準"];
const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];
const EVS: Evidence[] = ["law", "curve"];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`vl-chip${on ? " is-on" : ""}`} aria-pressed={on}>
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
    if (sort === "made") list = list.slice().sort((a, b) => (a.made?.year ?? 9999) - (b.made?.year ?? 9999));
    else if (sort === "disc")
      list = list
        .slice()
        .sort(
          (a, b) =>
            (a.discontinued?.year ?? a.restocked?.year ?? 9999) - (b.discontinued?.year ?? b.restocked?.year ?? 9999),
        );
    return list;
  }, [values, shelfF, catF, trendF, evF, sort]);

  // 棚ごとに分けて並べる（並べ替えは棚の中でかかる）
  const sections = shelves
    .filter((s) => !s.virtual)
    .map((s) => ({ shelf: s, items: filtered.filter((v) => v.shelf === s.id) }))
    .filter((g) => g.items.length > 0);

  const active = shelfF.size + catF.size + trendF.size + evF.size;
  const reset = () => {
    setShelfF(new Set());
    setCatF(new Set());
    setTrendF(new Set());
    setEvF(new Set());
  };

  return (
    <div id="index" className="vl-index">
      {/* 見出し */}
      <div className="vl-sec">
        <p className="vl-sec__kicker">01 — INDEX / {values.length} ITEMS</p>
        <h2 className="vl-sec__title">図鑑</h2>
      </div>

      {/* 絞り込みと並べ替え｡別のことなので分けて置く */}
      <div className="vl-bar">
        <div className="vl-bar__group">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`vl-chip vl-chip--filter${open || active ? " is-on" : ""}`}
            aria-expanded={open}
          >
            絞り込み{active > 0 ? ` (${active})` : ""}
          </button>
        </div>
        <div className="vl-bar__group">
          <span className="vl-bar__label">並べ替え</span>
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
        </div>
        <span className="vl-bar__count">
          {filtered.length} / {values.length}
        </span>
      </div>

      {open && (
        <div className="vl-filters">
          <div className="vl-filters__row">
            <span>棚</span>
            <div>
              {shelves
                .filter((s) => !s.virtual)
                .map((s) => (
                  <Chip key={String(s.id)} on={shelfF.has(s.id)} onClick={() => setShelfF(toggle(shelfF, s.id))}>
                    {s.no}. {s.name}
                  </Chip>
                ))}
            </div>
          </div>
          <div className="vl-filters__row">
            <span>分類</span>
            <div>
              {CATS.map((c) => (
                <Chip key={c} on={catF.has(c)} onClick={() => setCatF(toggle(catF, c))}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>
          <div className="vl-filters__row">
            <span>傾向</span>
            <div>
              {TRENDS.map((t) => (
                <Chip key={t} on={trendF.has(t)} onClick={() => setTrendF(toggle(trendF, t))}>
                  {trendMeta[t].ja}
                </Chip>
              ))}
            </div>
          </div>
          <div className="vl-filters__row">
            <span>証拠</span>
            <div>
              {EVS.map((e) => (
                <Chip key={e} on={evF.has(e)} onClick={() => setEvF(toggle(evF, e))}>
                  {evidenceMeta[e].ja}
                </Chip>
              ))}
              {active > 0 && (
                <button type="button" onClick={reset} className="vl-chip">
                  すべて解除
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 札｡棚ごとに分けて並べる */}
      {sections.map((g) => (
        <section key={String(g.shelf.id)} id={`shelf-${g.shelf.no}`} className="vl-shelf">
          <div className="vl-shelf__head">
            <p className="vl-shelf__no">SHELF {g.shelf.no}</p>
            <h3 className="vl-shelf__name">{g.shelf.name}</h3>
            <p className="vl-shelf__n">{g.items.length}点</p>
          </div>
          <ColumnGrid items={g.items} variant="print" />
        </section>
      ))}

      {filtered.length === 0 && <p className="vl-empty">該当する在庫がありません｡</p>}
    </div>
  );
}
