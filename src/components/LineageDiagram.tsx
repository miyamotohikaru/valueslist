import { Fragment } from "react";
import Link from "next/link";
import type { Lineage, LineageNode } from "@/data/lineages";
import { resolveNode, lineageKindMeta } from "@/data/lineages";
import { Ja } from "@/lib/ja";

/**
 * 系譜の分解図。
 * サンドイッチの分解図のように、ノードを上（古い）から下（新しい）へ等角の層として浮かせ、
 * 左に年ラベルの赤ピルと点線の引き出し線を置く。
 * 層は HTML で作る（上面＝skewX した板、前面＝矩形、側面＝skewY した板）ので、
 * 文字は実 px のまま折り返せる。
 */

// 等角の寸法（ExplodedCard と同じ比率の「斜めから見下ろす」角度）
const DP = 28; // 上面の奥行き（縦）
const SK = 50; // 上面の奥行き（横ずれ）
const SKEW_X = (Math.atan(SK / DP) * 180) / Math.PI; // 上面の傾き
const SKEW_Y = (Math.atan(DP / SK) * 180) / Math.PI; // 側面の傾き
const BX = 2 / Math.cos((SKEW_X * Math.PI) / 180); // 斜めになる縁を 2px に見せる補正
const BY = 2 / Math.cos((SKEW_Y * Math.PI) / 180);
// PC の札の列幅は 136px（Tailwind のクラスに直書き: sm:grid-cols-[136px_minmax(0,1fr)]）

const HATCH =
  "repeating-linear-gradient(-45deg, rgba(200, 67, 59, 0.38) 0 1.5px, transparent 1.5px 6px), var(--vl-card)";
const HATCH_EVENT =
  "repeating-linear-gradient(-45deg, rgba(200, 67, 59, 0.22) 0 1.5px, transparent 1.5px 6px), var(--vl-paper)";

/** 「約150年」→ { pre:"約", num:"150", post:"年" } */
export function parseSpan(s: string) {
  const m = s.match(/^(\D*)(\d+)(.*)$/);
  return m ? { pre: m[1], num: m[2], post: m[3] } : { pre: "", num: "", post: s };
}

/**
 * 句点で必ず改行し、1 行に収まらない文は読点でも改行する（語の途中で折れないように）。
 * max は携帯幅（13px で 26 字）を基準にしている。
 */
function ClauseLines({ text, max = 26 }: { text: string; max?: number }) {
  const lines: string[] = [];
  for (const s of text.split(/(?<=。)/).filter(Boolean)) {
    if (s.length <= max) {
      lines.push(s);
      continue;
    }
    let cur = "";
    for (const c of s.split(/(?<=、)/).filter(Boolean)) {
      if (cur && (cur + c).length > max) {
        lines.push(cur);
        cur = c;
      } else {
        cur += c;
      }
    }
    if (cur) lines.push(cur);
  }
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {l}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/** 「1872 学制」→ { num:"1872", rest:"学制" } */
function splitYear(s: string) {
  const m = s.match(/^(\d[\d\-–]*)\s*(.*)$/);
  return m ? { num: m[1], rest: m[2] } : { num: "", rest: s };
}

/** 商品名の文字数に応じた大きさ（上面に 1 行で収める） */
function labelSize(s: string) {
  const n = s.length;
  if (n <= 10) return 17;
  if (n <= 14) return 15;
  if (n <= 18) return 13;
  return 11.5;
}

/** タイトル「A → B → C」を、矢印を赤くして描く。改行は矢印の前でしか起きない */
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
          <span className="inline-block">
            {i > 0 && <span className={`mr-[0.3em] text-vl-red ${arrowClass}`}>→</span>}
            {p}
          </span>
        </Fragment>
      ))}
    </>
  );
}

function starburst(n: number, ro: number, ri: number) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" ");
}

