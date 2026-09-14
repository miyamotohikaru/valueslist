import Link from "next/link";
import { Fragment } from "react";
import type { Value } from "@/data/types";
import { values, byMadeYear } from "@/data/values";
import { shelfById } from "@/data/shelves";
import { lineageById, resolveNode, type Lineage, type LineageNode } from "@/data/lineages";
import { scaleYear, ERAS, ERA_MIN, ERA_MAX } from "@/lib/timescale";
import { SHELF_ACCENT } from "./ValueCard";
import EraBars, { countByEra } from "./EraBars";
import MobileBreak from "@/components/MobileBreak";

/** 年の目盛（ヘッダーに数字で出す年） */
const TICKS = [1200, 1600, 1868, 1945, 2000];
/** 左カラム（型番・商品名）の幅。PC のみ */
const LEFT = "372px";
/** 携帯の行: 名前の段＋帯の段 */
const SP_ROW = 72;
const SP_NAME_H = 34;
const SP_BAR_CENTER = (SP_NAME_H + (SP_ROW - SP_NAME_H) / 2) / SP_ROW; // 行の高さに対する帯の中心

const pct = (year: number) => scaleYear(year) * 100;

/** 帯の座標（%）。SpanStrip と同じ意味: 製造→廃番（または現在）、再入荷は点 */
function spanOf(v: Value) {
  const made = v.made!;
  const start = pct(made.year);
  const end = pct(v.discontinued ? v.discontinued.year : ERA_MAX);
  const restock = v.restocked ? pct(v.restocked.year) : null;
  return { start, end, restock, approx: !!made.approx, active: !v.discontinued };
}

const hatch = (color: string) => `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 4px)`;

/* ------------------------------------------------------------------ */
/* 小さな部品                                                            */
/* ------------------------------------------------------------------ */

function CrossMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <g stroke="var(--vl-red)" strokeWidth="2.4" strokeLinecap="round">
        <line x1="2.5" y1="2.5" x2="13.5" y2="13.5" />
        <line x1="13.5" y1="2.5" x2="2.5" y2="13.5" />
      </g>
    </svg>
  );
}

function ArrowMark({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 16" aria-hidden>
      <polygon points="0,0 10,8 0,16" fill={color} />
    </svg>
  );
}

function RestockDot({ className = "" }: { className?: string }) {
  return (
    <span className={`block h-3 w-3 rounded-full border-[3.5px] border-vl-red bg-vl-paper ${className}`} />
  );
}

function LoopTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-type inline-block shrink-0 border border-vl-red px-1 text-[8px] font-bold leading-[1.7] tracking-[0.18em] text-vl-red ${className}`}
    >
      LOOP
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 時間軸のヘッダー（sticky）                                            */
/* ------------------------------------------------------------------ */

function AxisHeader() {
  return (
    <div className="sticky top-[62px] z-20 border-b-2 border-vl-ink bg-vl-paper md:top-[66px]">
      <div className="grid md:grid-cols-[var(--tl-left)_1fr]">
        <div className="font-type hidden items-end justify-between px-3 pb-[7px] text-[9px] tracking-[0.25em] text-vl-ink-soft md:flex">
          <span>NO. · 棚 · 商品名</span>
          <span>MFD.</span>
        </div>
        <div className="relative h-[46px]">
          <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
            {/* 時代の帯と名前 */}
            {ERAS.map((e, i) => (
              <div
                key={e.from}
                className={`absolute top-0 h-[22px] border-l border-vl-line ${i % 2 ? "bg-vl-paper-2/70" : ""}`}
                style={{ left: `${pct(e.from)}%`, width: `${pct(e.to) - pct(e.from)}%` }}
              >
                <span className="font-type absolute left-[5px] top-[5px] whitespace-nowrap text-[9px] font-bold tracking-[0.12em]">
                  {e.ja}
                </span>
              </div>
            ))}
            <div className="absolute right-0 top-0 h-[22px] border-l border-vl-line" />
            {/* 年の目盛 */}
            {TICKS.map((y, i) => (
              <div key={y} className="absolute bottom-0 h-[22px]" style={{ left: `${pct(y)}%` }}>
                <span className="absolute bottom-0 left-0 h-[7px] border-l border-vl-ink" />
                <span
                  className={`font-type absolute bottom-[8px] left-0 whitespace-nowrap text-[10px] font-bold tracking-[0.04em] ${
                    i === 0 ? "" : "-translate-x-1/2"
                  }`}
                >
                  {y}
                </span>
              </div>
            ))}
          </div>
          <span className="font-type absolute bottom-[8px] right-0 whitespace-nowrap text-[9px] tracking-[0.2em] text-vl-ink-soft">
            YEAR →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 一行（＝一商品）                                                       */
/* ------------------------------------------------------------------ */

function Row({ v, loop }: { v: Value; loop: boolean }) {
  const acc = SHELF_ACCENT[String(v.shelf)];
  const shelf = shelfById(v.shelf);
  const { start, end, restock, approx, active } = spanOf(v);
  const endYear = v.restocked ? v.restocked.year : v.discontinued ? v.discontinued.year : null;
  const labelAt = restock !== null && restock > end ? restock : end;
  const tip = [
    `NO.${v.no} ${v.name}`,
    `製造 ${v.made!.label}`,
    v.discontinued ? `廃番 ${v.discontinued.label}` : "現役",
    v.restocked ? `再入荷 ${v.restocked.label}` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <li className="border-b border-vl-line">
      <Link
        href={`/values/${v.no}`}
        title={tip}
        className="group grid transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-[2px] hover:bg-vl-card hover:shadow-[3px_3px_0_var(--vl-ink)] md:h-11 md:grid-cols-[var(--tl-left)_1fr] md:grid-rows-1"
      >
        {/* 左: 型番・棚・商品名・製造年 */}
        <div className="flex min-w-0 items-center gap-2 px-2 md:px-3" style={{ height: "var(--tl-name-h)" }}>
          <span className="font-type w-[50px] shrink-0 text-[11px] font-bold tracking-[0.1em]">NO.{v.no}</span>
          <span
            className="font-display-en grid h-4 w-4 shrink-0 place-items-center border border-vl-ink text-[10px] leading-none"
            style={{ background: acc.bg, color: acc.fg }}
            aria-label={`棚 ${shelf.no}`}
          >
            {shelf.no}
          </span>
          <span className="font-display-ja min-w-0 truncate text-[14px] leading-none md:text-[15px]">{v.name}</span>
          {loop && <LoopTag />}
          <span className="font-type ml-auto shrink-0 text-[11px] tracking-[0.08em] text-vl-ink-soft">
            {approx ? "c." : ""}
            {v.made!.year}
          </span>
        </div>

        {/* 右: 時間軸上の帯 */}
        <div className="relative" style={{ height: "var(--tl-bar-h)" }}>
          <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
            {/* 概算の製造年: 左端をハッチ */}
            {approx && (
              <span
                className="absolute top-1/2 h-[10px] -translate-y-1/2"
                style={{ right: `${100 - start}%`, width: 18, maxWidth: `${start}%`, background: hatch(acc.bar) }}
              />
            )}
            {/* 在庫の帯 */}
            <span
              className="absolute top-1/2 h-[10px] min-w-[6px] -translate-y-1/2"
              style={{ left: `${start}%`, width: `${Math.max(0, end - start)}%`, background: acc.bar }}
            />
            {/* 再入荷: 点線と赤い点 */}
            {restock !== null && restock > end && (
              <>
                <span
                  className="absolute top-1/2 -translate-y-[1px] border-t-2 border-dotted border-vl-red"
                  style={{ left: `${end}%`, width: `${restock - end}%` }}
                />
                <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${restock}%` }}>
                  <RestockDot />
                </span>
              </>
            )}
            {/* 右端: 廃番は赤い×、現役は矢印 */}
            {active ? (
              // 先端を帯の少し先（+2px）へ出す
              <span className="absolute top-1/2 h-4 w-[10px] -translate-y-1/2" style={{ left: `calc(${end}% - 8px)` }}>
                <ArrowMark color={acc.bar} className="block h-full w-full" />
              </span>
            ) : (
              <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" style={{ left: `${end}%` }}>
                <CrossMark className="block h-full w-full" />
              </span>
            )}
            {/* 廃番・再入荷の年 */}
            {endYear !== null && (
              <span
                className="font-type absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-bold tracking-[0.06em] text-vl-red"
                style={{ left: `calc(${labelAt}% + 11px)` }}
              >
                {endYear}
                {v.restocked?.as && <span className="hidden md:inline"> {v.restocked.as}</span>}
              </span>
            )}
          </div>
          {active && (
            <span className="font-type absolute inset-y-0 right-0 flex w-[var(--tl-gutter)] items-center justify-end pr-1 text-[9px] tracking-[0.2em] text-vl-ink-soft">
              現役
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* 凡例                                                                  */
/* ------------------------------------------------------------------ */

function Legend() {
  const items: { glyph: React.ReactNode; label: string }[] = [
    { glyph: <span className="block h-[8px] w-[22px] bg-vl-ink" />, label: "在庫期間（製造→廃番）" },
    { glyph: <span className="block h-[8px] w-[14px]" style={{ background: hatch("var(--vl-ink)") }} />, label: "製造年は概算" },
    { glyph: <CrossMark className="h-[14px] w-[14px]" />, label: "廃番" },
    { glyph: <ArrowMark color="var(--vl-ink)" className="h-[14px] w-[9px]" />, label: "現役" },
    { glyph: <RestockDot />, label: "再入荷" },
    { glyph: <LoopTag />, label: "FIG.3 の環" },
  ];
  return (
    <ul className="font-type flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.12em] text-vl-ink-soft">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span className="flex h-4 min-w-[24px] items-center justify-center">{it.glyph}</span>
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* FIG.3 150年の円環                                                     */
/* ------------------------------------------------------------------ */

type RingNode = { n: LineageNode; v: Value | undefined };

function NodeName({ node }: { node: RingNode }) {
  return node.v ? (
    <Link href={`/values/${node.v.no}`} className="transition-colors hover:text-vl-red">
      {node.n.label}
    </Link>
  ) : (
    <>{node.n.label}</>
  );
}

/** PC: 4点を横に並べ、上の線で結び、下の線で元の場所へ戻す */
const DOT_Y = 26;
function RingH({ nodes }: { nodes: RingNode[] }) {
  const n = nodes.length;
  const cuts = Array.from({ length: n - 1 }, (_, i) => ((i + 1) / n) * 100);
  return (
    <div className="relative mx-[4%] mt-10 hidden md:block">
      {/* 進む線 */}
      <div className="absolute inset-x-0 border-t-2 border-vl-red" style={{ top: DOT_Y }} />
      {/* 戻る線（側面と底） */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-[32px] border-2 border-t-0 border-vl-red"
        style={{ top: DOT_Y }}
      />
      {cuts.map((x) => (
        <span
          key={x}
          className="absolute block h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-y-[5px] border-l-[9px] border-y-transparent border-l-vl-red"
          style={{ left: `${x}%`, top: DOT_Y }}
        />
      ))}
      <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center gap-2 bg-vl-card px-3">
        <span className="block h-0 w-0 border-y-[5px] border-r-[9px] border-y-transparent border-r-vl-red" />
        <span className="font-type text-[10px] font-bold tracking-[0.2em] text-vl-red">150年後、元の棚へ</span>
      </span>

      <ol className="relative grid pb-10" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {nodes.map((node, i) => (
          <li key={i} className="flex flex-col items-center px-3 text-center">
            <span className="font-type h-[20px] whitespace-nowrap text-[10px] tracking-[0.12em] text-vl-ink-soft">
              {node.n.yearLabel ?? node.n.year}
            </span>
            <span className="block h-3 w-3 rounded-full border-[3px] border-vl-red bg-vl-card" />
            <span className="font-display-ja mt-3 text-[17px] leading-[1.3]">
              <NodeName node={node} />
            </span>
            {node.v && (
              <span className="font-type mt-1 text-[9px] tracking-[0.18em] text-vl-red">NO.{node.v.no}</span>
            )}
            {node.n.note && (
              <span className="font-type mt-1 text-[10px] leading-[1.5] text-vl-ink-soft">{node.n.note}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 携帯: 縦に並べ、左に細い環（下る線と、戻る線） */
const SP_LI = 78;
function RingV({ nodes }: { nodes: RingNode[] }) {
  return (
    <div className="relative mt-8 md:hidden">
      {/* 環（右辺が進む線、左辺が戻る線） */}
      <div
        className="absolute left-0 w-[18px] rounded-[9px] border-2 border-vl-red"
        style={{ top: SP_LI / 2, bottom: SP_LI / 2 }}
      />
      {/* 戻る向き（上） */}
      <span className="absolute left-0 top-1/2 block h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-x-[5px] border-b-[9px] border-x-transparent border-b-vl-red" />
      <ol className="relative">
        {nodes.map((node, i) => (
          <li key={i} className="relative flex flex-col justify-center pl-[34px]" style={{ height: SP_LI }}>
            <span className="absolute left-[17px] top-1/2 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-vl-red bg-vl-card" />
            {i > 0 && (
              <span className="absolute left-[17px] top-0 block h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-x-[5px] border-t-[9px] border-x-transparent border-t-vl-red" />
            )}
            <span className="font-type text-[10px] tracking-[0.12em] text-vl-ink-soft">
              {node.n.yearLabel ?? node.n.year}
            </span>
            <span className="font-display-ja mt-0.5 text-[16px] leading-[1.3]">
              <NodeName node={node} />
              {node.v && (
                <span className="font-type ml-2 text-[9px] tracking-[0.18em] text-vl-red">NO.{node.v.no}</span>
              )}
            </span>
            {node.n.note && (
              <span className="font-type mt-0.5 text-[10px] leading-[1.5] text-vl-ink-soft">{node.n.note}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function LoopPanel({ lineage }: { lineage: Lineage }) {
  const nodes: RingNode[] = lineage.nodes.map((n) => ({ n, v: resolveNode(n) }));
  const parts = lineage.title.split(/\s*→\s*/);
  return (
    <div className="relative">
      <div className="vl-offset border-2 border-vl-ink bg-vl-card">
        <div className="border-b-2 border-vl-ink px-4 py-3 md:px-8 md:py-4">
          <h2 className="font-type text-[12px] font-bold tracking-[0.25em] text-vl-red">FIG.3 150年の円環</h2>
          <p className="font-display-en mt-1 text-[24px] leading-none tracking-[0.04em] md:text-[30px]">{lineage.en}</p>
        </div>
        <div className="px-4 py-6 md:px-8 md:py-8">
          <p className="font-display-ja text-[19px] leading-[1.45] md:text-[26px]">
            {parts.map((p, i) => (
              <Fragment key={i}>
                <span className="whitespace-nowrap">{p}</span>
                {i < parts.length - 1 && <span className="mx-1.5 text-vl-red md:mx-2">→</span>}
              </Fragment>
            ))}
          </p>
          <p className="vl-justify mt-3 max-w-[48em] text-[13px] leading-[1.9] text-vl-ink-soft md:text-[14px]">
            {lineage.lead}
          </p>
          <RingH nodes={nodes} />
          <RingV nodes={nodes} />
          <p className="mt-6 text-[13px] font-bold">
            <Link href="/lineage" className="vl-link">
              系譜ページで、環の全部を読む →
            </Link>
          </p>
        </div>
      </div>
      <span className="font-script pointer-events-none absolute -top-4 right-5 rotate-[-8deg] text-[26px] text-vl-red md:right-8 md:text-[30px]">
        round trip!
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 末尾のボタン                                                          */
/* ------------------------------------------------------------------ */

function BigButton({ href, ja, en, primary = false }: { href: string; ja: string; en: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`vl-offset flex items-center justify-between gap-4 border-2 border-vl-ink px-5 py-5 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 md:px-7 md:py-6 ${
        primary ? "bg-vl-red text-vl-paper" : "bg-vl-card text-vl-ink"
      }`}
    >
      <span className="min-w-0">
        <span className="font-type block text-[10px] tracking-[0.3em] opacity-80">{en}</span>
        <span className="font-display-ja mt-1 block text-[22px] leading-none md:text-[28px]">{ja}</span>
      </span>
      <span className="shrink-0 text-[32px] font-bold leading-none md:text-[40px]">→</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* ページ本体                                                            */
/* ------------------------------------------------------------------ */

export default function TimelineView() {
  const rows = byMadeYear();
  const undated = values.length - rows.length;
  const loop = lineageById("umare");
  const loopNames = new Set(loop?.nodes.map((n) => n.ref).filter(Boolean) ?? []);
  const loopPts = rows
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => loopNames.has(v.name))
    .map(({ v, i }) => ({ x: spanOf(v).start, i }));
  const eraCounts = countByEra(rows);
  const topEra = ERAS[eraCounts.indexOf(Math.max(...eraCounts))] ?? ERAS[0];

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* 見出し */}
      <section className="py-10 md:py-16">
        <p className="font-type text-[11px] tracking-[0.35em] text-vl-ink-soft">TIMELINE · 製造年順</p>
        <h1 className="font-display-ja mt-4 text-[40px] leading-[1.05] md:text-[64px]">年表</h1>
        <p className="font-display-en mt-2 text-[60px] leading-[0.86] tracking-[0.01em] text-vl-red md:text-[112px]">
          INVENTORY
          <br />
          BY YEAR
        </p>
        <p className="mt-6 text-[15px] font-bold leading-[1.9] md:text-[19px]">
          価値観を、製造年の順に並べる。
          <br />
          いちばん古い在庫と、いちばん新しい在庫は、
          <MobileBreak />
          しばしば同じ商品だ。
        </p>
        <p className="font-type mt-5 text-[11px] tracking-[0.22em] text-vl-ink-soft">
          <span className="whitespace-nowrap">
            {rows.length} ITEMS · {ERA_MIN}–{ERA_MAX}
          </span>{" "}
          <span className="whitespace-nowrap">· SORTED BY MFD. YEAR</span>
        </p>
      </section>

      <div className="vl-rule" />

      {/* FIG.2 製造工場別 出荷数 */}
      <section className="grid gap-8 py-12 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-12 md:py-16">
        <div>
          <h2 className="font-type text-[12px] font-bold tracking-[0.25em] text-vl-red">FIG.2 製造工場別 出荷数</h2>
          <p className="font-display-ja mt-3 text-[24px] leading-[1.3] md:text-[30px]">工場は五つある。</p>
          <p className="mt-4 text-[13px] leading-[1.9] text-vl-ink-soft md:text-[14px]">
            製造年を、時代ごとの工場に振り分けて数えた。
            <br />
            出荷がいちばん多いのは、{topEra.ja}の工場。
            <br />
            「昔からある」に見える在庫ほど、
            <MobileBreak />
            新しい工場の出荷だったりする。
          </p>
        </div>
        <EraBars items={rows} className="w-full max-w-[560px] md:justify-self-end" />
      </section>

      <div className="vl-rule" />

      {/* 在庫台帳（ガントチャート） */}
      <section className="py-12 md:py-16">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display-en text-[13px] tracking-[0.22em] text-vl-red">STOCK LEDGER</p>
            <h2 className="font-display-ja text-[24px] leading-tight md:text-[30px]">全在庫、製造年順</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-vl-ink-soft">
              帯が在庫の期間。左端が製造、右端が廃番。
              <br />
              行を押すとカードに飛ぶ。
            </p>
          </div>
          <Legend />
        </div>

        <div
          className="border-t-2 border-vl-ink [--tl-gutter:44px] [--tl-name-h:34px] [--tl-bar-h:38px] md:[--tl-gutter:60px] md:[--tl-name-h:44px] md:[--tl-bar-h:44px]"
          style={{ "--tl-left": LEFT } as React.CSSProperties}
        >
          <AxisHeader />
          <div className="relative">
            {/* 背景: 時代の縞 */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 md:left-[var(--tl-left)]" aria-hidden>
              <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
                {ERAS.map((e, i) => (
                  <div
                    key={e.from}
                    className={`absolute inset-y-0 border-l border-vl-line ${i % 2 ? "bg-vl-paper-2/45" : ""}`}
                    style={{ left: `${pct(e.from)}%`, width: `${pct(e.to) - pct(e.from)}%` }}
                  />
                ))}
                <div className="absolute inset-y-0 right-0 border-l border-vl-line" />
              </div>
            </div>

            <ol className="relative">
              {rows.map((v) => (
                <Row key={v.no} v={v} loop={loopNames.has(v.name)} />
              ))}
            </ol>

            {/* FIG.3 の環を、赤い糸で行のあいだにつなぐ */}
            {loopPts.length >= 2 && (
              <div
                className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[1] md:left-[var(--tl-left)]"
                aria-hidden
              >
                <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
                  <svg className="h-full w-full" viewBox={`0 0 100 ${rows.length}`} preserveAspectRatio="none">
                    <polyline
                      className="hidden md:block"
                      points={loopPts.map((p) => `${p.x},${p.i + 0.5}`).join(" ")}
                      fill="none"
                      stroke="var(--vl-red)"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                      vectorEffect="non-scaling-stroke"
                    />
                    <polyline
                      className="md:hidden"
                      points={loopPts.map((p) => `${p.x},${p.i + SP_BAR_CENTER}`).join(" ")}
                      fill="none"
                      stroke="var(--vl-red)"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {undated > 0 && (
          <p className="font-type mt-3 text-[10px] tracking-[0.15em] text-vl-ink-soft">
            製造年が特定できず、年表に載せていない在庫: {undated} ITEMS
          </p>
        )}
      </section>

      {/* FIG.3 150年の円環 */}
      {loop && (
        <section className="py-4 md:py-8">
          <LoopPanel lineage={loop} />
        </section>
      )}

      {/* 末尾のボタン */}
      <section className="grid gap-5 py-14 md:grid-cols-2 md:gap-6 md:py-20">
        <BigButton href="/lineage" ja="系譜ページへ →" en="LINEAGE · 再入荷の系譜" primary />
        <BigButton href="/" ja="索引へ →" en="INDEX · 棚に戻る" />
      </section>
    </div>
  );
}
