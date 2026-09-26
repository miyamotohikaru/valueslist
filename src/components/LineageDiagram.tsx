import { Fragment } from "react";
import Link from "next/link";
import type { Lineage, LineageNode } from "@/data/lineages";
import { resolveNode, lineageKindMeta } from "@/data/lineages";
import { SHELF_ACCENT } from "./ValueCard";
import { recipeOf } from "./PrintCard";
import HalftoneArt from "./print/HalftoneArt";
import BreakText from "./BreakText";
import TypeLabel from "./TypeLabel";

/**
 * 系譜の分解図｡ノードを上（古い）から下（新しい）へ等角の層として浮かせる｡
 * - カードのある層は､天面をその在庫の棚の色で塗る（層を下るごとに色が変わる＝棚を移る）
 * - 出来事の層は､破線の縁のクリーム
 * - 名前は斜めの天面には貼らず､前面に置く
 */

const DP = 24; // 天面の奥行き（縦）
const SK = 42; // 天面の奥行き（横ずれ）
const SKEW_X = (Math.atan(SK / DP) * 180) / Math.PI;
const SKEW_Y = (Math.atan(DP / SK) * 180) / Math.PI;
const BX = 2 / Math.cos((SKEW_X * Math.PI) / 180);
const BY = 2 / Math.cos((SKEW_Y * Math.PI) / 180);

/** ｢約150年｣→ { pre:"約", num:"150", post:"年" } */
export function parseSpan(s: string) {
  const m = s.match(/^(\D*)(\d+)(.*)$/);
  return m ? { pre: m[1], num: m[2], post: m[3] } : { pre: "", num: "", post: s };
}