/** 再入荷の丸い札（スターバースト） */
function RestockBadge() {
  return (
    <svg
      viewBox="-40 -40 80 80"
      className="absolute z-20 h-[74px] w-[74px] -rotate-12"
      style={{ top: -24, right: -SK + 12 }}
      role="img"
      aria-label="再入荷"
    >
      <polygon points={starburst(18, 38, 31)} fill="var(--vl-red)" />
      <circle r="27" fill="none" stroke="var(--vl-paper)" strokeWidth="1" strokeDasharray="2 2.2" />
      <text
        y="-2"
        textAnchor="middle"
        fontSize="19"
        fontWeight="700"
        fill="var(--vl-paper)"
        fontFamily="var(--font-zen-kaku), sans-serif"
      >
        ↻
      </text>
      <text
        y="14"
        textAnchor="middle"
        fontSize="8.4"
        letterSpacing="0.7"
        fill="var(--vl-paper)"
        fontFamily="var(--font-anton), Impact, sans-serif"
      >
        RESTOCKED
      </text>
    </svg>
  );
}

/** 年ラベルの赤ピル（数字は Courier、和文は本文フォント） */
function YearPill({ text }: { text: string }) {
  const { num, rest } = splitYear(text);
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-vl-red px-3 py-[4px] leading-none text-vl-paper">
      {num && <span className="font-type text-[11px] font-bold tracking-[0.08em]">{num}</span>}
      {rest && <span className="text-[10px] font-bold">{rest}</span>}
    </span>
  );
}

