"use client";

import { useCallback, useRef, type ReactNode } from "react";

/**
 * 中のカードが、カーソルの位置へ少しだけ傾くようにする。
 * カード1枚ずつに listener を付けず、この囲いで1つだけ使う。
 */
export default function Tilt({
  children,
  selector = ".vl-card-wrap",
  className = "",
}: {
  children: ReactNode;
  selector?: string;
  className?: string;
}) {
  const last = useRef<HTMLElement | null>(null);

  const clear = useCallback(() => {
    if (!last.current) return;
    last.current.style.removeProperty("--tx");
    last.current.style.removeProperty("--ty");
    last.current = null;
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as HTMLElement).closest<HTMLElement>(selector);
      if (el !== last.current) clear();
      if (!el) return;
      last.current = el;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--tx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      el.style.setProperty("--ty", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    },
    [selector, clear],
  );

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={clear}>
      {children}
    </div>
  );
}
