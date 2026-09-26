"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import PrintCard from "./PrintCard";
import type { Value } from "@/data/types";
import { Ja } from "@/lib/ja";

/**
 * ｢カードの読み方｣の説明図｡索引と同じ実物のカードを中央に置き､
 * 各部位に引き出し線を付けて説明する（PC は左右に説明､携帯は番号札＋凡例）｡
 * 部位の位置は描画後に実測する（書体の読み込みや幅が変わっても線がずれない）｡
 */
type Side = "l" | "r";
type Part = { side: Side; sel: string; ja: string; en: string; text: string };

/** 左の列（上から）→ 右の列（上から）の順に番号を振る */
const PARTS: Part[] = [
  { side: "l", sel: ".vl-print__no", ja: "型番", en: "NO.", text: "棚の並び順の三桁｡" },
  { side: "l", sel: ".vl-print__art", ja: "図版", en: "ART", text: "灰色の版に描いてから網にかけたもの｡札ごとに網が違う｡" },
  { side: "l", sel: ".vl-print__body", ja: "意味", en: "MEANING", text: "その言葉が指していたもの｡二行で収めている｡" },
  { side: "l", sel: ".vl-print__line", ja: "棚", en: "SHELF", text: "下の線の色が棚｡五つの棚を色で見分ける｡" },
  { side: "r", sel: ".vl-print__state", ja: "扱い", en: "STATE", text: "いまの状態｡廃番・再入荷・現行の三つ｡廃番だけ朱｡" },
  { side: "r", sel: ".vl-print__name", ja: "名前", en: "NAME", text: "価値観の呼び名｡下に英名と読み｡" },
  { side: "r", sel: ".vl-print__data", ja: "製造と廃番", en: "MFD. / EOL.", text: "製造の年と､廃番の年｡c. は推定､NOW は現役｡" },
];

const DISC = 26; // 番号札の直径
const GAP = 26; // 説明どうしの最小の間隔
const ELBOW = 30; // 線がカードの手前で折れる位置

