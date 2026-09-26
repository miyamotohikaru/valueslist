"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Value } from "@/data/types";
import ValueCard from "./ValueCard";
import PrintCard from "./PrintCard";

/**
 * 列ごとに遅れて追いつくグリッド（中央距離ラグの弾性グリッド）｡
 *
 * - 札を列に振り分け､列ごとに wrapper を作る
 * - 中央の列ほど速く追いつき（ease が大きい）､端の列ほど遅れる
 * - rAF で col.y += (scrollY - col.y) * ease をまわし､translateY に (scrollY - col.y) を入れる
 *   ＝ 追いつけていない分だけ下にずれて見える｡止めれば 0 に収束して整列が戻る
 * - 「動きを減らす」設定のときは動かさない
 */
const BASE_EASE = 0.18; // 中央の列の追いつきやすさ
const EASE_STEP = 0.03; // 中央から1列離れるごとに鈍くする量
const MIN_EASE = 0.05;
const MAX_LAG = 72; // 一気に飛ばしても､この幅までしかずらさない（弓なりの形は保つ）

function colsFor(w: number, variant: "plate" | "print") {
  // 刷り札は字も余白も札の幅に比例するので､縮めても見え方は変わらない｡
  // ただし携帯で4列は細かすぎるので2列にする
  if (variant === "print") return w >= 700 ? 4 : 2;
  if (w >= 1200) return 5;
  if (w >= 1000) return 4;
  if (w >= 700) return 3;
  return 2;
}

export default function ColumnGrid({
  items,
  variant = "plate",
}: {
  items: Value[];
  /** 札の種類｡print は網をかけた刷り札（下見） */
  variant?: "plate" | "print";
}) {
  const [cols, setCols] = useState(4);
  const wrapRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef<number[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const set = () => setCols(colsFor(window.innerWidth, variant));
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [variant]);

  // 列に振り分ける（読む順が左から右になるよう､順ぐりに入れる）
  const columns = useMemo(() => {
    const out: Value[][] = Array.from({ length: cols }, () => []);
    items.forEach((v, i) => out[i % cols].push(v));
    return out;
  }, [items, cols]);

  useEffect(() => {
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    posRef.current = new Array(cols).fill(window.scrollY);
    const mid = (cols - 1) / 2;
    const eases = Array.from({ length: cols }, (_, i) =>
      Math.max(MIN_EASE, BASE_EASE - Math.abs(i - mid) * EASE_STEP),
    );

    let running = true;
    const tick = () => {
      if (!running) return;
      const y = window.scrollY;
      let moving = false;
      const ds: number[] = [];
      let peak = 0;
      for (let i = 0; i < cols; i++) {
        const p = posRef.current[i] ?? y;
        const next = p + (y - p) * eases[i];
        posRef.current[i] = next;
        const d = y - next;
        ds.push(d);
        const a = Math.abs(d);
        if (a > 0.05) moving = true;
        if (a > peak) peak = a;
      }
      // 大きく飛ばしたときは､弓なりの形を保ったまま全体を縮める
      const k = peak > MAX_LAG ? MAX_LAG / peak : 1;
      for (let i = 0; i < cols; i++) {
        const el = colRefs.current[i];
        if (el) el.style.transform = `translate3d(0, ${(ds[i] * k).toFixed(2)}px, 0)`;
      }
      // 止まったら整列に戻して､まわすのをやめる
      if (!moving) {
        for (let i = 0; i < cols; i++) {
          const el = colRefs.current[i];
          if (el) el.style.transform = "translate3d(0,0,0)";
          posRef.current[i] = y;
        }
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", kick, { passive: true });
    kick();
    return () => {
      running = false;
      window.removeEventListener("scroll", kick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      colRefs.current.forEach((el) => el && (el.style.transform = ""));
    };
  }, [cols, items]);

  return (
    // 外側で幅を測る｡札と札の間も幅に比例させるため（小さくなっても同じ間合い）
    <div className="vl-cols-box">
      <div ref={wrapRef} className={`vl-cols vl-cols--${variant}`} style={{ ["--cols" as string]: cols }}>
        {columns.map((col, i) => (
          <div
            key={i}
            className="vl-cols__col"
            ref={(el) => {
              colRefs.current[i] = el;
            }}
          >
            {col.map((v, k) =>
              variant === "print" ? <PrintCard key={v.no} v={v} /> : <ValueCard key={v.no} v={v} index={k} />,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
