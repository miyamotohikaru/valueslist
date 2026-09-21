"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Value } from "@/data/types";
import { shelfById } from "@/data/shelves";
import ValueCard, { SHELF_ACCENT } from "./ValueCard";

/**
 * カードを1枚ずつ送る｡真ん中の1枚が大きく､左右に次と前が覗く｡
 * ドラッグ・横スクロール・矢印キー・左右のボタンで送り､真ん中を押すと開く｡
 * 位置は rAF で追い､札の変形は style に直接書く（枚数が増えても描き直さない）｡
 */
const SIDE = 0.78; // 1枚ごとの横のずれ（カード幅に対する割合）
const NEAR = 3; // 左右に見せる枚数
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function CardPager({ values }: { values: Value[] }) {
  const [base, setBase] = useState(0);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const dragRef = useRef<{ id: number; x: number; from: number; moved: number; captured?: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<number, HTMLDivElement>());
  const rafRef = useRef(0);
  const wheelLock = useRef(0);
  const last = Math.max(0, values.length - 1);

  // 並びや絞り込みが変わったら先頭に戻す
  useEffect(() => {
    posRef.current = 0;
    targetRef.current = 0;
    setBase(0);
  }, [values]);

  const window_ = useMemo(() => {
    const out: number[] = [];
    for (let i = Math.max(0, base - NEAR); i <= Math.min(last, base + NEAR); i++) out.push(i);
    return out;
  }, [base, last]);

  const current = values[clamp(base, 0, last)];
  const acc = current ? SHELF_ACCENT[String(current.shelf)] : null;

  const paint = useCallback(() => {
    const pos = posRef.current;
    const w = stageRef.current?.querySelector<HTMLElement>("[data-idx]")?.offsetWidth ?? 320;
    cardRefs.current.forEach((el, idx) => {
      const d = idx - pos;
      const a = Math.abs(d);
      if (a > NEAR + 0.5) {
        el.style.visibility = "hidden";
        return;
      }
      el.style.visibility = "visible";
      const x = d * w * SIDE;
      const scale = 1 - Math.min(a, 3) * 0.085;
      const rotY = clamp(-d * 11, -33, 33);
      const op = clamp(1 - Math.min(a, 3) * 0.3, 0, 1);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${(a * 6).toFixed(1)}px, ${(-a * 60).toFixed(0)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = String(op);
      el.style.zIndex = String(100 - Math.round(a * 10));
      el.style.pointerEvents = a < 1.5 ? "auto" : "none";
      el.style.cursor = a < 0.5 ? "pointer" : "grab";
      const link = el.firstElementChild as HTMLElement | null;
      if (link) link.style.pointerEvents = a < 0.5 ? "auto" : "none";
    });
  }, []);

  const tick = useCallback(() => {
    const diff = targetRef.current - posRef.current;
    if (Math.abs(diff) < 0.0015) {
      posRef.current = targetRef.current;
      paint();
      rafRef.current = 0;
      return;
    }
    posRef.current += diff * 0.2;
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

  useEffect(() => {
    paint();
  }, [paint, window_]);

  useEffect(() => {
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [paint]);

  // 横のスクロールだけ受ける（縦はページに渡す）
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const next = targetRef.current + (e.deltaX > 0 ? 1 : -1);
      if (next < 0 || next > last) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 150) return;
      wheelLock.current = now;
      goTo(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, last]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { id: e.pointerId, x: e.clientX, from: targetRef.current, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved > 6 && !d.captured) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      d.captured = true;
    }
    const w = stageRef.current?.querySelector<HTMLElement>("[data-idx]")?.offsetWidth ?? 320;
    posRef.current = clamp(d.from - dx / (w * 0.62), -0.4, last + 0.4);
    targetRef.current = posRef.current;
    paint();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (d.captured) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (d.moved < 6) {
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-idx]");
      const idx = hit ? Number(hit.dataset.idx) : NaN;
      if (Number.isFinite(idx) && Math.abs(idx - posRef.current) > 0.5) {
        goTo(idx);
        return;
      }
    }
    goTo(Math.round(posRef.current));
  };

  if (!current) return null;
  const shelf = shelfById(current.shelf);

  return (
    <section aria-label="カードを送る" className="relative">
      {/* 手前の1枚の棚の色が、うっすら後ろに広がる */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] transition-colors duration-500"
        style={{
          background: `radial-gradient(60% 55% at 50% 42%, ${acc?.bg ?? "transparent"} 0%, transparent 70%)`,
          transitionTimingFunction: "var(--vl-ease-emph)",
        }}
        aria-hidden
      />

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="カードの束"
        aria-label={`${base + 1} / ${values.length} 枚目 ${current.name}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            goTo(targetRef.current + 1);
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            goTo(targetRef.current - 1);
          }
          if (e.key === "Home") goTo(0);
          if (e.key === "End") goTo(last);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="vl-deck vl-focus relative h-[440px] cursor-grab touch-pan-y select-none md:h-[520px]"
        style={{ perspective: "1600px" }}
      >
        {window_.map((idx) => (
          <div
            key={values[idx].no}
            data-idx={idx}
            ref={(el) => {
              if (el) cardRefs.current.set(idx, el);
              else cardRefs.current.delete(idx);
            }}
            className="absolute top-1/2 left-1/2 w-[74vw] max-w-[320px] -translate-x-1/2 -translate-y-1/2 md:w-[330px] md:max-w-none"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            <ValueCard v={values[idx]} />
          </div>
        ))}
      </div>

      {/* 送りの操作 */}
      <div className="mx-auto mt-2 flex max-w-[560px] items-center gap-4 px-1">
        <button
          type="button"
          onClick={() => goTo(targetRef.current - 1)}
          disabled={base <= 0}
          aria-label="前の1枚"
          className="vl-btn-round"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="h-[3px] w-full bg-vl-ink/20">
            <div
              className="vl-ease-emph h-full bg-vl-ink transition-[width] duration-300"
              style={{ width: `${((base + 1) / values.length) * 100}%` }}
            />
          </div>
          <p className="font-type mt-2 text-center text-[12px] font-bold tracking-[0.1em]">
            {String(base + 1).padStart(3, "0")} / {String(values.length).padStart(3, "0")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => goTo(targetRef.current + 1)}
          disabled={base >= last}
          aria-label="次の1枚"
          className="vl-btn-round"
        >
          →
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <p className="text-[13px] font-bold text-vl-ink-soft">
          {shelf.no}. {shelf.name}
        </p>
        <Link href={`/values/${current.no}`} className="vl-btn-solid">
          {current.name} を開く →
        </Link>
        <p className="text-[12px] font-bold text-vl-ink-soft">ドラッグ､横スクロール､矢印キーで送る · 真ん中を押すと開く</p>
      </div>
    </section>
  );
}