/** タイトル｢A → B → C｣を､矢印を赤くして描く｡改行は矢印の前でしか起きない */
export function ChainTitle({ title, arrowClass = "" }: { title: string; arrowClass?: string }) {
  const parts = title
    .split(/\s*→\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="inline-block max-w-full break-keep wrap-anywhere">
            {i > 0 && <span className={`mr-[0.3em] text-vl-red ${arrowClass}`}>→</span>}
            {/* 長い語は｢・｣のあとでだけ折る */}
            {p.split(/(?<=・)/).map((q, j) => (
              <Fragment key={j}>
                {j > 0 && <wbr />}
                {q}
              </Fragment>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

const isLatin = (s: string) => /^[\x20-\x7e]+$/.test(s);

const vlen = (s: string) => [...s].reduce((n, ch) => n + (/[\x20-\x7e]/.test(ch) ? 0.55 : 1), 0);

/** 句点で改行し､長い文は読点でも改行する（PC の左欄 14px で約26字） */
function clauseText(text: string, max = 26) {
  const lines: string[] = [];
  for (const s of text.split(/(?<=[｡。])/).filter(Boolean)) {
    if (vlen(s) <= max) {
      lines.push(s);
      continue;
    }
    let cur = "";
    for (const c of s.split(/(?<=[､、])/).filter(Boolean)) {
      if (cur && vlen(cur + c) > max) {
        lines.push(cur);
        cur = c;
      } else cur += c;
    }
    if (cur) lines.push(cur);
  }
  return lines.join("◇");
}

function YearPill({ text }: { text: string }) {
  const m = text.match(/^(\d[\d\-–〜]*)\s*(.*)$/);
  const num = m ? m[1] : "";
  const rest = m ? m[2] : text;
  return (
    <span
      className="inline-flex items-center gap-1.5 bg-vl-red py-[5px] pr-4 pl-2.5 leading-none whitespace-nowrap text-vl-paper md:py-[6px] md:pr-5 md:pl-3"
      style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)" }}
    >
      {num && <span className="font-type text-[11px] font-bold md:text-[12px]">{num}</span>}
      {/* 添えの語は札からはみ出すので､狭い画面では出さない */}
      {rest && <span className="hidden text-[12px] font-bold sm:inline">{rest}</span>}
    </span>
  );
}

function RestockBadge() {
  const pts: string[] = [];
  for (let i = 0; i < 36; i++) {
    const r = i % 2 === 0 ? 38 : 31;
    const a = (Math.PI * i) / 18 - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return (
    <svg viewBox="-40 -40 80 80" className="absolute -top-7 -right-3 z-20 h-[70px] w-[70px] -rotate-12" role="img" aria-label="再入荷">
      <polygon points={pts.join(" ")} fill="var(--vl-red)" stroke="var(--vl-ink)" strokeWidth="1.5" />
      <text y="-1" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--vl-paper)" fontFamily="sans-serif">
        ↻
      </text>
      <text y="14" textAnchor="middle" fontSize="9" letterSpacing="0.6" fill="var(--vl-paper)" fontFamily="var(--font-sans), sans-serif">
        RESTOCKED
      </text>
    </svg>
  );
}

function Layer({ node, badge }: { node: LineageNode; badge: boolean }) {
  const v = resolveNode(node);
  const isEvent = !node.ref;
  const label = node.label || node.ref || "";
  const year = node.yearLabel ?? (node.year != null ? String(node.year) : "—");
  const acc = v ? SHELF_ACCENT[String(v.shelf)] : null;
  const topFill = acc ? acc.bg : "var(--vl-paper)";
  const edge = isEvent ? "border-dashed" : "border-solid";
  const border = isEvent ? "border-vl-ink/60" : "border-vl-ink";

  const slab = (
    <div
      className={`relative ${v ? "transition-transform duration-200 group-hover:-translate-y-1" : ""}`}
      style={{ paddingTop: DP, marginRight: SK }}
    >
      {/* 天面（棚の色＋網点） */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 origin-bottom-left ${border} ${edge}`}
        style={{ height: DP, borderWidth: `2px ${BX}px`, transform: `skewX(-${SKEW_X}deg)`, background: topFill }}
      >
        <div className="vl-dots absolute inset-0 opacity-25" style={{ color: acc ? "var(--vl-ink)" : "var(--vl-red)" }} />
      </div>
      {/* 側面（ハッチ） */}
      <div
        aria-hidden
        className={`absolute bottom-0 left-full origin-top-left ${border} ${edge}`}
        style={{
          top: DP,
          width: SK,
          borderWidth: `0 2px ${BY}px 0`,
          transform: `skewY(-${SKEW_Y}deg)`,
          background: `repeating-linear-gradient(-45deg, ${acc ? "rgba(31,27,23,0.35)" : "rgba(200,67,59,0.3)"} 0 1.5px, transparent 1.5px 6px), ${acc ? topFill : "var(--vl-paper)"}`,
        }}
      />
      {/* 前面: 左に図版（枠いっぱい）､右に名前・札・注記 */}
      <div
        className={`relative flex min-h-[72px] border-2 border-t-0 md:min-h-[168px] ${border} ${edge} ${isEvent ? "bg-vl-paper" : "bg-vl-card"}`}
      >
        {v && (
          /* 札と同じ版を刷る｡前面の高さいっぱいの正方形にして､縁に付ける */
          <span className="vl-ln-thumb" style={{ ["--panel" as string]: recipeOf(v.no).panel }} aria-hidden>
            <HalftoneArt no={v.no} tech={recipeOf(v.no).tech} ink={recipeOf(v.no).ink} />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 px-2.5 pt-1.5 pb-2 md:gap-3 md:px-5 md:pt-2.5 md:pb-3">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`min-w-0 flex-1 ${
                isLatin(label)
                  ? "font-display-en text-[13px] leading-tight tracking-[0.03em] uppercase md:text-[26px]"
                  : "font-display-ja text-[13px] leading-tight break-keep wrap-anywhere md:text-[24px]"
              }`}
            >
              {label.split(/(?<=・)/).map((part, i) => (
                <Fragment key={i}>
                  {i > 0 && <wbr />}
                  {part}
                </Fragment>
              ))}
            </p>
            {v ? (
              <span className="font-type mt-0.5 shrink-0 border-b-2 border-vl-red pb-[1px] text-[10px] font-bold text-vl-red-deep md:text-[12px]">NO.{v.no} →</span>
            ) : (
              <span className="mt-0.5 shrink-0 text-[10px] font-bold text-vl-ink-soft md:text-[12px]">出来事</span>
            )}
          </div>
          {node.note && <p className="text-[10.5px] leading-[1.45] md:text-[14px] md:leading-[1.6]">{node.note}</p>}
        </div>
      </div>
      {badge && <RestockBadge />}
    </div>
  );

  return (
    <li className="grid grid-cols-[62px_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[138px_minmax(0,1fr)]">
      <div className="relative flex items-center">
        <YearPill text={year} />
        <span aria-hidden className="ml-2 hidden h-0 flex-1 border-t-2 border-dashed border-vl-red sm:block" />
      </div>
      {v ? (
        <Link href={`/values/${v.no}`} className="group block" aria-label={`${label} のカードへ`}>
          {slab}
        </Link>
      ) : (
        slab
      )}
    </li>
  );
}

export default function LineageDiagram({ lineage, index }: { lineage: Lineage; index: number }) {
  const nn = index + 1;
  const span = parseSpan(lineage.span);
  const nodes = lineage.nodes;
  const kind = lineageKindMeta[lineage.kind];

  return (
    <section id={lineage.id} className="grid scroll-mt-28 gap-2 py-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-x-12 lg:gap-y-8 lg:py-12">
      {/* 左: 見出し・リード・年数・要点の年 */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="flex flex-wrap items-center gap-2">
          <span className="border-2 border-vl-ink bg-vl-mustard px-2 py-0.5 text-[10px] font-bold md:text-[12px]">{kind.ja}</span>
        </p>
        <h2 className="font-display-ja mt-1.5 text-[16px] leading-[1.3] md:text-[26px]">
          <ChainTitle title={lineage.title} />
        </h2>
        <p className="font-display-en mt-1 text-[12px] tracking-[0.12em] text-vl-red uppercase md:text-[18px]">{lineage.en}</p>
        <p className="vl-justify mt-1.5 text-[10px] leading-[1.45] lg:hidden">{lineage.lead}</p>
        <p className="mt-4 hidden text-[14px] leading-[1.9] lg:block">
          <BreakText text={clauseText(lineage.lead)} />
        </p>

        {/* 何の年数かを先に言って､数字はそのあとに出す｡携帯では1行に収める */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 border-t-2 border-vl-ink pt-1.5 md:mt-6 md:block md:pt-3">
          <p className="text-[11px] font-bold md:text-[13px]">{lineage.spanLabel}</p>
          <p className="flex items-baseline leading-none md:mt-1">
            {span.pre && <span className="font-display-ja mr-1 text-[13px] md:text-[18px]">{span.pre}</span>}
            {span.num ? (
              <>
                <span className="font-display-en text-[26px] leading-none text-vl-red md:text-[76px]">{span.num}</span>
                <span className="font-display-ja ml-1 text-[13px] md:text-[20px]">{span.post}</span>
              </>
            ) : (
              <span className="font-display-ja text-[24px]">{span.post}</span>
            )}
          </p>
        </div>

        <ol className="mt-5 hidden space-y-1.5 border-l-4 border-vl-red pl-4 lg:block">
          {nodes.map((n, i) => (
            <li key={i} className="flex items-baseline gap-3 text-[13px]">
              <span className="w-[92px] shrink-0 font-bold whitespace-nowrap">
                <TypeLabel text={String(n.yearLabel ?? n.year ?? "—").split(" ")[0]} tracking="0.04em" />
              </span>
              <span className="font-bold">{n.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 右: 分解図 */}
      <div className="min-w-0">
        <p className="mb-1 text-right text-[11px] font-bold text-vl-ink-soft md:mb-5 md:text-[12px]">上が古く､下が新しい</p>
        <ol className="space-y-1.5 md:space-y-5">
          {nodes.map((node, i) => (
            <Layer key={`${lineage.id}-${i}`} node={node} badge={lineage.kind === "restock" && i === nodes.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
