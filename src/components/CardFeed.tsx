"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Value } from "@/data/types";
import { shelfById, categoryMeta } from "@/data/shelves";
import ValueCard from "./ValueCard";

/**
 * 縦に送るカードの並び｡
 * 1行ごとに､後ろへ大きな英名を敷き､その上にカードを重ねる｡
 * 画面の真ん中に来た1枚がいちばん大きく､離れるほど小さく薄くなる（スクロールに連れて変わる）｡
 */
export default function CardFeed({ values }: { values: Value[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef(0);

  const paint = useCallback(() => {
    rafRef.current = 0;
    const vh = window.innerHeight;
    const mid = vh / 2;
    for (const row of rowsRef.current) {
      const r = row.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue; // 画面から遠い行は触らない
      const t = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / (vh * 0.62)));
      const a = Math.abs(t);
      row.style.setProperty("--f", (1 - a).toFixed(3));
      row.style.setProperty("--t", t.toFixed(3));
    }
  }, []);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
  }, [paint]);

  useEffect(() => {
    rowsRef.current = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-row]") ?? []);
    paint();
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      rowsRef.current.forEach((row) => {
        row.style.setProperty("--f", "1");
        row.style.setProperty("--t", "0");
      });
      return;
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [paint, schedule, values]);

  return (
    <div ref={rootRef} className="vl-feed">
      {values.map((v) => {
        const shelf = shelfById(v.shelf);
        return (
          <article key={v.no} data-row className="vl-feed__row">
            {/* 行の頭の細い罫と、小さな見出し */}
            <div className="vl-feed__meta">
              <span>
                {shelf.no}. {shelf.name}
              </span>
              <span>
                {v.category} · {categoryMeta[v.category].en}
              </span>
            </div>

            {/* 後ろに敷く大きな英名 */}
            <p className="vl-feed__title font-display-en" aria-hidden>
              {v.en}
            </p>

            {/* 手前のカード */}
            <div className="vl-feed__card">
              <ValueCard v={v} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
