import Link from "next/link";
import { Fragment } from "react";
import type { Value } from "@/data/types";
import { values, byMadeYear } from "@/data/values";
import { shelfById } from "@/data/shelves";
import {
  lineageById,
  resolveNode,
  type Lineage,
  type LineageNode,
} from "@/data/lineages";
import { scaleYear, ERAS, ERA_MAX } from "@/lib/timescale";
import { SHELF_ACCENT } from "./ValueCard";
import { recipeOf } from "./PrintCard";
import HalftoneArt from "./print/HalftoneArt";
import { countByEra } from "./EraBars";

/** 年の目盛（ヘッダーに数字で出す年） */
const TICKS = [1200, 1600, 1868, 1945, 2000];
/** 左カラム（棚・型番・図版・名前）の幅｡PC のみ */
const LEFT = "372px";

const pct = (year: number) => scaleYear(year) * 100;

/** 帯の座標（%）｡SpanStrip と同じ意味: 製造→廃番（または現在）､再入荷は点 */
function spanOf(v: Value) {
  const made = v.made!;
  const start = pct(made.year);
  const end = pct(v.discontinued ? v.discontinued.year : ERA_MAX);
  const restock = v.restocked ? pct(v.restocked.year) : null;
  return {
    start,
    end,
    restock,
    approx: !!made.approx,
    active: !v.discontinued,
  };
}

const hatch = (color: string) =>
  `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 4px)`;

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

function ArrowMark({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 10 16" aria-hidden>
      <polygon points="0,0 10,8 0,16" fill={color} />
    </svg>
  );
}

function RestockDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block h-3 w-3 rounded-full border-[3.5px] border-vl-red bg-vl-paper ${className}`}
    />
  );
}

function LoopTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-type inline-block shrink-0 border border-vl-red px-1 text-[11px] font-bold leading-[1.5] tracking-[0.08em] text-vl-red-deep ${className}`}
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
        <div className="hidden items-end justify-between px-3 pb-[7px] text-[12px] font-bold text-vl-ink-soft md:flex">
          <span>棚・型番・図版・名前</span>
        </div>
        <div className="relative h-[46px]">
          <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
            {/* 時代の帯と名前 */}
            {ERAS.map((e, i) => (
              <div
                key={e.from}
                className={`absolute top-0 h-[22px] border-l border-vl-line ${i % 2 ? "bg-vl-paper-2/70" : ""}`}
                style={{
                  left: `${pct(e.from)}%`,
                  width: `${pct(e.to) - pct(e.from)}%`,
                }}
              >
                <span className="absolute left-[5px] top-[4px] whitespace-nowrap text-[11px] font-bold">
                  {e.ja}
                </span>
              </div>
            ))}
            <div className="absolute right-0 top-0 h-[22px] border-l border-vl-line" />
            {/* 年の目盛 */}
            {TICKS.map((y, i) => (
              <div
                key={y}
                className="absolute bottom-0 h-[22px]"
                style={{ left: `${pct(y)}%` }}
              >
                <span className="absolute bottom-0 left-0 h-[7px] border-l border-vl-ink" />
                <span
                  className={`font-type absolute bottom-[8px] left-0 whitespace-nowrap text-[11px] font-bold ${
                    i === 0 ? "" : "-translate-x-1/2"
                  }`}
                >
                  {y}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 一行（＝一点）                                                       */
/* ------------------------------------------------------------------ */

function Row({ v, loop }: { v: Value; loop: boolean }) {
  const acc = SHELF_ACCENT[String(v.shelf)];
  const r = recipeOf(v.no);
  const shelf = shelfById(v.shelf);
  const { start, end, restock, approx, active } = spanOf(v);
  const endYear = v.restocked
    ? v.restocked.year
    : v.discontinued
      ? v.discontinued.year
      : null;
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
        className="vl-tl-row group grid transition-colors duration-150 hover:bg-vl-card md:h-[46px] md:grid-cols-[var(--tl-left)_1fr] md:grid-rows-1"
      >
        {/* 左: 棚・型番・図版・名前 */}
        <div
          className="relative z-[2] flex min-w-0 items-center gap-2 bg-vl-paper px-2 group-hover:bg-vl-card md:bg-transparent md:px-3"
          style={{ height: "var(--tl-name-h)" }}
        >
          {/* 棚番号 → 型番 → 図版 → 名前 の順 */}
          <span
            className="font-display-en grid h-[18px] w-[18px] shrink-0 place-items-center border border-vl-ink text-[11px] leading-none"
            style={{ background: acc.bg, color: acc.fg }}
            aria-label={`棚 ${shelf.no}`}
          >
            {shelf.no}
          </span>
          <span className="font-type w-[56px] shrink-0 text-[12px] font-bold">
            NO.{v.no}
          </span>
          {/* 図版｡札と同じ版を小さく刷る */}
          <span className="vl-tl-thumb" style={{ ["--panel" as string]: r.panel }} aria-hidden>
            <HalftoneArt no={v.no} tech={r.tech} ink={r.ink} />
          </span>
          <span className="min-w-0 truncate text-[14px] leading-none font-bold md:text-[15px]">
            {v.name}
          </span>
          {loop && <LoopTag />}
        </div>

        {/* 右: 時間軸上の帯 */}
        <div className="relative" style={{ height: "var(--tl-bar-h)" }}>
          <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
            {/* 概算の製造年: 左端をハッチ */}
            {approx && (
              <span
                className="absolute top-1/2 h-[10px] -translate-y-1/2"
                style={{
                  right: `${100 - start}%`,
                  width: 18,
                  maxWidth: `${start}%`,
                  background: hatch(acc.bar),
                }}
              />
            )}
            {/* はじまった年｡帯の左端の下に出す（上は廃番･再入荷の年が使う） */}
            <span
              className="font-type absolute bottom-0 text-[10px] leading-[1.2] font-bold whitespace-nowrap text-vl-ink-soft md:text-[11px]"
              style={{ left: `${start}%` }}
            >
              {approx ? "c." : ""}
              {v.made!.year}
            </span>
            {/* 在庫の帯｡現役の札は先に矢印が付くので､そのぶん短くする */}
            <span
              className="absolute top-1/2 h-[10px] min-w-[6px] -translate-y-1/2"
              style={{
                left: `${start}%`,
                width: active
                  ? `max(6px, calc(${Math.max(0, end - start)}% - 13px))`
                  : `${Math.max(0, end - start)}%`,
                background: acc.bar,
                boxShadow:
                  v.shelf === 3 ? "inset 0 0 0 1.5px var(--vl-ink)" : undefined,
              }}
            />
            {/* 再入荷: 点線と赤い点 */}
            {restock !== null && restock > end && (
              <>
                <span
                  className="absolute top-1/2 -translate-y-[1px] border-t-2 border-dotted border-vl-red"
                  style={{ left: `${end}%`, width: `${restock - end}%` }}
                />
                <span
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${restock}%` }}
                >
                  <RestockDot />
                </span>
              </>
            )}
            {/* 制度は廃止されたが､価値観としては残っている（傾向が｢廃番｣ではない） */}
            {v.discontinued && v.trend !== "discontinued" && !v.restocked && (
              <>
                <span
                  className="absolute top-1/2 -translate-y-[1px] border-t-2 border-dashed"
                  style={{
                    left: `calc(${end}% + 8px)`,
                    right: 8,
                    borderColor: v.shelf === 3 ? "var(--vl-ink)" : acc.bar,
                  }}
                />
                <span className="absolute top-1/2 right-0 h-3 w-[8px] -translate-y-1/2">
                  <ArrowMark
                    color={v.shelf === 3 ? "var(--vl-ink)" : acc.bar}
                    className="block h-full w-full"
                  />
                </span>
              </>
            )}
            {/* 右端: 廃番は赤い×､現役は矢印 */}
            {active ? (
              // 帯の先に矢印を置く｡帯とは 3px 空けて重ねない
              <span
                className="absolute top-1/2 h-4 w-[10px] -translate-y-1/2"
                style={{ left: `calc(${end}% - 10px)` }}
              >
                <ArrowMark
                  color={v.shelf === 3 ? "var(--vl-ink)" : acc.bar}
                  className="block h-full w-full"
                />
              </span>
            ) : (
              <span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${end}%` }}
              >
                <CrossMark className="block h-full w-full" />
              </span>
            )}
            {/* 廃番・再入荷の年｡右端に近いものは左側に置き､表の外へはみ出さない */}
            {endYear !== null &&
              (labelAt > 62 ? (
                <span
                  className="absolute top-[1px] text-right text-[11px] leading-none font-bold whitespace-nowrap text-vl-red-deep"
                  style={{ right: `calc(${100 - labelAt}% + 4px)` }}
                >
                  <span className="font-type">{endYear}</span>
                  {v.restocked?.as && (
                    <span className="ml-1 hidden md:inline">
                      {v.restocked.as}
                    </span>
                  )}
                </span>
              ) : (
                <span
                  className="absolute top-[1px] text-[11px] leading-none font-bold whitespace-nowrap text-vl-red-deep"
                  style={{ left: `calc(${labelAt}% + 4px)` }}
                >
                  <span className="font-type">{endYear}</span>
                  {v.restocked?.as && (
                    <span className="ml-1 hidden md:inline">
                      {v.restocked.as}
                    </span>
                  )}
                </span>
              ))}
          </div>
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
    {
      glyph: <span className="block h-[8px] w-[22px] bg-vl-ink" />,
      label: "在庫期間（製造→廃番）",
    },
    {
      glyph: (
        <span
          className="block h-[8px] w-[14px]"
          style={{ background: hatch("var(--vl-ink)") }}
        />
      ),
      label: "製造年は概算",
    },
    { glyph: <CrossMark className="h-[14px] w-[14px]" />, label: "廃番" },
    {
      glyph: (
        <span className="block w-[22px] border-t-2 border-dashed border-vl-ink" />
      ),
      label: "制度の廃止後も残る",
    },
    {
      glyph: <ArrowMark color="var(--vl-ink)" className="h-[14px] w-[9px]" />,
      label: "現役",
    },
    { glyph: <RestockDot />, label: "再入荷" },
    { glyph: <LoopTag />, label: "150年の円環" },
  ];
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-bold">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span className="flex h-4 min-w-[24px] items-center justify-center">
            {it.glyph}
          </span>
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

/**
 * 円周に点を置き､時計回りの弧と矢印で結ぶ｡中央に年数｡
 * compact は携帯用｡枠を縦長にして､左右の点の説明も点の下へ回す｡
 */
function Ring({ nodes, span, compact = false }: { nodes: RingNode[]; span: string; compact?: boolean }) {
  const W = compact ? 520 : 880;
  const H = compact ? 660 : 560;
  const cx = W / 2;
  const cy = compact ? 300 : H / 2;
  const R = compact ? 130 : 170;
  const TH = compact ? 52 : 58;
  const FZ = compact ? { year: 16, name: 25, note: 14, num: 62, unit: 15, tail: 0 } : { year: 14, name: 24, note: 14, num: 88, unit: 20, tail: 14 };
  const n = nodes.length;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (a: number, r = R) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  const gap = 0.2; // 点のまわりで弧を切るすきま（ラジアン）
  const arcs = nodes.map((_, i) => {
    const a0 = ang(i) + gap;
    const a1 = ang(i + 1) - gap;
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    // 矢印の頭（弧の終わりの接線方向）
    const t = a1 + Math.PI / 2;
    const hx = x1 + Math.cos(t) * 2;
    const hy = y1 + Math.sin(t) * 2;
    const head = [
      [hx + Math.cos(t) * 12, hy + Math.sin(t) * 12],
      [hx + Math.cos(t + 2.5) * 12, hy + Math.sin(t + 2.5) * 12],
      [hx + Math.cos(t - 2.5) * 12, hy + Math.sin(t - 2.5) * 12],
    ]
      .map((p) => p.map((v) => v.toFixed(1)).join(","))
      .join(" ");
    return {
      d: `M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`,
      head,
      last: i === n - 1,
    };
  });
  const num = span.match(/\d+/)?.[0] ?? "";

  /** 説明の置き場｡図版に重ならないよう､点から離す */
  const place = (i: number) => {
    const a = ang(i);
    const [x, y] = pt(a);
    const vertical = Math.abs(Math.cos(a)) < 0.3;
    const top = vertical && Math.sin(a) < 0;
    const bottom = vertical && Math.sin(a) >= 0;
    // 携帯は左右の点も下に回す（横に出すと枠から出る）
    const beside = !compact && !vertical;
    const anchor: "start" | "end" | "middle" = beside ? (Math.cos(a) > 0 ? "start" : "end") : "middle";
    const half = TH / 2;
    const lx = beside ? (Math.cos(a) > 0 ? x + half + 18 : x - half - 18) : x;
    const ly = top
      ? y - half - (compact ? 56 : 66)
      : bottom
        ? y + half + (compact ? 34 : 26)
        : beside
          ? y - 26
          : y + half + (compact ? 36 : 28);
    return { x, y, lx, ly, anchor };
  };

  return (
    <div className={`relative mx-auto mt-6 w-full ${compact ? "max-w-[460px] md:hidden" : "hidden max-w-[880px] md:block"}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full" role="img" aria-label={`${num}年の円環`}>
        <circle cx={cx} cy={cy} r={R + 34} fill="none" stroke="var(--vl-red)" strokeWidth="1.2" strokeDasharray="2 5" opacity="0.5" />
        {arcs.map((a, i) => (
          <g key={i}>
            <path
              d={a.d}
              fill="none"
              stroke="var(--vl-red)"
              strokeWidth={a.last ? 4 : 6}
              strokeDasharray={a.last ? "10 7" : undefined}
              strokeLinecap="round"
            />
            <polygon points={a.head} fill="var(--vl-red)" />
          </g>
        ))}
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize={FZ.num} fill="var(--vl-red)" fontFamily="var(--font-sans), sans-serif">
          {num}
        </text>
        <text
          x={cx}
          y={cy + (compact ? 30 : 40)}
          textAnchor="middle"
          fontSize={FZ.unit}
          letterSpacing="3"
          fill="var(--vl-ink)"
          fontFamily="var(--font-sans), sans-serif"
        >
          YEARS
        </text>
        {!compact && (
          <text x={cx} y={cy + 64} textAnchor="middle" fontSize={FZ.tail} fontWeight="700" fill="var(--vl-ink)" fontFamily="var(--font-sans), sans-serif">
            最後の弧で､元の場所へ
          </text>
        )}
        {nodes.map((node, i) => {
          const { x, y, lx, ly, anchor } = place(i);
          return (
            <g key={i}>
              {!node.v && <circle cx={x} cy={y} r="13" fill="var(--vl-card)" stroke="var(--vl-red)" strokeWidth="6" />}
              <text x={lx} y={ly} textAnchor={anchor} fontSize={FZ.year} fontWeight="700" fill="var(--vl-ink-soft)" fontFamily="var(--font-mono), monospace">
                {node.n.yearLabel ?? node.n.year}
              </text>
              <a href={node.v ? `/values/${node.v.no}` : undefined}>
                <text x={lx} y={ly + FZ.name + 4} textAnchor={anchor} fontSize={FZ.name} fill="var(--vl-ink)" fontFamily="var(--font-sans), sans-serif">
                  {node.n.label}
                </text>
              </a>
              {node.n.note && !compact && (
                <text
                  x={lx}
                  y={ly + FZ.name + FZ.note + 12}
                  textAnchor={anchor}
                  fontSize={FZ.note}
                  fill="var(--vl-ink)"
                  fontFamily="var(--font-sans), sans-serif"
                >
                  {node.n.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* 環の上に置く図版 */}
      {nodes.map((node, i) => {
        if (!node.v) return null;
        const [x, y] = pt(ang(i));
        const r = recipeOf(node.v.no);
        return (
          <Link
            key={`th-${i}`}
            href={`/values/${node.v.no}`}
            className="vl-ring-thumb"
            style={{
              left: `${(x / W) * 100}%`,
              top: `${(y / H) * 100}%`,
              width: `${(TH / W) * 100}%`,
              ["--panel" as string]: r.panel,
            }}
            aria-label={`${node.n.label} のカードへ`}
          >
            <HalftoneArt no={node.v.no} tech={r.tech} ink={r.ink} />
          </Link>
        );
      })}
    </div>
  );
}

function LoopPanel({ lineage }: { lineage: Lineage }) {
  const nodes: RingNode[] = lineage.nodes.map((n) => ({
    n,
    v: resolveNode(n),
  }));
  const parts = lineage.title.split(/\s*→\s*/);
  return (
    <div className="relative">
      <div className="vl-offset border-2 border-vl-ink bg-vl-card">
        <div className="border-b-2 border-vl-ink px-4 py-3 md:px-8 md:py-4">
          <p className="font-display-en text-[24px] leading-none tracking-[0.04em] uppercase md:text-[30px]">
            {lineage.en}
          </p>
        </div>
        <div className="px-4 py-6 md:px-8 md:py-8">
          <p className="font-display-ja text-[19px] leading-[1.45] md:text-[26px]">
            {parts.map((p, i) => (
              <Fragment key={i}>
                <span className="whitespace-nowrap">{p}</span>
                {i < parts.length - 1 && (
                  <span className="mx-1.5 text-vl-red md:mx-2">→</span>
                )}
              </Fragment>
            ))}
          </p>
          <p className="vl-justify mt-3 max-w-[44em] text-[14px] leading-[1.9] md:text-[15px]">
            {lineage.lead}
          </p>
          <Ring nodes={nodes} span={lineage.span} />
          <Ring nodes={nodes} span={lineage.span} compact />
          <p className="mt-6 text-[13px] font-bold">
            <Link href="/lineage" className="vl-link">
              系譜ページで､環の全部を読む →
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
/* ヒーローの物差し（この年表の縮尺そのもの）                            */
/* ------------------------------------------------------------------ */

function EraRuler() {
  const W = 600;
  const X0 = 20;
  const X1 = W - 20;
  const X = (y: number) => X0 + scaleYear(y) * (X1 - X0);
  // 縮めた区間（〜1868）は50年ごと､明治以降は10年ごとに目盛りを刻む
  const minor: number[] = [];
  for (let y = 1200; y < 1868; y += 50) minor.push(y);
  for (let y = 1870; y <= 2030; y += 10) minor.push(y);
  const major = [1200, 1600, 1868, 1945, 1989, 2026];
  const fills = ["var(--vl-mustard)", "#f0cf73"];
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 600 210"
        className="block h-auto w-full"
        role="img"
        aria-label="この年表の物差し"
      >
        {/* 定規の本体 */}
        <rect
          x="6"
          y="54"
          width="588"
          height="104"
          rx="6"
          fill="var(--vl-card)"
          stroke="var(--vl-ink)"
          strokeWidth="3"
        />
        {ERAS.map((e, i) => (
          <g key={e.from}>
            <rect
              x={X(e.from)}
              y="57"
              width={X(e.to) - X(e.from)}
              height="30"
              fill={fills[i % 2]}
            />
            <text
              x={(X(e.from) + X(e.to)) / 2}
              y="78"
              textAnchor="middle"
              fontSize="15"
              fontWeight="700"
              fill="var(--vl-ink)"
              fontFamily="var(--font-sans), sans-serif"
            >
              {e.ja}
            </text>
          </g>
        ))}
        <line
          x1="6"
          y1="87"
          x2="594"
          y2="87"
          stroke="var(--vl-ink)"
          strokeWidth="2"
        />
        {minor.map((y) => (
          <line
            key={y}
            x1={X(y)}
            y1="87"
            x2={X(y)}
            y2={y % 50 === 0 ? 104 : 96}
            stroke="var(--vl-ink)"
            strokeWidth={y % 100 === 0 ? 1.6 : 1}
          />
        ))}
        {major.map((y) => (
          <g key={y}>
            <line
              x1={X(y)}
              y1="87"
              x2={X(y)}
              y2="114"
              stroke="var(--vl-red)"
              strokeWidth="2.4"
            />
            <text
              x={X(y)}
              y="134"
              textAnchor={y === 1200 ? "start" : y === 2026 ? "end" : "middle"}
              fontSize="13"
              fontWeight="700"
              fill="var(--vl-ink)"
              fontFamily="var(--font-mono), monospace"
            >
              {y}
            </text>
          </g>
        ))}
        <text
          x="300"
          y="152"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="3"
          fill="var(--vl-ink-soft)"
          fontFamily="var(--font-sans), sans-serif"
        >
          VALUES CATALOG · TIME SCALE
        </text>
        {/* 縮めた区間の注記 */}
        <path
          d={`M${X(1200)},44 L${X(1200)},36 L${X(1868)},36 L${X(1868)},44`}
          fill="none"
          stroke="var(--vl-red)"
          strokeWidth="2"
        />
        <text
          x={(X(1200) + X(1868)) / 2}
          y="26"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--vl-red)"
          fontFamily="var(--font-sans), sans-serif"
        >
          668年を､ここに縮めている
        </text>
        <path
          d={`M${X(1868)},44 L${X(1868)},36 L${X(2030)},36 L${X(2030)},44`}
          fill="none"
          stroke="var(--vl-ink)"
          strokeWidth="2"
        />
        <text
          x={(X(1868) + X(2030)) / 2}
          y="26"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--vl-ink)"
          fontFamily="var(--font-sans), sans-serif"
        >
          明治からの162年を広く
        </text>
        <text
          x="300"
          y="198"
          textAnchor="middle"
          fontSize="13"
          fill="var(--vl-ink)"
          fontFamily="var(--font-sans), sans-serif"
        >
          目盛りの間隔は均等ではない｡この物差しで全在庫を並べる｡
        </text>
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 末尾のボタン                                                          */
/* ------------------------------------------------------------------ */

function BigButton({
  href,
  ja,
  en,
  primary = false,
}: {
  href: string;
  ja: string;
  en: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`vl-offset flex items-center justify-between gap-4 border-2 border-vl-ink px-5 py-5 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 md:px-7 md:py-6 ${
        primary ? "bg-vl-red text-vl-paper" : "bg-vl-card text-vl-ink"
      }`}
    >
      <span className="min-w-0">
        <span className="font-type block text-[12px] font-bold tracking-[0.1em] opacity-90">
          {en}
        </span>
        <span className="font-display-ja mt-1 block text-[22px] leading-none md:text-[28px]">
          {ja}
        </span>
      </span>
      <span className="shrink-0 text-[32px] font-bold leading-none md:text-[40px]">
        →
      </span>
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
  const loopNames = new Set(
    loop?.nodes.map((n) => n.ref).filter(Boolean) ?? [],
  );
  const eraCounts = countByEra(rows);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* 見出し */}
        <section className="py-6 md:py-14">
          <h1 className="font-display-ja text-[26px] leading-[1.1] md:text-[56px]">年表</h1>
          <p className="font-display-en mt-1 text-[22px] leading-[1] tracking-[0.01em] text-vl-red md:text-[46px]">
            INVENTORY BY YEAR
          </p>
          {/* 台帳を読む前に､物差しと記号の意味を置く */}
          {/* 物差しと凡例｡左右の幅と高さを揃える */}
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:items-stretch">
            <div className="border-2 border-vl-ink bg-vl-card px-3 py-3 md:px-4">
              <EraRuler />
            </div>
            <div className="flex items-center border-2 border-vl-ink bg-vl-card px-4 py-3 md:px-5 md:py-4">
              <Legend />
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* 時代ごとの点数｡表で出す */}
        <section className="grid gap-6 py-8 md:grid-cols-2 md:py-12">
          <table className="vl-tl-table">
            <caption>時代ごとの点数</caption>
            <thead>
              <tr>
                <th scope="col">時代</th>
                <th scope="col">年</th>
                <th scope="col" className="vl-tl-table__num">
                  点数
                </th>
              </tr>
            </thead>
            <tbody>
              {ERAS.map((e, i) => (
                <tr key={e.from}>
                  <th scope="row">{e.ja}</th>
                  <td className="font-type">
                    {e.from}–{e.to}
                  </td>
                  <td className="vl-tl-table__num font-type">{eraCounts[i]}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">合計</th>
                <td className="font-type">1200–{ERA_MAX}</td>
                <td className="vl-tl-table__num font-type">{rows.length}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <div className="vl-rule" />

        {/* 在庫台帳（ガントチャート） */}
        <section className="py-12 md:py-16">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display-ja text-[18px] leading-tight md:text-[30px]">
                全在庫､製造年順
              </h2>
              <p className="mt-2 text-[12px] leading-[1.7] md:text-[14px]">
                帯が在庫の期間｡
                <br />
                左端が製造､右端が廃番｡
                <br />
                中世〜近世は縮めて描いている｡
                <br />
                行を押すとカードに飛ぶ｡
              </p>
            </div>
          </div>

          <div
            className="border-t-2 border-vl-ink [--tl-gutter:18px] [--tl-name-h:34px] [--tl-bar-h:40px] md:[--tl-gutter:22px] md:[--tl-name-h:46px] md:[--tl-bar-h:46px]"
            style={{ "--tl-left": LEFT } as React.CSSProperties}
          >
            <AxisHeader />
            <div className="relative">
              {/* 背景: 時代の縞 */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 right-0 md:left-[var(--tl-left)]"
                aria-hidden
              >
                <div className="absolute inset-y-0 left-0 right-[var(--tl-gutter)]">
                  {ERAS.map((e, i) => (
                    <div
                      key={e.from}
                      className={`absolute inset-y-0 border-l border-vl-line ${i % 2 ? "bg-vl-paper-2/45" : ""}`}
                      style={{
                        left: `${pct(e.from)}%`,
                        width: `${pct(e.to) - pct(e.from)}%`,
                      }}
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
            </div>
          </div>

          {undated > 0 && (
            <p className="mt-3 text-[12px] text-vl-ink-soft">
              製造年が特定できず､年表に載せていない在庫: {undated} ITEMS
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
          <BigButton
            href="/lineage"
            ja="系譜ページへ →"
            en="LINEAGE · 再入荷の系譜"
            primary
          />
          <BigButton href="/" ja="索引へ →" en="INDEX · 棚に戻る" />
        </section>
      </div>
    </>
  );
}