function Layer({ node, badge }: { node: LineageNode; badge: boolean }) {
  const v = resolveNode(node);
  const isEvent = !node.ref;
  const label = node.label || node.ref || "";
  const year = node.yearLabel ?? (node.year != null ? String(node.year) : "—");
  const edge = isEvent ? "border-dashed" : "border-solid";
  const fill = isEvent ? "bg-vl-paper" : "bg-vl-card";

  const slab = (
    <div
      className={`relative ${
        v ? "transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-1" : ""
      }`}
      style={{ paddingTop: DP, marginRight: SK }}
    >
      {/* 上面 */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 origin-bottom-left border-vl-red ${edge} ${fill}`}
        style={{ height: DP, borderWidth: `2px ${BX}px`, transform: `skewX(-${SKEW_X}deg)` }}
      />
      {/* 側面（斜線） */}
      <div
        aria-hidden
        className={`absolute bottom-0 left-full origin-top-left border-vl-red ${edge}`}
        style={{
          top: DP,
          width: SK,
          borderWidth: `0 2px ${BY}px 0`,
          transform: `skewY(-${SKEW_Y}deg)`,
          background: isEvent ? HATCH_EVENT : HATCH,
        }}
      />
      {/* 前面: 注記と札 */}
      <div
        className={`relative flex min-h-[46px] items-end gap-3 border-2 border-t-0 border-vl-red px-3 py-2 ${edge} ${fill}`}
      >
        <p className="flex-1 text-[12px] leading-[1.6]">{node.note ? <Ja text={node.note} /> : null}</p>
        {v ? (
          <span className="font-type shrink-0 border-b-2 border-vl-red pb-[1px] text-[9px] font-bold tracking-[0.18em] text-vl-red">
            NO.{v.no} →
          </span>
        ) : isEvent ? (
          <span className="font-type shrink-0 text-[9px] tracking-[0.18em] text-vl-ink-soft">出来事 · EVENT</span>
        ) : null}
      </div>
      {/* 商品名（上面に置く。上面の平行四辺形の内側に収まる位置） */}
      <p
        className="font-display-ja pointer-events-none absolute top-0 z-10 flex items-center whitespace-nowrap leading-none"
        style={{ left: SK + 8, right: 6, height: DP, fontSize: labelSize(label) }}
      >
        {label}
      </p>
      {badge && <RestockBadge />}
    </div>
  );

  return (
    <li className="grid sm:grid-cols-[136px_minmax(0,1fr)]">
      {/* 札と引き出し線（携帯: 層の上に吊る／PC: 左の列） */}
      <div className="relative z-10 mb-[10px] flex items-center sm:mb-0" style={{ minHeight: DP }}>
        <div className="ml-[50px] sm:ml-0">
          <YearPill text={year} />
        </div>
        {/* PC: ピルから層まで */}
        <span aria-hidden className="hidden flex-1 border-t-2 border-dashed border-vl-red sm:block" />
        <span
          aria-hidden
          className="absolute left-full top-[13px] hidden w-[22px] border-t-2 border-dashed border-vl-red sm:block"
        />
        {/* 携帯: ピルの下へ短く */}
        <span
          aria-hidden
          className="absolute left-[64px] top-full h-[10px] border-l-2 border-dashed border-vl-red sm:hidden"
        />
        {/* 引き出し線の先の点 */}
        <span
          aria-hidden
          className="absolute left-[61px] top-[calc(100%_+_7px)] h-[7px] w-[7px] rounded-full bg-vl-red sm:left-[calc(100%_+_21.5px)] sm:top-[10.5px]"
        />
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

/** いちばん下の台座（現在の棚） */
function BasePlate({ caption }: { caption: string }) {
  return (
    <div className="mt-8 grid sm:grid-cols-[136px_minmax(0,1fr)]">
      <div className="hidden sm:block" />
      <div>
        <div className="relative" style={{ paddingTop: DP, marginRight: SK }}>
          <div
            aria-hidden
            className="vl-halftone absolute inset-x-0 top-0 origin-bottom-left border-vl-red bg-vl-paper-2 text-vl-red"
            style={{ height: DP, borderWidth: `2px ${BX}px`, transform: `skewX(-${SKEW_X}deg)` }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-full origin-top-left border-vl-red"
            style={{
              top: DP,
              width: SK,
              borderWidth: `0 2px ${BY}px 0`,
              transform: `skewY(-${SKEW_Y}deg)`,
              background: HATCH,
            }}
          />
          <div className="h-[9px] border-2 border-t-0 border-vl-red bg-vl-paper-2" />
        </div>
        <p className="font-type mt-3 text-right text-[9px] tracking-[0.25em] text-vl-red">{caption}</p>
      </div>
    </div>
  );
}

export default function LineageDiagram({ lineage, index }: { lineage: Lineage; index: number }) {
  const nn = String(index + 1).padStart(2, "0");
  const span = parseSpan(lineage.span);
  const nodes = lineage.nodes;

  return (
    <section
      id={lineage.id}
      className="grid scroll-mt-24 gap-10 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 lg:py-16"
    >
      {/* 左: 見出し・リード・年数 */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-type text-[10px] tracking-[0.3em] text-vl-ink-soft">
          LINEAGE {nn} · {nodes.length} LAYERS ·{" "}
          <span className="font-bold text-vl-red">{lineageKindMeta[lineage.kind].ja}</span>
        </p>
        <h2 className="font-display-ja mt-3 text-[22px] leading-[1.4] md:text-[26px]">
          <ChainTitle title={lineage.title} />
        </h2>
        <p className="font-display-en mt-2 text-[15px] uppercase tracking-[0.2em] text-vl-red md:text-[17px]">
          {lineage.en}
        </p>
        <p className="mt-4 text-[13px] leading-[1.9] text-vl-ink-soft">
          <ClauseLines text={lineage.lead} />
        </p>

        <div className="mt-6 border-t-2 border-vl-ink pt-3">
          <p className="font-type text-[9px] tracking-[0.3em] text-vl-ink-soft">SPAN · {lineage.spanLabel}</p>
          <p className="mt-1 flex items-baseline leading-none">
            {span.pre && <span className="font-display-ja mr-1 text-[16px]">{span.pre}</span>}
            {span.num ? (
              <>
                <span className="font-display-en text-[64px] leading-none text-vl-red md:text-[80px]">{span.num}</span>
                <span className="font-display-ja ml-1 text-[18px]">{span.post}</span>
              </>
            ) : (
              <span className="font-display-ja text-[24px]">{span.post}</span>
            )}
          </p>
        </div>
      </div>

      {/* 右: 分解図 */}
      <div className="min-w-0">
        <p className="font-type mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[9px] tracking-[0.25em] text-vl-ink-soft">
          <span>FIG.{nn} · EXPLODED VIEW</span>
          <span>OLD ↓ NEW · 上が古く、下が新しい</span>
        </p>
        <ol className="space-y-6 sm:space-y-8">
          {nodes.map((node, i) => (
            <Layer
              key={`${lineage.id}-${i}`}
              node={node}
              badge={lineage.kind === "restock" && i === nodes.length - 1}
            />
          ))}
        </ol>
        <BasePlate caption={`FIG.${nn} · ${lineage.id.toUpperCase()} · ${nodes.length} LAYERS`} />
      </div>
    </section>
  );
}
