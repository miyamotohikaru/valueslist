"use client";

import { useEffect, useRef } from "react";
import { PLATES } from "./plates";
import { makePlate, screenPlate, type Plate, type Technique } from "./screen";

/** ひと回りの枚数｡この数だけ網を送ると元の網に戻る */
const FRAMES = 6;
/** ひと回りに要るスクロール量（px）｡送るたびに色が上から回って抜ける */
const CYCLE = 520;
const PLATE_SIZE = 320;

/** スクロールを1本にまとめる（札が増えても listener はひとつ） */
type Sub = () => void;
const subs = new Set<Sub>();
let raf = 0;
function kick() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    subs.forEach((f) => f());
  });
}
function subscribe(f: Sub) {
  if (subs.size === 0) {
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
  }
  subs.add(f);
  kick();
  return () => {
    subs.delete(f);
    if (subs.size === 0) {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    }
  };
}

export type ArtInk = {
  /** 刷り上がり前｡墨の版 */
  inkFg: string;
  inkBg: string;
  /** 色が回ったあと */
  colorFg: string;
  colorBg: string;
};

export default function HalftoneArt({
  no,
  tech,
  ink,
  className = "",
}: {
  no: string;
  tech: Technique;
  ink: ArtInk;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cColor = useRef<HTMLCanvasElement>(null);
  const cInk = useRef<HTMLCanvasElement>(null);
  const plate = useRef<Plate | null>(null);
  const frame = useRef(-1);
  const box = useRef("");

  useEffect(() => {
    const el = wrap.current;
    const a = cColor.current;
    const b = cInk.current;
    const draw = PLATES[no];
    if (!el || !a || !b || !draw) return;

    plate.current = makePlate(PLATE_SIZE, draw);
    frame.current = -1;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 枠全体が色に染まる札（網の｢反転｣とは別）は変化が強いので､回るのを3回に1回にする
    const cycle = ink.colorBg === "transparent" ? CYCLE : CYCLE * 3;
    const lead = (Number(no) * 173) % cycle;

    /** 版を2枚（墨と色）刷る */
    const print = (f: number) => {
      const p = plate.current;
      if (!p) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 8 || h < 8) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const key = `${w}x${h}`;
      if (box.current !== key) {
        box.current = key;
        for (const c of [a, b]) {
          c.width = Math.round(w * dpr);
          c.height = Math.round(h * dpr);
          c.style.width = `${w}px`;
          c.style.height = `${h}px`;
        }
      }
      for (const [c, fg, bg] of [
        [a, ink.colorFg, ink.colorBg],
        [b, ink.inkFg, ink.inkBg],
      ] as const) {
        const g = c.getContext("2d")!;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        screenPlate(g, p, w, h, tech, f, { fg, bg });
      }
    };

    let seen = true;
    const tick = () => {
      if (!seen) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (still) {
        el.style.setProperty("--p", "1");
        if (frame.current !== 0 || box.current !== `${el.clientWidth}x${el.clientHeight}`) {
          frame.current = 0;
          print(0);
        }
        return;
      }
      // 札が動いた距離をそのまま送りにする｡止めるまで何度でも回る
      // 型番でずらしてあるので､並べたとき一斉には変わらない
      const travel = (vh - r.top + lead) / cycle;
      const turn = travel - Math.floor(travel);
      // 三角の波｡色が上から差してきて､また抜けていく
      const p = 1 - Math.abs(1 - turn * 2);
      el.style.setProperty("--p", p.toFixed(3));
      const f = Math.floor(travel * FRAMES) % FRAMES;
      const fi = f < 0 ? f + FRAMES : f;
      if (fi !== frame.current || box.current !== `${el.clientWidth}x${el.clientHeight}`) {
        frame.current = fi;
        print(fi);
      }
    };

    // 画面の外では刷り直さない
    const io = new IntersectionObserver(
      (es) => {
        seen = es[0].isIntersecting;
        if (seen) tick();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);

    const off = subscribe(tick);
    tick();
    return () => {
      io.disconnect();
      off();
    };
  }, [no, tech, ink.inkFg, ink.inkBg, ink.colorFg, ink.colorBg]);

  return (
    <div ref={wrap} className={`vl-print__art ${className}`}>
      <canvas ref={cColor} className="vl-print__layer" aria-hidden />
      <canvas ref={cInk} className="vl-print__layer vl-print__layer--ink" aria-hidden />
    </div>
  );
}
