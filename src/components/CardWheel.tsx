"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Value } from "@/data/types";
import { shelfById } from "@/data/shelves";
import ValueCard, { SHELF_ACCENT } from "./ValueCard";

/**
 * 半円に広げた札｡いちばん上の1枚が表で､左右へ順に並ぶ｡
 * 払う・横にはじく・矢印キー・札を押すで回り､端まで行くと先頭へ戻る｡
 *
 * 位置は CSS 変数（--a 角度）だけを書き換え､遷移で動かす｡
 */
const SPAN = 180; // 全体で描く角度
const GAP = 5.5; // 真ん中の札の左右に足す隙間
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CardWheel({ values }: { values: Value[] }) {
  const n = values.length;
  const [i, setI] = useState(0);
  const [dealt, setDealt] = useState(false);
  const [settled, setSettled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; x: number; from: number; moved: number; captured?: boolean } | null>(null);
  const wheelLock = useRef(0);

  useEffect(() => {
    setI(0);
  }, [values]);

  const step = SPAN / Math.max(n, 1);
  const half = Math.floor(n / 2);

  /** 何番目の札かを､真ん中からの差（輪になっている）に直す */
  const deltaOf = useCallback(
    (k: number) => {
      let d = k - i;
      if (d > half) d -= n;
      if (d < -half) d += n;
      return d;
    },
    [half, i, n],
  );

  const goTo = useCallback(
    (k: number) => {
      if (n === 0) return;
      setI(((k % n) + n) % n);
    },
    [n],
  );

  const current = values[clamp(i, 0, Math.max(0, n - 1))];
  const acc = current ? SHELF_ACCENT[String(current.shelf)] : null;

  /* 画面に入ったら広げる */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduced() || typeof IntersectionObserver === "undefined") {
      setDealt(true);
      setSettled(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        requestAnimationFrame(() => setDealt(true));
        setTimeout(() => setSettled(true), 560 + Math.min(values.length, 26) * 22 + 120);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [values.length]);

  /* 横のはじきだけ受ける（縦はページに渡す） */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 130) return;
      wheelLock.current = now;
      goTo(i + (e.deltaX > 0 ? 1 : -1));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, i]);

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
    if (d.captured) goTo(d.from - Math.round(dx / 28));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (d.captured) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const slots = useMemo(() => values.map((v, k) => ({ v, k })), [values]);

  if (!current) return null;
  const shelf = shelfById(current.shelf);

  return (
    <section
      ref={rootRef}
      className={`vl-wheel${dealt ? " is-dealt" : ""}${settled ? " is-settled" : ""}`}
      aria-label="札を広げた盤"
      tabIndex={0}
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
        if (e.key === "End") goTo(n - 1);
      }}
      style={{ ["--felt" as string]: acc?.bg }}
    >
      <div className="vl-wheel__felt" aria-hidden />

      {/* いま上にある1枚 */}
      <div className="vl-wheel__head">
        <p className="vl-wheel__shelf">
          {shelf.no}. {shelf.name}
        </p>
        <p className="font-type vl-wheel__count">
          {String(i + 1).padStart(3, "0")} / {String(n).padStart(3, "0")}
        </p>
      </div>

      <div className="vl-wheel__arc">
        {slots.map(({ v, k }) => {
          const d = deltaOf(k);
          const on = d === 0;
          // 真ん中の左右だけ少し広げて､上の1枚を読めるようにする
          const a = d * step + Math.sign(d) * GAP * Math.exp(-Math.abs(d) / 2.2);
          return (
            <button
              key={v.no}
              type="button"
              aria-label={`${k + 1}枚目 ${v.name}`}
              aria-current={on ? "true" : undefined}
              onClick={() => {
                if ((dragRef.current?.moved ?? 0) > 8) return;
                goTo(k);
              }}
              className={`vl-wheel__slot${on ? " is-on" : ""}`}
              style={{
                ["--a" as string]: a.toFixed(2),
                ["--z" as string]: 200 - Math.abs(d),
                ["--o" as string]: (1 - Math.min(Math.abs(d), 22) * 0.014).toFixed(3),
                ["--delay" as string]: `${Math.min(Math.abs(d), 26) * 22}ms`,
              }}
            >
              <span className="vl-wheel__card">
                <ValueCard v={v} interactive={false} />
              </span>
            </button>
          );
        })}
      </div>

      {/* 上の1枚を開く */}
      <div className="vl-wheel__foot">
        <Link href={`/values/${current.no}`} className="vl-btn-solid">
          {current.name} を開く →
        </Link>
        <p className="vl-wheel__hint">札を押す · 横に払う · ← → で回す</p>
      </div>
    </section>
  );
}
