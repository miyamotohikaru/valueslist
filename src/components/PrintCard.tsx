import type { Value } from "@/data/types";
import HalftoneArt, { type ArtInk } from "./print/HalftoneArt";
import type { Technique } from "./print/screen";

/**
 * 刷り札｡
 *
 * 図版は墨の版と色の版を2枚刷って重ねてある｡
 * スクロールすると上の墨が下がって､色が上から回ってくる｡
 */

const CREAM = "#f2eee2";

type Recipe = {
  tech: Technique;
  /** 網の呼び名（和 / 欧） */
  label: string;
  ink: ArtInk;
  /** 札の地｡図版の枠の地はこれより少し沈める */
  card: string;
  panel: string;
};

const RECIPES: Record<string, Recipe> = {
  "001": {
    tech: "halftone",
    label: "網点 HALFTONE · AM",
    card: "#f3f0e7",
    panel: "#eae5d6",
    ink: { inkFg: "#1c1b19", inkBg: "transparent", colorFg: "#c8431d", colorBg: "transparent" },
  },
  "002": {
    tech: "linescreen",
    label: "線網 LINE SCREEN",
    card: "#f1eee4",
    panel: "#e7e4d6",
    ink: { inkFg: "#1c1b19", inkBg: "transparent", colorFg: "#26348c", colorBg: "transparent" },
  },
  "003": {
    tech: "stipple",
    label: "点刻 STIPPLE",
    card: "#f3efe4",
    panel: "#ece6d8",
    // 色が回ると地ごと裏返る｡下の版が透けないよう墨の版にも地を敷く
    ink: { inkFg: "#1c1b19", inkBg: "#ece6d8", colorFg: CREAM, colorBg: "#9e2b45" },
  },
  "004": {
    tech: "contour",
    label: "等高 CONTOUR",
    card: "#f0eee3",
    panel: "#e4e5d5",
    ink: { inkFg: "#1c1b19", inkBg: "transparent", colorFg: "#2f6b45", colorBg: "transparent" },
  },
  "005": {
    tech: "solarise",
    label: "反転 SOLARISATION",
    card: "#f3f0e6",
    panel: "#ebe4d2",
    ink: { inkFg: "#1c1b19", inkBg: "transparent", colorFg: "#a8761a", colorBg: "transparent" },
  },
};

function years(v: Value) {
  const made = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  if (v.restocked) return `${made} → ${v.restocked.year} 再入荷`;
  if (v.discontinued) return `${made} → ${v.discontinued.year} 廃番`;
  return `${made} → 現行`;
}

export default function PrintCard({ v }: { v: Value }) {
  const r = RECIPES[v.no];
  if (!r) return null;

  return (
    <article
      className="vl-print"
      style={{
        ["--card" as string]: r.card,
        ["--panel" as string]: r.panel,
      }}
    >
      <HalftoneArt no={v.no} tech={r.tech} ink={r.ink} />

      <h3 className="vl-print__name">{v.name}</h3>
      <p className="vl-print__latin">
        {v.en.toUpperCase()} · {v.reading}
      </p>
      <p className="vl-print__body">{v.meaning ?? v.hitokoto}</p>

      <div className="vl-print__foot">
        <span>{r.label}</span>
        <span>{years(v)}</span>
      </div>
    </article>
  );
}
