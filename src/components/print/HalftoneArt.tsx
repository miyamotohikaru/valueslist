"use client";

import { useEffect, useRef } from "react";
import { PLATES } from "./plates";
import { makePlate, screenPlate, type Technique } from "./screen";

/**
 * 図版｡灰色の版に描いてから網にかけたものを2枚（墨と色）重ねて出す｡
 *
 * **一度だけ刷って､あとは動かさない｡** 動きは CSS の keyframes に任せる
 * （上の墨が下がって色が差し､また戻る）｡以前はスクロールのたびに
 * 刷り直していたが､点刻だと1枚で2万近い点を打つので､48枚ぶんが
 * スクロール中ずっと走って重かった｡
 *
 * 動かすのは画面に入っているあいだだけ｡ただし札ごとに時計を持たせると
 * 入ってきた順にずれていくので､ページ共通の時計（document.timeline）から
 * 今の位相を出して負の遅延で合わせる｡どの札も同じ拍子で一斉に動く｡
 */
const PLATE_SIZE = 320;

/** 図版が一巡する時間（秒）｡globals.css の vl-wipe と揃えること */
const CYCLE = 8;

export type ArtInk = {
  /** 墨の版 */
  inkFg: string;
  inkBg: string;
  /** 色の版 */
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
  const box = useRef("");

  useEffect(() => {
    const el = wrap.current;
    const a = cColor.current;
    const b = cInk.current;
    const draw = PLATES[no];
    if (!el || !a || !b || !draw) return;

    let plate: ReturnType<typeof makePlate> | null = null;

    /** 枠の大きさで一度だけ刷る｡大きさが変わったときだけ刷り直す */
    const print = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 8 || h < 8) return;
      const key = `${w}x${h}`;
      if (box.current === key) return;
      box.current = key;
      if (!plate) plate = makePlate(PLATE_SIZE, draw);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      for (const c of [a, b]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      }
      for (const [c, fg, bg] of [
        [a, ink.colorFg, ink.colorBg],
        [b, ink.inkFg, ink.inkBg],
      ] as const) {
        const g = c.getContext("2d")!;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        screenPlate(g, plate, w, h, tech, 0, { fg, bg });
      }
    };

    // 枠の大きさが決まった時点で刷る｡
    // 画面に入った瞬間だと､まだ高さが 0 のことがあって刷り損ねる
    const ro = new ResizeObserver(() => print());
    ro.observe(el);

    // 動かすのは画面に入っているあいだだけ｡
    // 途中から動き出しても他の札と足並みが揃うよう､共通の時計から位相を出す
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          const now = Number(document.timeline.currentTime ?? 0) / 1000;
          el.style.setProperty("--art-delay", `${(-(now % CYCLE)).toFixed(3)}s`);
          el.dataset.on = "1";
        } else {
          delete el.dataset.on;
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [no, tech, ink.inkFg, ink.inkBg, ink.colorFg, ink.colorBg]);

  return (
    <div ref={wrap} className={`vl-print__art ${className}`}>
      <canvas ref={cColor} className="vl-print__layer" aria-hidden />
      <canvas ref={cInk} className="vl-print__layer vl-print__layer--ink" aria-hidden />
    </div>
  );
}
