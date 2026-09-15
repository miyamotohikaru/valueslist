import { Fragment, type CSSProperties } from "react";
import MobileBreak from "./MobileBreak";

/**
 * 大きく組む短い文（ひとこと）を、句点・読点の位置でだけ改行し、
 * いちばん長い行が幅に収まる文字サイズにする。
 *
 * - PC: 句点で改行。wideMax 字を超える文は読点でも改行する
 * - 携帯（620px 以下）: さらに narrowMax 字を超える行を読点で改行する（MobileBreak）
 * - 文字サイズは min(上限, 容器の幅 ÷ 最長行の字数)。容器は親の `@container`（container-type: inline-size）
 */

/** 見た目の字数（半角の英数字は 0.6 字） */
function vlen(s: string) {
  let n = 0;
  for (const ch of s) n += /[\x20-\x7e]/.test(ch) ? 0.6 : 1;
  return n;
}

/** 読点で切った断片を、max 字を超えないように前から詰める */
function group(parts: string[], max: number) {
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if (cur && vlen(cur + p) > max) {
      out.push(cur);
      cur = p;
    } else cur += p;
  }
  if (cur) out.push(cur);
  return out;
}

const clauses = (s: string) => s.split(/(?<=、)/).filter(Boolean);

export function fitLines(text: string, wideMax: number, narrowMax: number) {
  const wide: string[][] = [];
  for (const s of text.split(/(?<=。)/).filter(Boolean)) {
    const wideLines = vlen(s) > wideMax ? group(clauses(s), wideMax) : [s];
    for (const wl of wideLines) wide.push(vlen(wl) > narrowMax ? group(clauses(wl), narrowMax) : [wl]);
  }
  const lw = Math.max(1, ...wide.map((w) => vlen(w.join(""))));
  const ln = Math.max(1, ...wide.flat().map(vlen));
  return { wide, lw, ln };
}

export default function FitLines({
  text,
  wideMax = 26,
  narrowMax = 15,
  maxPx = 28,
  maxPxNarrow = 20,
  className = "",
}: {
  text: string;
  wideMax?: number;
  narrowMax?: number;
  maxPx?: number;
  maxPxNarrow?: number;
  className?: string;
}) {
  const { wide, lw, ln } = fitLines(text, wideMax, narrowMax);
  const style = {
    "--fit-max": `${maxPx}px`,
    "--fit-l": (lw + 0.6).toFixed(2),
    "--fit-max-n": `${maxPxNarrow}px`,
    "--fit-ln": (ln + 0.6).toFixed(2),
  } as CSSProperties;
  return (
    <p className={`vl-fit ${className}`} style={style}>
      {wide.map((nl, i) => (
        <Fragment key={i}>
          {nl.map((t, j) => (
            <Fragment key={j}>
              {t}
              {j < nl.length - 1 && <MobileBreak />}
            </Fragment>
          ))}
          {i < wide.length - 1 && <br />}
        </Fragment>
      ))}
    </p>
  );
}
