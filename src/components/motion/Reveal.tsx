"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * 画面に入ったときに､中身をふわっと出す｡
 * 中に `.vl-draw` の線があれば､その線を引く動きも付ける｡
 * 対応していない環境や｢動きを減らす｣設定のときは､そのまま出す｡
 */
const reduced = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // 線を引く動きの準備｡実際の線の長さを測って､いったん隠す
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    el.querySelectorAll<SVGPathElement>(".vl-draw").forEach((path) => {
      const len = path.getTotalLength?.();
      if (!len || !Number.isFinite(len)) return;
      const d = String(Math.ceil(len));
      path.style.strokeDasharray = d;
      path.style.strokeDashoffset = d;
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // 何かの理由で観測が働かないときの保険（中身が消えたままにしない）
    const t = setTimeout(() => setInView(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  // 見えたら線を引く｡引き終わったら破線の指定を外して､実線に戻す
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || reduced()) return;
    const paths = el.querySelectorAll<SVGPathElement>(".vl-draw");
    const running: Animation[] = [];
    paths.forEach((path, i) => {
      const len = path.getTotalLength?.();
      if (!len || !Number.isFinite(len)) return;
      const d = Math.ceil(len);
      const anim = path.animate([{ strokeDashoffset: d }, { strokeDashoffset: 0 }], {
        duration: Math.min(1400, 420 + len * 1.4),
        delay: delay + 120 + i * 90,
        easing: "cubic-bezier(.35,.9,.4,1)",
        fill: "forwards",
      });
      running.push(anim);
      anim.finished
        .then(() => {
          path.style.strokeDasharray = "";
          path.style.strokeDashoffset = "";
          anim.cancel();
        })
        .catch(() => {});
    });
    return () => running.forEach((a) => a.cancel());
  }, [inView, delay]);

  return (
    <div
      ref={ref}
      className={`vl-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
