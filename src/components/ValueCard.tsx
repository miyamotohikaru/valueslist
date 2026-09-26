import Link from "next/link";
import type { Value, Trend } from "@/data/types";
import { categoryMeta } from "@/data/shelves";
import Art from "./art";

/**
 * 札の地｡棚ではなく型番で決める（並べたときに一枚ずつ色が変わる）｡
 * 12枚でひと回りする順にして､隣とも上下とも同じ色が来ないようにしてある｡
 */
const GROUNDS = [
  { bg: "var(--vl-kraft)", dark: false },
  { bg: "var(--vl-sky)", dark: false },
  { bg: "var(--vl-peach)", dark: false },
  { bg: "var(--vl-sage)", dark: false },
  { bg: "var(--vl-concrete)", dark: false },
  { bg: "var(--vl-lavender)", dark: false },
  { bg: "var(--vl-indigo)", dark: true },
  { bg: "var(--vl-kraft)", dark: false },
  { bg: "var(--vl-sage)", dark: false },
  { bg: "var(--vl-sky)", dark: false },
  { bg: "var(--vl-peach)", dark: false },
  { bg: "var(--vl-sumi)", dark: true },
];

export function groundOf(v: Value) {
  // メタ標本（偽ヴィンテージ）だけは墨で固定する
  if (v.shelf === "meta") return { bg: "var(--vl-sumi)", dark: true };
  return GROUNDS[(Number(v.no) - 1 + 12) % 12];
}

/** 棚の色（索引の見出しなど､札の外で使う） */
export const SHELF_ACCENT: Record<string, { bg: string; fg: string; bar: string }> = {
  "1": { bg: "var(--vl-kraft)", fg: "var(--vl-ink)", bar: "var(--vl-ink)" },
  "2": { bg: "var(--vl-concrete)", fg: "var(--vl-ink)", bar: "var(--vl-ink)" },
  "3": { bg: "var(--vl-sage)", fg: "var(--vl-ink)", bar: "var(--vl-ink)" },
  "4": { bg: "var(--vl-sky)", fg: "var(--vl-ink)", bar: "var(--vl-ink)" },
  "5": { bg: "var(--vl-lavender)", fg: "var(--vl-ink)", bar: "var(--vl-ink)" },
  meta: { bg: "var(--vl-sumi)", fg: "var(--vl-paper)", bar: "var(--vl-paper)" },
};

/** 名前を読点のあとで行に分ける */
export function nameLines(name: string): string[] {
  return name.split(/(?<=[､、])/).filter(Boolean);
}

const visualLen = (s: string) => [...s].reduce((a, ch) => a + (/[\x20-\x7e]/.test(ch) ? 0.55 : 1), 0);

/** 旧 API（他のページがまだ呼ぶ） */
export function nameSize(name: string) {
  return Math.min(12, 84 / Math.max(...nameLines(name).map(visualLen), 1));
}

const GLYPH: Record<Trend, string> = {
  up: "↑",
  steady: "→",
  down: "↘",
  discontinued: "×",
  restocked: "↻",
};
const STATE: Record<Trend, string> = {
  up: "現行・拡大中",
  steady: "現行",
  down: "現行・減少中",
  discontinued: "廃番",
  restocked: "再入荷",
};

/** 型番から作る縞（札らしさのための飾り） */
function Barcode({ no, className = "" }: { no: string; className?: string }) {
  let h = 7;
  for (const c of no) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 26; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const w = 1 + (h % 3);
    bars.push({ x, w });
    x += w + 1 + ((h >> 8) % 2);
  }
  return (
    <svg viewBox={`0 0 ${x} 14`} className={className} preserveAspectRatio="none" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="14" fill="currentColor" />
      ))}
    </svg>
  );
}

export default function ValueCard({
  v,
  index = 0,
  interactive = true,
}: {
  v: Value;
  index?: number;
  /** false のとき､リンクにせず絵柄だけを描く */
  interactive?: boolean;
}) {
  const ground = groundOf(v);
  const shelfNo = v.shelf === "meta" ? "M" : String(v.shelf);
  const lines = nameLines(v.name);
  const nameLen = Math.max(...lines.map(visualLen), 1);
  const cat = categoryMeta[v.category];

  const left = v.made
    ? { k: "製造 MFD", t: `${v.made.approx ? "c." : ""}${v.made.year}` }
    : { k: "製造 MFD", t: "—" };
  const right = v.restocked
    ? { k: "再入荷 RESTOCK", t: String(v.restocked.year) }
    : v.discontinued
      ? { k: "廃番 EOL", t: String(v.discontinued.year) }
      : { k: "現行 NOW", t: "NOW" };

  const body = (
    <article
      className={`vl-plate${ground.dark ? " is-dark" : ""}`}
      style={{
        ["--plate-bg" as string]: ground.bg,
        ["--name-len" as string]: nameLen.toFixed(1),
      }}
    >
      <div className="vl-plate__top">
        <span className="vl-plate__lead">
          <span className="vl-plate__shelf" aria-label={`棚 ${shelfNo}`}>
            {shelfNo}
          </span>
          NO.{v.no}
        </span>
        <span>
          {cat.en} / {v.category}
        </span>
      </div>

      <div className="vl-plate__art">
        <Art no={v.no} className="vl-plate__art-svg" />
      </div>

      <div className="vl-plate__id">
        <h3 className="vl-plate__name">
          {lines.map((l, k) => (
            <span key={k} className="block">
              {l}
            </span>
          ))}
        </h3>
        <span className={`vl-plate__glyph${v.trend === "discontinued" ? " is-eol" : ""}`} aria-hidden>
          {GLYPH[v.trend]}
        </span>
      </div>
      <p className="vl-plate__latin">
        <span className="vl-plate__en">{v.en.toUpperCase()}</span>
        <span className="vl-plate__reading">{v.reading}</span>
      </p>

      <p className="vl-plate__meaning">{v.meaning ?? v.hitokoto}</p>

      <div className="vl-plate__data">
        <div>
          <span className="vl-plate__k">{left.k}</span>
          <b className="vl-plate__v">{left.t}</b>
        </div>
        <div>
          <span className="vl-plate__k">{right.k}</span>
          <b className="vl-plate__v">{right.t}</b>
        </div>
      </div>

      <div className="vl-plate__foot">
        <p className="vl-plate__state">{STATE[v.trend]}</p>
        <p className="vl-plate__src">
          <span>
            VL-{v.no} / {v.evidence === "law" ? "SRC: 法令・初出" : "SRC: 統計"}
          </span>
          <Barcode no={v.no} className="vl-plate__bars" />
        </p>
      </div>
    </article>
  );

  if (!interactive) {
    return (
      <div className="vl-card-wrap" aria-hidden>
        {body}
      </div>
    );
  }

  return (
    <Link href={`/values/${v.no}`} className="vl-card-wrap" style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
      {body}
    </Link>
  );
}
