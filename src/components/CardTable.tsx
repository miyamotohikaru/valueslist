"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Value } from "@/data/types";
import { shelfById } from "@/data/shelves";
import ValueCard, { SHELF_ACCENT } from "./ValueCard";
import CardBack from "./CardBack";

/**
 * カードの卓｡左に山札､下に手札の扇､真ん中に表を向けた1枚｡
 * 手札を押す・引く・矢印キーで､その1枚が真ん中へ配られる｡
 *
 * 動きの作り:
 * - 扇の位置は CSS の変数（--a 角度 / --lift 持ち上げ）だけを書き換え､遷移で滑らかに動かす
 * - 配る／裏返す動きは Web Animations API（時間と加減速をそろえるため）
 * - 「動きを減らす」設定のときは､どの動きも出さない
 */
const NEAR = 7; // 扇に出す枚数（左右それぞれ）
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CardTable({ values }: { values: Value[] }) {
  const [i, setI] = useState(0);
  const dirRef = useRef(1);
  const [flip, setFlip] = useState(0); // 真ん中の1枚を配り直すたびに増える
  const rootRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const dealtRef = useRef(false);
  const dragRef = useRef<{ id: number; x: number; from: number; moved: number; captured?: boolean } | null>(null);
  const wheelLock = useRef(0);
  const last = Math.max(0, values.length - 1);

  // 絞り込みや並べ替えが変わったら､先頭から配り直す
  useEffect(() => {
    setI(0);
    dirRef.current = 1;
    dealtRef.current = false;
  }, [values]);

  // 扇に出す範囲と､その真ん中（手札そのものが画面の中央に来るようにする）
  const { window_, center } = useMemo(() => {
    const from = Math.max(0, i - NEAR);
    const to = Math.min(last, i + NEAR);
    const out: number[] = [];
    for (let n = from; n <= to; n++) out.push(n);
    return { window_: out, center: (from + to) / 2 };
  }, [i, last]);

  const current = values[clamp(i, 0, last)];
  const acc = current ? SHELF_ACCENT[String(current.shelf)] : null;

  const goTo = useCallback(
    (n: number) => {
      const v = clamp(Math.round(n), 0, last);
      setI((prev) => {
        if (v === prev) return prev;
        dirRef.current = v > prev ? 1 : -1;
        setFlip((f) => f + 1);
        return v;
      });
    },
    [last],
  );

  /* ── 真ん中の1枚: 配られて､裏から表へ返る ───────────────── */
  useLayoutEffect(() => {
    const el = focusRef.current;
    if (!el || reduced()) return;
    const rect = deckRef.current?.getBoundingClientRect();
    const deck = rect && rect.width > 0 ? rect : null; // 携帯では山札を出していない
    const me = el.getBoundingClientRect();
    // 最初の1枚は山札から､2枚目からは進む向きの脇から入る
    const fromDeck = !dealtRef.current && deck;
    const dx = fromDeck ? deck.left + deck.width / 2 - (me.left + me.width / 2) : dirRef.current * 260;
    const dy = fromDeck ? deck.top + deck.height / 2 - (me.top + me.height / 2) : 26;
    el.animate(
      [
        {
          transform: `translate3d(${dx}px, ${dy}px, 0) rotateY(${fromDeck ? 180 : dirRef.current * 52}deg) rotate(${dirRef.current * -7}deg) scale(0.74)`,
          opacity: fromDeck ? 1 : 0,
          offset: 0,
        },
        { transform: "translate3d(0,0,0) rotateY(0deg) rotate(0deg) scale(1)", opacity: 1, offset: 1 },
      ],
      { duration: fromDeck ? 620 : 460, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "both" },
    );
  }, [flip, current?.no]);

  /* ── 手札: 画面に入ったら､山札から配る ───────────────────── */
  useEffect(() => {
    const root = rootRef.current;
    const fan = fanRef.current;
    if (!root || !fan || dealtRef.current) return;
    if (reduced() || typeof IntersectionObserver === "undefined") {
      dealtRef.current = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const rect = deckRef.current?.getBoundingClientRect();
        const deck = rect && rect.width > 0 ? rect : null;
        const slots = Array.from(fan.querySelectorAll<HTMLElement>("[data-slot]"));
        slots.forEach((slot, n) => {
          const r = slot.getBoundingClientRect();
          // 山札が見えていないとき（携帯）は､下から手元へ配る
          const dx = deck ? deck.left + deck.width / 2 - (r.left + r.width / 2) : 0;
          const dy = deck ? deck.top + deck.height / 2 - (r.top + r.height / 2) : 140;
          // transform ではなく translate / scale を動かす（扇の角度＝CSS の transform を消さないため）
          slot.animate(
            [
              { translate: `${dx}px ${dy}px`, scale: "0.62", opacity: 0, offset: 0 },
              { translate: `${(dx * 0.12).toFixed(1)}px ${(dy * 0.12).toFixed(1)}px`, scale: "0.98", opacity: 1, offset: 0.72 },
              { translate: "0px 0px", scale: "1", opacity: 1, offset: 1 },
            ],
            { duration: 560, delay: 60 + n * 42, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "both" },
          );
        });
        setTimeout(() => {
          dealtRef.current = true;
        }, 60 + slots.length * 42 + 560);
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [values]);

  /* ── 横のはじき（トラックパッド）だけ受ける ─────────────── */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const next = i + (e.deltaX > 0 ? 1 : -1);
      if (next < 0 || next > last) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 170) return;
      wheelLock.current = now;
      goTo(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, i, last]);

  /* ── 手札を指で払う ───────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { id: e.pointerId, x: e.clientX, from: i, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved > 8 && !d.captured) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      d.captured = true;
    }
    if (d.captured) goTo(d.from - Math.round(dx / 46));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (d.captured) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  if (!current) return null;
  const shelf = shelfById(current.shelf);

  return (
    <section
      ref={rootRef}
      className="vl-table"
      aria-label="カードの卓"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          goTo(i + 1);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          goTo(i - 1);
        }
        if (e.key === "Home") goTo(0);
        if (e.key === "End") goTo(last);
      }}
      tabIndex={0}
      style={{ ["--felt" as string]: acc?.bg }}
    >
      {/* 卓の面: 手前の1枚の棚の色が､うっすら広がる */}
      <div className="vl-table__felt" aria-hidden />
      <div className="vl-sunburst vl-sunburst-spin vl-table__sun" aria-hidden />

      {/* 山札 */}
      <div className="vl-table__deck" aria-hidden>
        <div ref={deckRef} className="vl-deckstack">
          <CardBack className="vl-deckstack__back vl-deckstack__back--3" />
          <CardBack className="vl-deckstack__back vl-deckstack__back--2" />
          <CardBack className="vl-deckstack__back vl-deckstack__back--1" />
        </div>
        <p className="vl-table__deck-n">
          <span className="font-display-en">{String(last - i).padStart(2, "0")}</span>
          <span>枚のこり</span>
        </p>
      </div>

      {/* めくった札 */}
      <div className="vl-table__used" aria-hidden data-empty={i === 0 ? "1" : undefined}>
        <div className="vl-deckstack vl-deckstack--used">
          <CardBack className="vl-deckstack__back vl-deckstack__back--3" />
          <CardBack className="vl-deckstack__back vl-deckstack__back--2" />
          <CardBack className="vl-deckstack__back vl-deckstack__back--1" />
        </div>
        <p className="vl-table__deck-n">
          <span className="font-display-en">{String(i).padStart(2, "0")}</span>
          <span>枚めくった</span>
        </p>
      </div>

      {/* 真ん中の1枚 */}
      <div className="vl-table__focus">
        <div ref={focusRef} key={current.no} className="vl-focus">
          <ValueCard v={current} />
        </div>

        <div className="vl-table__caption">
          <p className="vl-table__shelf">
            {shelf.no}. {shelf.name}
          </p>
          <Link href={`/values/${current.no}`} className="vl-btn-solid">
            {current.name} を開く →
          </Link>
        </div>

        <div className="vl-table__nav">
          <button type="button" className="vl-btn-round" onClick={() => goTo(i - 1)} disabled={i <= 0} aria-label="前の1枚">
            ←
          </button>
          <span className="font-type vl-table__count">
            {String(i + 1).padStart(3, "0")} / {String(values.length).padStart(3, "0")}
          </span>
          <button type="button" className="vl-btn-round" onClick={() => goTo(i + 1)} disabled={i >= last} aria-label="次の1枚">
            →
          </button>
        </div>
        <p className="vl-table__hint">手札を押す · 横に払う · ← → で配る</p>
      </div>

      {/* 手札の扇 */}
      <div ref={fanRef} className="vl-fan" role="listbox" aria-label="手札">
        {window_.map((n) => {
          const d = n - center; // 扇の中での位置
          const on = n === i;
          return (
            <button
              key={values[n].no}
              data-slot
              type="button"
              role="option"
              aria-selected={on}
              aria-label={`${n + 1}枚目 ${values[n].name}`}
              onClick={() => goTo(n)}
              className={`vl-fan__slot${on ? " is-on" : ""}`}
              data-d={Math.round(Math.abs(d))}
              style={{ ["--a" as string]: d, ["--z" as string]: 40 - Math.round(Math.abs(d)) }}
            >
              <span className="vl-fan__card">
                <ValueCard v={values[n]} interactive={false} />
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