type Geo = {
  pins: { x: number; y: number }[];
  tops: (number | null)[];
  lines: (string | null)[];
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** 番号は､左の列を上から､続けて右の列を上から（カードを何度も横断させない） */
const ORDER = [
  ...PARTS.map((_, i) => i).filter((i) => PARTS[i].side === "l"),
  ...PARTS.map((_, i) => i).filter((i) => PARTS[i].side === "r"),
];
const numberOf = (i: number) => ORDER.indexOf(i) + 1;

function Disc({ n }: { n: number }) {
  return (
    <span
      data-disc
      className="font-display-en grid shrink-0 place-items-center rounded-full border-2 border-vl-ink bg-vl-red text-[14px] leading-none text-vl-paper"
      style={{ width: DISC, height: DISC }}
      aria-hidden
    >
      {n}
    </span>
  );
}

function Label({ p, n, align }: { p: Part; n: number; align: "left" | "right" }) {
  const right = align === "right";
  return (
    <div className={`flex items-start gap-3 ${right ? "flex-row-reverse text-right" : ""}`}>
      <Disc n={n} />
      <div className="min-w-0 pt-[3px]">
        <p className={`flex flex-wrap items-baseline gap-x-2 ${right ? "justify-end" : ""}`}>
          <span className="text-[15px] leading-tight font-bold">{p.ja}</span>
        </p>
        <p className="mt-1 text-[13.5px] leading-[1.75] lg:text-[13px] xl:text-[13.5px]">
          <Ja text={p.text} />
        </p>
      </div>
    </div>
  );
}

export default function CardAnatomy({ v }: { v: Value }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [geo, setGeo] = useState<Geo | null>(null);
  const last = useRef("");

  const measure = useCallback(() => {
    const body = bodyRef.current;
    const card = cardRef.current?.querySelector(".vl-plate, .vl-card");
    if (!body || !card) return;
    const b = body.getBoundingClientRect();
    const c = card.getBoundingClientRect();

    // 部位の中心｡番号札はカードの縁に少しかけて置く
    const pins = PARTS.map((p) => {
      const r = card.querySelector(p.sel)?.getBoundingClientRect();
      const y = r ? r.top + r.height / 2 - b.top : 0;
      const x = p.side === "l" ? c.left - b.left - 3 : c.right - b.left + 3;
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    });

    const tops: (number | null)[] = PARTS.map(() => null);
    const lines: (string | null)[] = PARTS.map(() => null);

    for (const [side, col] of [
      ["l", leftRef.current],
      ["r", rightRef.current],
    ] as const) {
      // 左右の説明欄は PC だけ表示する
      if (!col || col.offsetParent === null) continue;
      const cr = col.getBoundingClientRect();
      const colTop = cr.top - b.top;
      const idx = PARTS.map((_, i) => i)
        .filter((i) => PARTS[i].side === side)
        .sort((a, z) => pins[a].y - pins[z].y);
      const hs = idx.map((i) => labelRefs.current[i]?.getBoundingClientRect().height ?? 0);
      // 番号札の中心を部位の高さにそろえ､重なるときだけ下へずらす
      const t = idx.map((i) => pins[i].y - colTop - DISC / 2);
      for (let j = 1; j < t.length; j++) t[j] = Math.max(t[j], t[j - 1] + hs[j - 1] + GAP);
      let limit = cr.height;
      for (let j = t.length - 1; j >= 0; j--) {
        t[j] = Math.min(t[j], limit - hs[j]);
        limit = t[j] - GAP;
      }
      idx.forEach((i, j) => {
        const top = Math.max(-DISC / 2, t[j]);
        tops[i] = Math.round(top * 10) / 10;
        const ay = colTop + top + DISC / 2;
        const ax = side === "l" ? cr.right - b.left + 6 : cr.left - b.left - 6;
        const ex = side === "l" ? pins[i].x - ELBOW : pins[i].x + ELBOW;
        // 高さがそろっているときは水平1本｡ずれたときだけ､カードの手前で1回折る
        // 札が押し出されて高さがずれたときは､札の手前で1回だけ折る（斜めの区間は最小にする）
        const dy = Math.abs(ay - pins[i].y);
        lines[i] =
          dy < 10
            ? `M${ax.toFixed(1)},${pins[i].y} H${pins[i].x}`
            : `M${ax.toFixed(1)},${ay.toFixed(1)} H${(side === "l" ? ax - 14 : ax + 14).toFixed(1)} V${pins[i].y} H${pins[i].x}`;
      });
    }

    const next: Geo = { pins, tops, lines };
    const key = JSON.stringify(next);
    if (key !== last.current) {
      last.current = key;
      setGeo(next);
    }
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (bodyRef.current) ro.observe(bodyRef.current);
    if (cardRef.current) ro.observe(cardRef.current);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [measure]);

  const column = (side: Side) => {
    const items = PARTS.map((p, i) => ({ p, i })).filter(({ p }) => p.side === side);
    return (
      <div ref={side === "l" ? leftRef : rightRef} className="relative hidden lg:block">
        {items.map(({ p, i }, j) => (
          <div
            key={p.ja}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute inset-x-0"
            // 実測の前は等間隔に置いておく
            style={{ top: geo?.tops[i] ?? `${(j / items.length) * 100}%` }}
          >
            <Label p={p} n={numberOf(i)} align={side === "l" ? "right" : "left"} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <figure className="vl-anatomy border-2 border-vl-ink bg-vl-card">
      <figcaption className="flex items-center justify-between gap-3 bg-vl-ink px-4 py-2.5 text-vl-paper md:px-6">
        <span className="flex items-baseline gap-3">
          <span className="text-[13px] font-bold">
            カードの見本 NO.{v.no} {v.name}
          </span>
        </span>
        <span className="font-display-en hidden text-[13px] tracking-[0.14em] text-vl-mustard sm:inline">ANATOMY OF A CARD</span>
      </figcaption>

      <div ref={bodyRef} className="relative px-4 pt-9 pb-8 md:px-8 lg:pt-12 lg:pb-12">
        {/* 背景の網点 */}
        <div
          className="vl-dots-fine pointer-events-none absolute inset-y-4 left-1/2 w-[min(84%,620px)] -translate-x-1/2 text-vl-ink opacity-[0.18]"
          style={{
            maskImage: "radial-gradient(ellipse at center, #000 52%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 52%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="relative grid grid-cols-[minmax(0,280px)] justify-center lg:grid-cols-[minmax(0,1fr)_300px_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] xl:gap-x-16">
          {column("l")}
          <div ref={cardRef} className="w-full lg:py-10">
            <PrintCard v={v} interactive={false} />
          </div>
          {column("r")}
        </div>

        {/* 引き出し線と番号札（実測後に描く） */}
        {geo && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <svg className="absolute inset-0 hidden h-full w-full overflow-visible lg:block">
              {geo.lines.map((d, i) =>
                d ? <path key={i} d={d} fill="none" stroke="var(--vl-ink)" strokeWidth="1.5" strokeLinejoin="round" /> : null,
              )}
            </svg>
            {geo.pins.map((pt, i) => (
              <span
                key={i}
                className="font-display-en absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-vl-ink bg-vl-red text-[13px] leading-none text-vl-paper lg:h-[11px] lg:w-[11px] lg:text-[0px]"
                style={{ left: pt.x, top: pt.y }}
              >
                {numberOf(i)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 携帯・タブレットの凡例 */}
      <ol className="grid gap-x-8 gap-y-4 border-t-2 border-dashed border-vl-ink/40 px-4 py-6 sm:grid-cols-2 md:px-8 lg:hidden">
        {ORDER.map((i, n) => (
          <li key={PARTS[i].ja}>
            <Label p={PARTS[i]} n={n + 1} align="left" />
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2 border-t-2 border-vl-ink px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="text-[13px] leading-[1.8]">
          <Ja text="証拠の型は､◆カードを開いた先のページに書いてある｡" />
        </p>
        <Link href={`/values/${v.no}`} className="vl-link font-type shrink-0 text-[12px] font-bold tracking-[0.1em]">
          OPEN NO.{v.no} →
        </Link>
      </div>
    </figure>
  );
}
