import type { Trend, Value } from "@/data/types";
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

/** いまの扱い｡札の右上に出す */
const STATE: Record<Trend, string> = {
  up: "現行・拡大中",
  steady: "現行",
  down: "現行・減少中",
  discontinued: "廃番",
  restocked: "再入荷",
};

/** 左に製造年､右に廃番年か再入荷年｡無ければ現行 */
function dates(v: Value) {
  const made = v.made ? `${v.made.approx ? "c." : ""}${v.made.year}` : "—";
  if (v.restocked) return [
    { k: "製造 MFD", t: made },
    { k: "再入荷 RESTOCK", t: String(v.restocked.year) },
  ];
  if (v.discontinued) return [
    { k: "製造 MFD", t: made },
    { k: "廃番 EOL", t: String(v.discontinued.year) },
  ];
  return [
    { k: "製造 MFD", t: made },
    { k: "現行 NOW", t: "NOW" },
  ];
}

export default function PrintCard({ v }: { v: Value }) {
  const r = RECIPES[v.no];
  if (!r) return null;
  const [left, right] = dates(v);

  return (
    // 外の枠で幅を測る｡札そのものに container-type を置くと
    // 札自身の padding には効かないので､いつも同じ大きさにならない
    <div className="vl-print-wrap">
      <article
        className="vl-print"
        style={{
          ["--card" as string]: r.card,
          ["--panel" as string]: r.panel,
        }}
      >
        <div className="vl-print__top">
          <span>NO.{v.no}</span>
          <span className={v.trend === "discontinued" ? "is-eol" : undefined}>{STATE[v.trend]}</span>
        </div>

        <HalftoneArt no={v.no} tech={r.tech} ink={r.ink} />

        <h3 className="vl-print__name">{v.name}</h3>
        <p className="vl-print__latin">
          <span>{v.en.toUpperCase()}</span>
          <span>{v.reading}</span>
        </p>
        <p className="vl-print__body">{v.meaning ?? v.hitokoto}</p>

        <div className="vl-print__data">
          <div>
            <span className="vl-print__k">{left.k}</span>
            <b className="vl-print__v">{left.t}</b>
          </div>
          <div>
            <span className="vl-print__k">{right.k}</span>
            <b className="vl-print__v">{right.t}</b>
          </div>
        </div>

        <div className="vl-print__foot">
          <span>{r.label}</span>
        </div>
      </article>
    </div>
  );
}
