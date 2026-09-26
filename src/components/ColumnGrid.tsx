"use client";

import { useEffect, useMemo, useState } from "react";
import type { Value } from "@/data/types";
import ValueCard from "./ValueCard";
import PrintCard from "./PrintCard";

/**
 * 札を列に振り分けて並べるだけのグリッド｡
 * 読む順が左から右になるよう､順ぐりに列へ入れる｡
 */
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
  /** 札の種類｡print は網をかけた刷り札 */
  variant?: "plate" | "print";
}) {
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const set = () => setCols(colsFor(window.innerWidth, variant));
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [variant]);

  const columns = useMemo(() => {
    const out: Value[][] = Array.from({ length: cols }, () => []);
    items.forEach((v, i) => out[i % cols].push(v));
    return out;
  }, [items, cols]);

  return (
    <div className="vl-cols-box">
      <div className={`vl-cols vl-cols--${variant}`} style={{ ["--cols" as string]: cols }}>
        {columns.map((col, i) => (
          <div key={i} className="vl-cols__col">
            {col.map((v, k) =>
              variant === "print" ? <PrintCard key={v.no} v={v} /> : <ValueCard key={v.no} v={v} index={k} />,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
