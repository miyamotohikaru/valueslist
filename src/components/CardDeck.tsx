"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Value } from "@/data/types";
import { shelfById } from "@/data/shelves";
import ValueCard, { SHELF_ACCENT } from "./ValueCard";

/**
 * カードの束｡ドラッグ・スクロール・矢印キーで1枚ずつめくる｡
 * 位置は rAF で滑らかに追い､札の変形は直接 style に書く（48枚ぶんの再描画をしない）｡
 */
const STEP_X = 58; // 1枚ごとの横のずれ
const STEP_Y = 32; // 1枚ごとの縦のずれ
const STEP_Z = 78; // 1枚ごとの奥行き
const AHEAD = 6; // 後ろに見せる枚数
const BEHIND = 2; // 手前（めくり終えた側）に残す枚数
const DRAG_PER_CARD = 150; // この距離を引いたら1枚

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function CardDeck({ values }: { values: Value[] }) {
  const [base, setBase] = useState(0); // 表示の中心（丸めた位置）
  const posRef = useRef(0); // 実際の位置（小数）
  const targetRef = useRef(0);
  const dragRef = useRef<{ id: number; x: number; from: number; moved: number; captured?: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<number, HTMLDivElement>());
  const rafRef = useRef(0);
  const wheelLock = useRef(0);
  const draggedRef = useRef(0); // 直前のドラッグで動いた距離
  const last = values.length - 1;

  const window_ = useMemo(() => {
    const from = Math.max(0, base - BEHIND);
    const to = Math.min(last, base + AHEAD);
    const out: number[] = [];
    for (let i = from; i <= to; i++) out.push(i);
    return out;
  }, [base, last]);

  const current = values[clamp(base, 0, last)];
  const acc = SHELF_ACCENT[String(current.shelf)];

  /** 位置に合わせて、各札の変形を書く */
  const paint = useCallback(() => {
    const pos = posRef.current;
    cardRefs.current.forEach((el, idx) => {
      const d = idx - pos;
      const far = Math.abs(d) > AHEAD + 1;
      el.style.visibility = far ? "hidden" : "visible";
      if (far) return;
      const past = d < 0; // めくり終えた札は左下へ抜けて消える
      const x = d * STEP_X + (past ? d * 120 : 0);
      const y = d * -STEP_Y + (past ? d * 70 : 0);
      const z = d * -STEP_Z;
      const rot = past ? d * 7 : 0;
      const scale = 1 - Math.max(0, d) * 0.018;
      const op = past ? clamp(1 + d * 0.85, 0, 1) : clamp(1 - d * 0.05, 0, 1);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(-17deg) rotateX(7deg) rotateZ(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = String(op);
      el.style.zIndex = String(200 - Math.round(Math.abs(d) * 10));
      // 手前の1枚と、後ろ3枚までは押せる（後ろの札を押すと、そこまでめくる）
      const front = Math.abs(d) < 0.5;
      el.style.pointerEvents = d > -0.5 && d < 3.5 ? "auto" : "none";
      el.style.cursor = front ? "pointer" : "grab";
      const link = el.firstElementChild as HTMLElement | null;
      if (link) link.style.pointerEvents = front ? "auto" : "none";
    });
  }, []);

  /** 目標へ滑らかに寄せる */
  const tick = useCallback(() => {
    const diff = targetRef.current - posRef.current;
    if (Math.abs(diff) < 0.001) {
      posRef.current = targetRef.current;
      paint();
      rafRef.current = 0;
      return;
    }
    posRef.current += diff * 0.16;
    paint();
    rafRef.current = requestAnimationFrame(tick);
  }, [paint]);

  const kick = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const goTo = useCallback(
    (n: number) => {
      const v = clamp(n, 0, last);
      targetRef.current = v;
      setBase(Math.round(v));
      kick();
    },
    [kick, last],
  );

  // 表示する札が入れ替わったら、その場で位置を書き直す
  useEffect(() => {
    paint();
  }, [paint, window_]);

  // 片づけは外すときだけ（めくるたびに止めない）
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    },
    [],
  );

  // 画面に入ったら、束を少しだけ動かして「めくれる」ことを見せる
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (done || !entries.some((e) => e.isIntersecting)) return;
        done = true;
        io.disconnect();
        targetRef.current = 0.45;
        kick();
        setTimeout(() => {
          targetRef.current = 0;
          kick();
        }, 420);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [kick]);

  // ホイール・トラックパッド。端まで来たらページのスクロールに返す
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // 縦のスクロールはページに渡す（ページが止まって見えないように）
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const next = targetRef.current + (e.deltaX > 0 ? 1 : -1);
      if (next < 0 || next > last) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 160) return;
      wheelLock.current = now;
      goTo(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, last]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    draggedRef.current = 0;
    dragRef.current = { id: e.pointerId, x: e.clientX, from: targetRef.current, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    // 引き始めたら、そこからは捕まえて追う
    if (d.moved > 6 && !d.captured) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      d.captured = true;
    }
    draggedRef.current = d.moved;
    posRef.current = clamp(d.from - dx / DRAG_PER_CARD, -0.4, last + 0.4);
    targetRef.current = posRef.current;
    paint();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (d.captured) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    // 引かずに押しただけなら、押した札までめくる
    if (d.moved < 6) {
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-idx]");
      const idx = hit ? Number(hit.dataset.idx) : NaN;
      if (Number.isFinite(idx) && Math.abs(idx - posRef.current) > 0.5) {
        goTo(idx);
        return;
      }
    }
    goTo(Math.round(posRef.current));
    setTimeout(() => {
      draggedRef.current = 0;
    }, 0);
  };

  return (
    <section
      aria-label="カードの束"
      className="relative overflow-hidden border-y-[3px] border-vl-ink"
      style={{ background: "var(--vl-paper-2)" }}
    >
      {/* 棚の色の地 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] transition-colors duration-500"
        style={{ background: acc.bg }}
        aria-hidden
      />
      <div className="vl-dots-fine pointer-events-none absolute inset-0 text-vl-ink opacity-20" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[minmax(0,1fr)_300px] md:items-end md:px-8 md:py-14">
        {/* 束 */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-roledescription="カードの束"
          aria-label={`${base + 1} / ${values.length} 枚目`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              goTo(targetRef.current + 1);
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              goTo(targetRef.current - 1);
            }
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="vl-deck relative h-[420px] cursor-grab touch-pan-y select-none focus:outline-none active:cursor-grabbing md:h-[520px]"
          style={{ perspective: "1400px" }}
        >
          {window_.map((idx) => {
            const v = values[idx];
            return (
              <div
                key={v.no}
                ref={(el) => {
                  if (el) cardRefs.current.set(idx, el);
                  else cardRefs.current.delete(idx);
                }}
                className="absolute top-[56%] left-[4%] w-[248px] -translate-y-1/2 md:left-[8%] md:w-[300px]"
                style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                data-idx={idx}
              >
                <ValueCard v={v} />
              </div>
            );
          })}
        </div>

        {/* いま手前にある1枚の見出しと、進み具合 */}
        <div className="relative z-10 md:pb-6 md:text-right">
          <p className="text-[13px] font-bold text-vl-ink-soft">
            {shelfById(current.shelf).no}. {shelfById(current.shelf).name}
          </p>
          <p className="font-display-ja mt-1 text-[26px] leading-tight md:text-[32px]">{current.name}</p>
          <p className="font-display-en mt-1 text-[13px] tracking-[0.12em] text-vl-red-deep uppercase">{current.en}</p>
          <Link
            href={`/values/${current.no}`}
            className="vl-offset-sm mt-4 inline-flex items-center gap-2 border-2 border-vl-ink bg-vl-ink px-4 py-2 text-[13px] font-bold text-vl-paper hover:bg-vl-red"
          >
            この1枚を開く →
          </Link>
          <div className="mt-5 flex items-center gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => goTo(targetRef.current - 1)}
              disabled={base <= 0}
              aria-label="前の1枚"
              className="grid h-9 w-9 place-items-center border-2 border-vl-ink bg-vl-card text-[16px] font-bold disabled:opacity-35"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(targetRef.current + 1)}
              disabled={base >= last}
              aria-label="次の1枚"
              className="grid h-9 w-9 place-items-center border-2 border-vl-ink bg-vl-card text-[16px] font-bold disabled:opacity-35"
            >
              →
            </button>
            <span className="font-type text-[13px] font-bold tracking-[0.08em]">
              {String(base + 1).padStart(2, "0")} / {values.length}
            </span>
          </div>
          <p className="mt-2 text-[12px] font-bold text-vl-ink-soft">ドラッグ､横スクロール､矢印キーでめくる</p>
        </div>
      </div>
    </section>
  );
}
