"use client";

import { useMemo, useState } from "react";
import type { Value, Category, Trend, Evidence, ShelfId } from "@/data/types";
import { shelves } from "@/data/shelves";
import { type Lang } from "@/i18n/lang";
import { t, type UIKey } from "@/i18n/ui";
import { tIndex } from "@/i18n/ui.index";
import { shelfName } from "@/i18n/ui.value";
import { localize } from "@/data/i18n";
import ColumnGrid from "./ColumnGrid";

type SortKey = "no" | "made" | "disc";

const CATS: Category[] = ["規範", "人生観", "判断基準"];
const TRENDS: Trend[] = ["up", "steady", "down", "discontinued", "restocked"];
const EVS: Evidence[] = ["law", "curve"];

/** 並べ替えの chip に出す言葉 */
const SORT_KEYS: [SortKey, UIKey][] = [
  ["no", "sortNo"],
  ["made", "sortMade"],
  ["disc", "sortDisc"],
];

/** 傾向の chip に出す言葉｡判子の大文字とは別に持っている */
const TREND_KEYS = {
  up: "trendUp",
  steady: "trendSteady",
  down: "trendDown",
  discontinued: "trendDiscontinued",
  restocked: "trendRestocked",
} as const;

/** 証拠の chip に出す言葉 */
const EV_KEYS = { law: "evLaw", curve: "evCurve" } as const;

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

export default function IndexView({ values: raw, lang }: { values: Value[]; lang: Lang }) {
  // その言語で読めるカードにしてから絞り込む（名前や意味で並べ替えるため）
  const values = useMemo(() => raw.map((v) => localize(v, lang)), [raw, lang]);
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

  // グループごとに分けて並べる（並べ替えはグループの中でかかる）
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
        <h2 className="vl-sec__title">{t(lang, "indexTitle")}</h2>
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
            {`${t(lang, "filter")}${active > 0 ? ` (${active})` : ""}`}
          </button>
          {/* 件数は1行目の右端｡狭い画面で1行余分に増えないように */}
          <span className="vl-bar__count">
            {filtered.length} / {values.length}
          </span>
        </div>
        <div className="vl-bar__group">
          <span className="vl-bar__label">{t(lang, "sortLabel")}</span>
          {SORT_KEYS.map(([k, key]) => (
            <Chip key={k} on={sort === k} onClick={() => setSort(k)}>
              {t(lang, key)}
            </Chip>
          ))}
        </div>
      </div>

      {open && (
        <div className="vl-filters">
          <div className="vl-filters__row">
            <span>{t(lang, "group")}</span>
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
            <span>{t(lang, "category")}</span>
            <div>
              {CATS.map((c) => (
                <Chip key={c} on={catF.has(c)} onClick={() => setCatF(toggle(catF, c))}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>
          <div className="vl-filters__row">
            <span>{t(lang, "trend")}</span>
            <div>
              {TRENDS.map((x) => (
                <Chip key={x} on={trendF.has(x)} onClick={() => setTrendF(toggle(trendF, x))}>
                  {tIndex(lang, TREND_KEYS[x])}
                </Chip>
              ))}
            </div>
          </div>
          <div className="vl-filters__row">
            <span>{t(lang, "evidence")}</span>
            <div>
              {EVS.map((e) => (
                <Chip key={e} on={evF.has(e)} onClick={() => setEvF(toggle(evF, e))}>
                  {tIndex(lang, EV_KEYS[e])}
                </Chip>
              ))}
              {active > 0 && (
                <button type="button" onClick={reset} className="vl-chip">
                  {t(lang, "clearAll")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 札｡グループごとに分けて並べる */}
      {sections.map((g) => (
        <section key={String(g.shelf.id)} id={`shelf-${g.shelf.no}`} className="vl-shelf">
          <div className="vl-shelf__head">
            <p className="vl-shelf__no">GROUP {g.shelf.no}</p>
            <h3 className="vl-shelf__name">{shelfName(lang, g.shelf)}</h3>
            <p className="vl-shelf__n">{`${g.items.length}${t(lang, "countUnit")}`}</p>
          </div>
          <ColumnGrid items={g.items} variant="print" lang={lang} />
        </section>
      ))}

      {filtered.length === 0 && <p className="vl-empty">{t(lang, "empty")}</p>}
    </div>
  );
}
